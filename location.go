package main

import (
	picarus "github.com/bwhite/picarus/go"
	picarusto "github.com/bwhite/picarus_takeout/go"
	"encoding/json"
	"fmt"
	"strconv"
	"bytes"
	"net/http"
	"io/ioutil"
	"html/template"
	"github.com/ugorji/go/codec"
	"code.google.com/p/google-api-go-client/mirror/v1"
)


func SensorsHandler(w http.ResponseWriter, r *http.Request) {
	
	fmt.Println("Got sensor")
}

func ImagesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got image")
	b := make([]byte, 0, 1048576)
	f, _, err := r.FormFile("image")
	if err != nil {
		fmt.Println("Couldn't get param")
		return
	}
	n, err := f.Read(b)
	if err != nil {
		fmt.Println("Couldn't read")
		return
	}
	fmt.Println(n)
	fmt.Println(b[0:n])
}

func LocationHandler(w http.ResponseWriter, r *http.Request) {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	fmt.Println(conn)
	fmt.Println("Got notify...")
    not := new(mirror.Notification)
    if err := json.NewDecoder(r.Body).Decode(not); err != nil {
        fmt.Println(fmt.Errorf("Unable to decode notification: %v", err))
        return
    }
	fmt.Println(not)
	if not.Operation != "UPDATE" {
		fmt.Println("Not an update, quitting...")
		return
	}
    userId := not.UserToken
	itemId := not.ItemId
	fmt.Println(userId)
	fmt.Println(itemId)
	trans := authTransport(userId)


	svc, _ := mirror.New(trans.Client())

	loc, _ := svc.Locations.Get("latest").Do()
	locSer, err := json.Marshal(loc)
	if err == nil {
		setUserAttribute(userId, "latest_location", string(locSer))
	}
	
	//loc.Latitude
	//fmt.Println(*loc)
}

func LocationOnHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}
	userId, err := userID(r)
	if err != nil {
		return
	}
	subId, err := getLocationSubscription(userId)
	if err == nil && len(subId) > 0 {
		fmt.Println("Existing subscription")
		return
	}

	trans := authTransport(userId)
	svc, _ := mirror.New(trans.Client())

	s := &mirror.Subscription{
		Collection:  "locations",
		UserToken:   userId,
		CallbackUrl: fullUrl + "/location",
	}
	sub, err := svc.Subscriptions.Insert(s).Do()
	if err != nil {
		fmt.Println("Error subscribing to locations")
		return
	}
	setLocationSubscription(userId, sub.Id)
	fmt.Println("Location sub: " + sub.Id)
}


func LocationOffHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}
	userId, err := userID(r)
	if err != nil {
		return
	}
	trans := authTransport(userId)
	svc, _ := mirror.New(trans.Client())
	subId, err := getLocationSubscription(userId)
	if err != nil {
		fmt.Println("Error getting subscription id")
		return
	}
	svc.Subscriptions.Delete(subId).Do()
	deleteLocationSubscription(userId)
	fmt.Println("Removed subscription")
}

type MapLatLon struct {
	Lat string
	Lon string
}

type ThumbnailTemplate struct {
	Data string
	Title string
	Class string
}

type MapTemplateData struct {
	Center MapLatLon
	Points []MapLatLon
	Query *ThumbnailTemplate
	Thumbnails []*ThumbnailTemplate
}

type SearchConfRow struct {
	Conf float64
	Row string
}

func DecodeSearchResults(data string) (*[]SearchConfRow, error) {
	var results [][]interface{}
	var mh codec.MsgpackHandle
	err := codec.NewDecoderBytes([]byte(data), &mh).Decode(&results)
	if err != nil {
		return nil, err
	}
	var out []SearchConfRow
	for _, v := range results {
		out = append(out, SearchConfRow{Conf: (v[0]).(float64), Row: string((v[1]).([]uint8))})
	}
	return &out, nil
}

func FeatureMatch(feat0 string, feat1 string) (bool, error) {
	model := "kYKia3eDqG1heF9kaXN0WqttaW5faW5saWVycwqtcmVwcm9qX3RocmVzaMs/UGJN0vGp/KRuYW1l2gAhcGljYXJ1cy5JbWFnZU1hdGNoZXJIYW1taW5nUmFuc2Fj"
	var mh codec.MsgpackHandle
	var w bytes.Buffer
	err := codec.NewEncoder(&w, &mh).Encode([]string{feat0, feat1})
	if err != nil {
		fmt.Println("Couldn't encode msgpack")
		return false, err
	}
	input := w.String()
	WriteFile("model.msgpack", picarus.B64Dec(model))
	WriteFile("points.msgpack", input)
	out := picarusto.ModelChainProcessBinary(picarus.B64Dec(model), input)
	var matched bool
	var mh2 codec.MsgpackHandle
	err = codec.NewDecoderBytes([]byte(out), &mh2).Decode(&matched)
	if err != nil {
		fmt.Println("Couldn't decode output")
		return false, err
	}
	if matched {
		fmt.Println("Matched")
	} else {
		fmt.Println("Not Matched")
	}
	return matched, nil
}

