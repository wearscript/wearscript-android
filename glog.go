package main

import (
	"github.com/garyburd/redigo/redis"
	"fmt"
	"os"
	"net/http"
	"time"
	picarus "github.com/bwhite/picarus/go"
	"code.google.com/p/go.net/websocket"
	"strings"
	"strconv"
	"encoding/json"
)

func SensorsHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.Form)
}

func ImagesHandler(w http.ResponseWriter, r *http.Request) {
	userId, err := getSecretUser("glog", secretHash(r.URL.Query().Get(":key")))
	if err != nil {
		w.WriteHeader(401)
		return
	}
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	b := make([]byte, 1048576, 1048576)
	f, _, err := r.FormFile("image")
	if err != nil {
		w.WriteHeader(400)
		return
	}
	n, err := f.Read(b)
	fmt.Println(n)
	if err != nil {
		w.WriteHeader(500)
		return
	}
	randSuffix, err := randString()
	if err != nil {
		w.WriteHeader(500)
		return
	}
	// TODO: Add time
	conn.PatchRow("images", glogPrefix + randSuffix, map[string]string{"meta:openglass_user": userId}, map[string][]byte{"data:image": b})
	//out, err := 
}

type GlogSensor struct {
	Timestamp int64 `json:"timestamp"`	
	Accuracy  int `json:"accuracy"`
	Resolution  float64 `json:"resolution"`
	MaximumRange float64 `json:"maximumRange"`
	Type int `json:"type"`
	Name string `json:"name"`
	Values []float64 `json:"values"`
}


type GlogRequestWS struct {
	Sensor *GlogSensor `json:"sensor"`
	Imageb64 *string `json:"imageb64"`
	Timestamp int64 `json:"timestamp"`
}

type GlogResponseWS struct {
	Overlayb64 *string `json:"imageb64"`
	H []float64 `json:"H"`
	Say *string `json:"say"`
	Action *string `json:"action"`
	Timestamp int64 `json:"timestamp"`
}

func WriteFile(filename string, data string) {
	fo, err := os.Create(filename)
	if err != nil { fmt.Println("Couldn't create file") }
	defer func() {
		if err := fo.Close(); err != nil {
			fmt.Println("Couldn't close file")
		}
	}()
	if _, err := fo.Write([]byte(data)); err != nil {
		fmt.Println("Couldn't write file")
	}
}

func glogWebsocketHandler(c *websocket.Conn) {
	defer c.Close()
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	path := strings.Split(c.Request().URL.Path, "/")
	if len(path) != 4 {
		fmt.Println("Bad path")
		return
	}
	userId, err := getSecretUser("glog", secretHash(path[len(path) - 1]))
	if err != nil {
		fmt.Println(err)
		return
	}
	psc, err := userSubscribe(userId, "overlay")
	if err != nil {
		fmt.Println(err)
		return
	}
	cnt := 0

	go func() {
		flags, err := getUserFlags(userId, "uflags")
		if err != nil {
			fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
			return
		}
		matchMementoChan := make(chan *GlogRequestWS)
		requestChan := make(chan *GlogRequestWS)
		go func() {
			locFeat := picarus.B64Dec(locationFeatureModel)
			_, columnss, err := getMementoDB(&conn, userId)
			if err != nil {
				fmt.Println(err)
				fmt.Println("Unable to perform matches, can't load db")
				return
			}
			for {
				request, ok := <-matchMementoChan
				if !ok {
					break
				}
				st := time.Now()
				points1, err := ImagePoints(picarus.B64Dec(*(*request).Imageb64))
				if err != nil {
					fmt.Println(err)
					continue
				}
				for _, columns := range columnss {
					_, err := ImagePointsMatch(columns[locFeat], points1)
					if err != nil {
						fmt.Println(err)
						continue
					}
					note := columns["meta:note"]
					go func() {
						err = websocket.JSON.Send(c, GlogResponseWS{Say: &note})
						if err != nil {
							fmt.Println(err)
						}
					}()
				}
				fmt.Println("Finished matching memento")
				fmt.Println(time.Now().Sub(st).Nanoseconds())
			}
		}()
		go func() {
			for {
				request, ok := <-requestChan
				if !ok {
					break
				}
				points0, err := getUserAttribute(userId, "match_features")
				if err != nil {
					fmt.Println(err)
					continue
				}
				points1, err := ImagePoints(picarus.B64Dec(*(*request).Imageb64))
				if err != nil {
					fmt.Println(err)
					continue
				}
				h, err := ImagePointsMatch(points0, points1)
				if err != nil {
					fmt.Println(err)
					continue
				}
				err = websocket.JSON.Send(c, GlogResponseWS{H: h})
				if err != nil {
					fmt.Println(err)
					continue
				}
				fmt.Println("Finished computing homography")
			}
		}()
		for {
			request := GlogRequestWS{}
			err := websocket.JSON.Receive(c, &request)
			if err != nil {
				fmt.Println(err)
				return
			}
			action := "image_throttle_ack"
			err = websocket.JSON.Send(c, GlogResponseWS{Action: &action, Timestamp: request.Timestamp})
			if err != nil {
				fmt.Println(err)
			} else {
				fmt.Println("Image acked")
			}
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				return
			}
			if request.Sensor != nil {
				fmt.Println("sensor")
				if hasFlag(flags, "glog_stream") {
					userPublish(userId, "glog_sensors_" + strconv.Itoa(request.Sensor.Type), string(requestJS))
				}
			}
			if request.Imageb64 != nil {
				//WriteFile("glog-" + strconv.Itoa(cnt) + ".jpg", picarus.B64Dec(*request.Imageb64));
				cnt += 1
				fmt.Println("image")
				if hasFlag(flags, "glog_stream") {
					userPublish(userId, "glog_images", string(requestJS))
				}
				if hasFlag(flags, "match_annotated") {
					select {
					case requestChan <- &request:
					default:
						fmt.Println("Image skipping match, too slow...")
					}
				}
				if hasFlag(flags, "match_memento_glog") {
					select {
					case matchMementoChan <- &request:
					default:
						fmt.Println("Image skipping match memento, too slow...")
					}
				}
			}
		}
	}()

	for {
		switch n := psc.Receive().(type) {
		case redis.Message:
			fmt.Printf("Message: %s\n", n.Channel)
			overlayb64 := string(n.Data)
			err = websocket.JSON.Send(c, GlogResponseWS{Overlayb64: &overlayb64})
			if err != nil {
				return
			}
		case error:
			fmt.Printf("error: %v\n", n)
			return
		}
	}
}