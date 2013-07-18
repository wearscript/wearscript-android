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

type MapTemplateData struct {
	Center MapLatLon
	Points []MapLatLon
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
	searchDataEnc, err := getUserAttribute(userId, "latest_image_search")
	if err != nil {
		return
	}
	searchData, err := DecodeSearchResults(searchDataEnc)
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
	for _, v := range *searchData {
		m, err := conn.GetRow("images", v.Row, []string{"meta:latitude", "meta:longitude"})
		if err != nil {
			fmt.Println("Getting lat/lon failed")
			continue
		}
		lat := m["meta:latitude"]
		lon := m["meta:longitude"]
		if len(lat) == 0 || len(lon) == 0 {
			fmt.Println("Getting lat/lon failed")
			continue
		}
		points = append(points, MapLatLon{Lat: lat, Lon: lon})
	}
	fmt.Println(searchData)
	mapData := MapTemplateData{
		Center: MapLatLon{Lat: strconv.FormatFloat(loc.Latitude, 'f', 16, 64), Lon: strconv.FormatFloat(loc.Longitude, 'f', 16, 64)},
	    Points: points,
	}

	t := template.New("Map template")
	t, err = t.Parse(string(content))
	if err != nil {
		fmt.Println(err)
		return
	}
	err = t.Execute(w, mapData)
}
