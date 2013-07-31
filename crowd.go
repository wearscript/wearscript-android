package main

import (
	picarus "github.com/bwhite/picarus/go"
	"net/http"
	"time"
	"fmt"
	"io"
	"strconv"
	"strings"
	"encoding/json"
	"code.google.com/p/google-api-go-client/mirror/v1"
)

type UserData struct {
	Text string `json:"text"`	
	Latitude  float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
	ImageUrl string `json:"image_url"`
}

func download(url string) (io.ReadCloser, error) {
	var err error
	var req *http.Request

	req, err = http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	return res.Body, nil
}

func pollAnnotations() {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	prevTime := time.Now()
	for {
		time.Sleep(10000 * time.Millisecond)
		v, err := conn.GetTable("annotation-results-" + annotationTask, []string{})
		if err != nil {
			fmt.Println("Poll failed")
			continue
		}
		nextTime := prevTime
		cnt := 0
		for _, element := range v {
			endTime, err := strconv.ParseFloat(element["endTime"], 64)
			if err != nil {
				continue
			}
			curTime := time.Unix(int64(endTime), 0)
			if nextTime.Before(curTime) {
				nextTime = curTime
			}

			if !prevTime.Before(curTime) {
				continue
			}
			var userData UserData
			err = json.Unmarshal([]byte(element["userData"]), &userData)
			if err != nil {
				fmt.Println("Json error in user data")
				continue
			}

			image := element["image"]
			question := element["question"]
			if len(question) == 0 || len(image) == 0 {
				fmt.Println("Missing image or question")
				continue
			}

			fmt.Println(userData)

			m, err := conn.GetRow("images", image, []string{"meta:openglass_user"})
			if err != nil {
				fmt.Println("Getting openglass_user failed")
				continue
			}
			userId := m["meta:openglass_user"]
			//fmt.Println(userId)
			if cnt > 3 {
				return
			}
			cnt += 1
			fmt.Println("Going to send a card!")
			trans := authTransport(userId)
			svc, _ := mirror.New(trans.Client())
		    text := question + "? " + userData.Text
			if !strings.HasSuffix(text, ".") {
				text = text + "."
			} 
			fmt.Println(text)

			nt := &mirror.TimelineItem{
				Text: text,
			    Html: "<article><section><p class=\"text-normal\" data-text-autosize=\"true\">" + text + "</p></section></article>",
				SpeakableText: text,
				MenuItems:    []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}},
				Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
			}

			if userData.ImageUrl != "" {
				nt.HtmlPages = []string{"<img src=\"attachment:0\" width=\"100%\" height=\"100%\">"}
			}
			if userData.Latitude != 0. && userData.Longitude != 0. {
				nt.MenuItems = []*mirror.MenuItem{&mirror.MenuItem{Action: "NAVIGATE"}, &mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}}
				nt.Location = &mirror.Location{Latitude: userData.Latitude, Longitude: userData.Longitude}
			}
			req := svc.Timeline.Insert(nt)

			if userData.ImageUrl != "" {
				media, err := download(userData.ImageUrl)
				if err != nil {
					fmt.Println("Couldn't download image")
					continue
				}
				req.Media(media)
				defer media.Close()
			}
			_, err = req.Do()
			if err != nil {
				fmt.Println("Unable to insert timeline item")
				continue
			}
		}
		prevTime = nextTime
	}
}
