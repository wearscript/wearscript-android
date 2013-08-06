package main

import (
	"fmt"
	"time"
	"github.com/garyburd/redigo/redis"
	picarus "github.com/bwhite/picarus/go"
	"code.google.com/p/go.net/websocket"
	"strings"
	//"math"
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
	LocalImage bool `json:"localImage"`
	LocalSensors bool `json:"localSensors"`
	RemoteImage bool `json:"remoteImage"`
	RemoteSensors bool `json:"remoteSensors"`
	//ImageDelay float64 `json:"imageDelay"`
	//SensorsDelay float64 `json:"sensorsDelay"`
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
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		return
	}
	// Initialize delays
	matchAnnotatedDelay := 0.
	matchMementoDelay := 0.
	
	// Send options
	go func() {
		for {
			flags, err = getUserFlags(userId, "uflags")
			if err != nil {
				fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
				time.Sleep(time.Millisecond * 500)
				continue
			}
			fmt.Println("Sending options")
			
			// TODO: have it send this based on a subscription
			//SensorsDelay: 0., ImageDelay: math.Max(matchAnnotatedDelay, matchMementoDelay), 
			opt := BorgOptions{LocalImage: hasFlag(flags, "borg_local_image"), LocalSensors: hasFlag(flags, "borg_local_sensors"), RemoteImage: hasFlag(flags, "borg_server_image") || hasFlag(flags, "borg_serverdisk_image") || hasFlag(flags, "borg_web_image"), RemoteSensors: hasFlag(flags, "borg_server_sensors") || hasFlag(flags, "borg_web_sensors")}
			fmt.Println(opt)
			err = websocket.JSON.Send(c, BorgData{Action: "options", Options: &opt})
			if err != nil {
				fmt.Println(err)
			}
			break
			time.Sleep(time.Millisecond * 500)
		}
	}()
	go func() {
		matchMementoChan := make(chan *BorgData)
		matchAnnotatedChan := make(chan *BorgData)
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
				requestTime := time.Now()
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
				matchMementoDelay = time.Now().Sub(requestTime).Seconds()
			}
		}()
		// Match AR loop
		go func() {
			for {
				request, ok := <-matchAnnotatedChan
				if !ok {
					break
				}
				requestTime := time.Now()
				st := time.Now()
				points0, err := getUserAttribute(userId, "match_features")
				if err != nil {
					fmt.Println(err)
					continue
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "GetMatchFeat", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()
				points1, err := ImagePoints(picarus.B64Dec(*(*request).Imageb64))
				if err != nil {
					fmt.Println(err)
					continue
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "ComputePoints", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()
				h, err := ImagePointsMatch(points0, points1)
				if err != nil {
					fmt.Println("No match")
					fmt.Println(err)
					continue
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "ImageMatch", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()
				// 
				fmt.Println("Match")
				/*
				err = websocket.JSON.Send(c, BorgData{H: h, Action: "warpH"})
				if err != nil {
					fmt.Println(err)
					continue
				}
				 */

				fmt.Println("hMatch01")
				fmt.Println(h)
				hSmallToBig := []float64{3., 0., 304., 0., 3., 388., 0., 0., 1.}
				fmt.Println("hSmallToBig")
				fmt.Println(hSmallToBig)
				hBigToGlass := []float64{1.3960742363652061, -0.07945137930533697, -1104.2947209648783, 0.006275578662065556, 1.3523872016751255, -504.1266472917187, -1.9269902737e-05, -9.708578143e-05, 1.0}
				fmt.Println("hBigToGlass")
				fmt.Println(hBigToGlass)
				//hFinal := HMult(HMult(h, hSmallToBig), hBigToGlass)
				hFinal := HMult(HMult(hBigToGlass, hSmallToBig), h)
				fmt.Println("hFinal")
				fmt.Println(hFinal)
				fmt.Println(fmt.Sprintf("[%s][%f]", "Matrices", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()
				image, err := getUserAttribute(userId, "match_overlay")
				if err != nil {
					fmt.Println(err)
					continue
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "GetOverlay", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()
				imageWarped, err := WarpImage(image, hFinal, 360, 640)
				if err != nil {
					fmt.Println(err)
					continue
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "WarpImage", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()
				imageWarpedB64 := picarus.B64Enc(imageWarped)
				err = websocket.JSON.Send(c, BorgData{Imageb64: &imageWarpedB64, Action: "setOverlay"})
				if err != nil {
					fmt.Println(err)
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "SendImage", float64(time.Now().Sub(st).Seconds())))
				st = time.Now()	
				fmt.Println("Finished computing homography")
				matchAnnotatedDelay = time.Now().Sub(requestTime).Seconds()
			}
		}()
		// Data from glass loop
		cnt := 0
		for {
			request := BorgData{}
			err := websocket.JSON.Receive(c, &request)
			if err != nil {
				fmt.Println(err)
				return
			}
			cnt += 1
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				return
			}
			fmt.Println(request.Action)
			if (request.Action == "image" && hasFlag(flags, "borg_web_image")) || (request.Action == "sensors" && hasFlag(flags, "borg_web_sensors")) {
				userPublish(userId, "borg_server_to_web", string(requestJS))
			}
			if request.Action == "image"  {
				if hasFlag(flags, "borg_serverdisk_image") {
					go func() {
						WriteFile(fmt.Sprintf("borg-serverdisk-%s-%.5d.jpg", userId, cnt), picarus.B64Dec(*request.Imageb64))
					}()
				}
				go func() {
					err = websocket.JSON.Send(c, BorgData{Action: "imageAck", TimestampAck: request.Timestamp})
					if err != nil {
						fmt.Println(err)
					}
				}()
				if hasFlag(flags, "match_annotated") {
					select {
					case matchAnnotatedChan <- &request:
					default:
						fmt.Println("Image skipping match annotated, too slow...")
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
		fmt.Println(request.Action)
		if request.Action == "setOverlay" {
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				return
			}
			userPublish(userId, "borg_web_to_server", string(requestJS))
		} else if request.Action == "setMatchOverlay" {
			setUserAttribute(userId, "match_overlay", picarus.B64Dec(*request.Imageb64))
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