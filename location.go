package main

import (
	picarus "github.com/bwhite/picarus/go"
	"encoding/json"
	"fmt"
	"strconv"
	"net/http"
	"io/ioutil"
	"html/template"
	"github.com/ugorji/go/codec"
	"code.google.com/p/google-api-go-client/mirror/v1"
)

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
	if !hasFlagSingle(userId, "flags", "user_location") {
		return
	}
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		return
	}
	if !hasFlag(flags, "location") {
		return
	}
	itemId := not.ItemId
	fmt.Println(userId)
	fmt.Println(itemId)
	trans := authTransport(userId)
	if trans == nil {
		return // TODO: Error
	}

	svc, _ := mirror.New(trans.Client())

	loc, _ := svc.Locations.Get("latest").Do()
	locSer, err := json.Marshal(loc)
	if err == nil {
		pushUserListTrim(userId, "locations", string(locSer), maxLocations)
	}
	
	//loc.Latitude
	//fmt.Println(*loc)
}

func locationOn(svc *mirror.Service, userId string) error {
	s := &mirror.Subscription{
		Collection:  "locations",
		UserToken:   userId,
		CallbackUrl: fullUrl + "/location",
	}
	_, err := svc.Subscriptions.Insert(s).Do()
	return err
}


func locationOff(svc *mirror.Service) error {
	subscriptions, err := svc.Subscriptions.List().Do()
	if err != nil {
		return err
	}
	for _, v := range subscriptions.Items {
		if v.Collection == "locations" {
			err = svc.Subscriptions.Delete(v.Id).Do()
			if err != nil {
				return err
			}
		}
	}
	return nil
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
	
	locationSer, err := getUserListFront(userId, "locations")
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

	queryRow, err := getUserListFront(userId, "images")
	if err != nil {
		return
	}
	queryRow = picarus.B64Dec("bG9jYXRpb25jcmF3bDqwZImk3nwOj+FR/sbUmz+6")

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

	searchDataEnc, err := PicarusApiModel(&conn, queryRow, picarus.B64Dec(locationModel))
			
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
		_, err = ImagePointsMatch(queryFeatures, resultFeatures)
		if err != nil {
			thumbnails = append(thumbnails, &ThumbnailTemplate{Data: picarus.B64Enc(m["thum:image_150sq"]), Title: picarus.B64Enc(v.Row) + " " + strconv.FormatFloat(v.Conf, 'f', 16, 64) + " Unmatched", Class: "image-unmatched"})
		} else {
		latlonsSer := m["meta:latlons"]
		latlons := [][]string{}
			err = json.Unmarshal([]byte(latlonsSer), &latlons)
			if err != nil {
				fmt.Println("Couldn't load latlons")
				continue
			}
			fmt.Println(latlons)
			for _, v := range latlons {
				points = append(points, MapLatLon{Lat: v[0], Lon: v[1]})
			}
			thumbnails = append(thumbnails, &ThumbnailTemplate{Data: picarus.B64Enc(m["thum:image_150sq"]), Title: picarus.B64Enc(v.Row) + " " + strconv.FormatFloat(v.Conf, 'f', 16, 64) + " Matched", Class: "image-matched"})
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
