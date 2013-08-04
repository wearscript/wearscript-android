package main

import (
	"fmt"
	"time"
	"github.com/garyburd/redigo/redis"
	picarus "github.com/bwhite/picarus/go"
	"code.google.com/p/go.net/websocket"
	"strings"
	"encoding/json"
)


type BorgSensor struct {
	Timestamp int64 `json:"timestamp"`	
	Accuracy  int `json:"accuracy"`
	Resolution  float64 `json:"resolution"`
	MaximumRange float64 `json:"maximumRange"`
	Type int `json:"type"`
	Name string `json:"name"`
	Values []float64 `json:"values"`
}

type BorgOptions struct {
	Local *bool `json:"local"`
	Remote *bool `json:"remote"`
	ImageFrequency *int `json:"imageFrequency"`
	SensorFrequency *int `json:"sensorFrequency"`
	Sensors []int `json:"sensors"`
}

type BorgData struct {
	Sensors []BorgSensor `json:"sensors"`
	Imageb64 *string `json:"imageb64"`
	Action string `json:"action"`
	Timestamp int64 `json:"timestamp"`
	TimestampAck int64 `json:"timestampAck"`
	H []float64 `json:"H"`
	Options *BorgOptions `json:"options"`
	Say *string `json:"say"`
}

func BorgGlassHandler(c *websocket.Conn) {
	defer c.Close()
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	path := strings.Split(c.Request().URL.Path, "/")
	if len(path) != 4 {
		fmt.Println("Bad path")
		return
	}
	userId, err := getSecretUser("borg", secretHash(path[len(path) - 1]))
	if err != nil {
		fmt.Println(err)
		return
	}
	go func() {
		flags, err := getUserFlags(userId, "uflags")
		if err != nil {
			fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
			return
		}
		matchMementoChan := make(chan *BorgData)
		requestChan := make(chan *BorgData)
		// Match memento loop
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
						err = websocket.JSON.Send(c, BorgData{Say: &note})
						if err != nil {
							fmt.Println(err)
						}
					}()
				}
				fmt.Println("Finished matching memento")
				fmt.Println(time.Now().Sub(st).Nanoseconds())
			}
		}()
		// Match AR loop
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
				err = websocket.JSON.Send(c, BorgData{H: h, Action: "warpH"})
				if err != nil {
					fmt.Println(err)
					continue
				}
				fmt.Println("Finished computing homography")
			}
		}()
		// Data from glass loop
		for {
			request := BorgData{}
			err := websocket.JSON.Receive(c, &request)
			if err != nil {
				fmt.Println(err)
				return
			}
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				return
			}
			fmt.Println(request.Action)
			if request.Action == "image" || request.Action == "sensors" {
				userPublish(userId, "borg_server_to_web", string(requestJS))
			}
			if request.Action == "image"  {
				go func() {
					err = websocket.JSON.Send(c, BorgData{Action: "imageAck", TimestampAck: request.Timestamp})
					if err != nil {
						fmt.Println(err)
					}
				}()
				if hasFlag(flags, "match_annotated") {
					select {
					case requestChan <- &request:
					default:
						fmt.Println("Image skipping match, too slow...")
					}
				}
				if hasFlag(flags, "match_memento_borg") {
					select {
					case matchMementoChan <- &request:
					default:
						fmt.Println("Image skipping match memento, too slow...")
					}
				}
			}
		}
	}()
	psc, err := userSubscribe(userId, "borg_web_to_server")
	if err != nil {
		fmt.Println(err)
		return
	}
	// Data from web loop
	for {
		switch n := psc.Receive().(type) {
		case redis.Message:
			fmt.Printf("Message: %s\n", n.Channel)
			response := BorgData{}
			err := json.Unmarshal(n.Data, &response)
			if err != nil {
				fmt.Println(err)
				return
			}
			err = websocket.JSON.Send(c, response)
			if err != nil {
				return
			}
		case error:
			fmt.Printf("error: %v\n", n)
			return
		}
	}
}

func BorgWebHandler(c *websocket.Conn) {
	defer c.Close()
	userId := "219250584360_109113122718379096525"
	fmt.Println("Websocket connected")
	psc, err := userSubscribe(userId, "borg_server_to_web")
	if err != nil {
		fmt.Println(err)
		return
	}
	// Data from server loop
	go func() {
		responseChan := make(chan *BorgData)
		go func() {
			for {
				response, ok := <-responseChan
				if !ok {
					break
				}
				err = websocket.JSON.Send(c, response)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
		}()
		for {
			switch n := psc.Receive().(type) {
			case redis.Message:
				response := BorgData{}
				err := json.Unmarshal(n.Data, &response)
				if err != nil {
					fmt.Println(err)
					return
				}
				select {
					case responseChan <- &response:
					default:
						fmt.Println("Image skipping sending to webapp, too slow...")
					}
			case error:
				fmt.Printf("error: %v\n", n)
				return
			}
		}
	}()
	// Data from web loop
	for {
		request := BorgData{}
		err := websocket.JSON.Receive(c, &request)
		if err != nil {
			fmt.Println(err)
			return
		}
		if request.Action == "setOverlay" {
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				return
			}
			userPublish(userId, "borg_web_to_server", string(requestJS))
		} else if request.Action == "setMatchImage" {
			points, err := ImagePoints(picarus.B64Dec(*request.Imageb64))
			if err != nil {
				fmt.Println(err)
				continue
			}
			setUserAttribute(userId, "match_features", points)
			fmt.Println("Finished setting match image")
		}
	}
}