func MapServer(w http.ResponseWriter, req *http.Request) {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	userId, err := userID(req)
	if err != nil {
		http.Redirect(w, req, "auth", http.StatusFound)
		return
	}
	content, err := ioutil.ReadFile("static/map.html")
	if err != nil {
		return
	}

	locationSer, err := getUserAttribute(userId, "latest_location")
	if err != nil {
		return
	}
	loc := mirror.Location{}
	err = json.Unmarshal([]byte(locationSer), &loc)
	if err != nil {
		return
	}
	points := []MapLatLon{}
	thumbnails := []*ThumbnailTemplate{}

	queryRow, err := getUserAttribute(userId, "latest_image_row")
	if err != nil {
		return
	}
	//queryRow = picarus.B64Dec("bG9jYXRpb25jcmF3bDqwZImk3nwOj+FR/sbUmz+6")

	m, err := conn.GetRow("images", queryRow, []string{"thum:image_150sq"})
	if err != nil {
		fmt.Println("Cannot get query thumbnail")
		return
	}
	queryImage := ThumbnailTemplate{Data: picarus.B64Enc(m["thum:image_150sq"]), Title: picarus.B64Enc(queryRow)}

	queryFeatures, err := PicarusApiModel(&conn, queryRow, picarus.B64Dec(locationFeatureModel))
	if err != nil {
		fmt.Println("Couldn't compute feature")
		return
	}

	searchDataEnc, err := PicarusApiModel(&conn, queryRow, B64Dec(locationModel))
			
	if err != nil {
		fmt.Println("Image search error")
		return
	}
	/*
	searchDataEnc, err := getUserAttribute(userId, "latest_image_search")
	if err != nil {
		return
	}*/
	searchData, err := DecodeSearchResults(searchDataEnc)
	if err != nil {
		return
	}

	for _, v := range (*searchData) {//[:50]
		m, err := conn.GetRow("images", v.Row, []string{"meta:latitude", "meta:longitude", "meta:latlons", "thum:image_150sq"})
		if err != nil {
			fmt.Println("Getting lat/lon failed")
			continue
		}
		resultFeatures, err := PicarusApiModel(&conn, v.Row, picarus.B64Dec(locationFeatureModel))
		if err != nil || resultFeatures == "" {
			fmt.Println("Couldn't compute feature")
			fmt.Println(m["meta:latitude"])
			continue
		}
		matched, err := FeatureMatch(queryFeatures, resultFeatures)
		if err != nil {
			fmt.Println("Can't match")
			continue
		}
		if matched {
			thumbnails = append(thumbnails, &ThumbnailTemplate{Data: picarus.B64Enc(m["thum:image_150sq"]), Title: picarus.B64Enc(v.Row) + " " + strconv.FormatFloat(v.Conf, 'f', 16, 64) + " Matched", Class: "image-matched"})
		} else {
			thumbnails = append(thumbnails, &ThumbnailTemplate{Data: picarus.B64Enc(m["thum:image_150sq"]), Title: picarus.B64Enc(v.Row) + " " + strconv.FormatFloat(v.Conf, 'f', 16, 64) + " Unmatched", Class: "image-unmatched"})
		}
		latlonsSer := m["meta:latlons"]
		latlons := [][]string{}
		err = json.Unmarshal([]byte(latlonsSer), &latlons)
		if err != nil {
			fmt.Println("Couldn't load latlons")
			continue
		}
		fmt.Println(latlons)
		/*lat := m["meta:latitude"]
		lon := m["meta:longitude"]
		if len(lat) == 0 || len(lon) == 0 {
			fmt.Println("Getting lat/lon failed")
			continue
		}
		 */
		if matched {
			for _, v := range latlons {
				points = append(points, MapLatLon{Lat: v[0], Lon: v[1]})
			}
		}
	}
	mapData := MapTemplateData{
		Center: MapLatLon{Lat: strconv.FormatFloat(loc.Latitude, 'f', 16, 64), Lon: strconv.FormatFloat(loc.Longitude, 'f', 16, 64)},
	    Points: points,
		Thumbnails: thumbnails,
	    Query: &queryImage,
	}

	t := template.New("Map template")
	t, err = t.Parse(string(content))
	if err != nil {
		fmt.Println(err)
		return
	}
	err = t.Execute(w, mapData)
}
