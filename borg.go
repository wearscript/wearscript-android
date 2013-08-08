package main

import (
	"fmt"
	"time"
	"github.com/garyburd/redigo/redis"
	picarus "github.com/bwhite/picarus/go"
	"code.google.com/p/go.net/websocket"
	"strings"
	"math"
	"encoding/json"
)


type BorgSensor struct {
	Timestamp int64 `json:"timestamp"`	
	Accuracy  int `json:"accuracy"`
	Resolution  float32 `json:"resolution"`
	MaximumRange float32 `json:"maximumRange"`
	Type int `json:"type"`
	Name string `json:"name"`
	Values []float32 `json:"values"`
}

type BorgOptions struct {
	Image bool `json:"image"`
	Sensors []int `json:"sensors"`
	SensorResolution float64 `json:"sensorResolution"`
	DataDelay float64 `json:"dataDelay"`
	DataRemote bool `json:"dataRemote"`
	DataLocal bool `json:"dataLocal"`
}

type BorgData struct {
	Sensors []BorgSensor `json:"sensors"`
	Imageb64 *string `json:"imageb64"`
	Action string `json:"action"`
	Timestamp float64 `json:"timestamp"`
	TimestampAck float64 `json:"timestampAck"`
	H []float64 `json:"H"`
	Options *BorgOptions `json:"options"`
	Say *string `json:"say"`
}

func WarpOverlay(wsSendChan chan *BorgData, image string, h []float64) {
	st := time.Now()
	imageWarped, err := WarpImage(image, h, 360, 640)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(fmt.Sprintf("[%s][%f]", "WarpImage", float64(time.Now().Sub(st).Seconds())))
	st = time.Now()
	imageWarpedB64 := picarus.B64Enc(imageWarped)
	wsSendChan <- &BorgData{Imageb64: &imageWarpedB64, Action: "setOverlay"}
	fmt.Println(fmt.Sprintf("[%s][%f]", "SendImage", float64(time.Now().Sub(st).Seconds())))
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
	wsSendChan := make(chan *BorgData, 1)
	matchMementoChan := make(chan *BorgData, 1)
	matchAnnotatedChan := make(chan *BorgData, 1)
	sensorLUT := map[string]int{"borg_sensor_accelerometer": 1, "borg_sensor_magneticfield": 2, "borg_sensor_orientation": 3, "borg_sensor_gyroscope": 4, "borg_sensor_light": 5, "borg_sensor_gravity": 9, "borg_sensor_linearacceleration": 10, "borg_sensor_rotationvector": 11}
	
	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok {
				break
			}
			err = websocket.JSON.Send(c, *request)
			if err != nil {
				return
			}
		}
	}()
	
	// Option sender
	go func() {
		for {
			flags, err = getUserFlags(userId, "uflags")
			if err != nil {
				fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
				time.Sleep(time.Millisecond * 2000)
				continue
			}
			fmt.Println("Sending options")

			// TODO: have it send this based on a subscription
			sensors := []int{}
			for _, flag := range flags {
				ind := sensorLUT[flag]
				if ind != 0 {
					sensors = append(sensors, ind)
				}
			}
			
			opt := BorgOptions{DataDelay: math.Max(matchAnnotatedDelay, matchMementoDelay), DataLocal: hasFlag(flags, "borg_data_local"), DataRemote: hasFlag(flags, "borg_data_server") || hasFlag(flags, "borg_data_serverdisk") || hasFlag(flags, "borg_data_web"), Sensors: sensors, Image: hasFlag(flags, "borg_image"), SensorResolution: .1}
			fmt.Println(opt)
			wsSendChan <- &BorgData{Action: "options", Options: &opt}
			time.Sleep(time.Millisecond * 2000)
		}
	}()

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
			if !ok {break}
			/*
			for {
				select {
				case request2, ok :=  <- matchMementoChan:
					if ok {
						request = request2
					}
				default:
					break
				}
			}*/
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
				wsSendChan <- &BorgData{Say: &note}
			}
			fmt.Println("Finished matching memento")
			matchMementoDelay = time.Now().Sub(requestTime).Seconds()
		}
	}()

	// Match AR loop
	go func() {
		for {
			request, ok := <-matchAnnotatedChan
			if !ok {break}
			/*for {
				select {
				case request2, ok :=  <- matchAnnotatedChan:
					if ok {
						request = request2
					}
				default:
					break
				}
			}*/
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
			hFinalJS, err := json.Marshal(hFinal)
			if err != nil {
				fmt.Println(err)
				continue
			}
			setUserAttribute(userId, "match_h", string(hFinalJS))

			st = time.Now()
			image, err := getUserAttribute(userId, "match_overlay")
			if err != nil {
				fmt.Println(err)
				continue
			}
			fmt.Println(fmt.Sprintf("[%s][%f]", "GetOverlay", float64(time.Now().Sub(st).Seconds())))
			WarpOverlay(wsSendChan, image, hFinal)
			st = time.Now()
			fmt.Println("Finished computing homography")
			matchAnnotatedDelay = time.Now().Sub(requestTime).Seconds()
		}
	}()

	// Data from web loop
	go func() {
		psc, err := userSubscribe(userId, "borg_web_to_server")
		if err != nil {
			fmt.Println(err)
			return
		}
		for {
			switch n := psc.Receive().(type) {
			case redis.Message:
				fmt.Printf("Message: %s\n", n.Channel)
				response := BorgData{}
				err := json.Unmarshal(n.Data, &response)
				if err != nil {
					fmt.Println(err)
					continue
				}
				if (response.Action == "setMatchOverlay") {
					hJS, err := getUserAttribute(userId, "match_h")
					if err != nil {
						fmt.Println(err)
						continue
					}
					h := []float64{}
					err = json.Unmarshal([]byte(hJS), &h)
					if err != nil {
						fmt.Println(err)
						continue
					}
					WarpOverlay(wsSendChan, picarus.B64Dec(*response.Imageb64), h)
				} else {
					wsSendChan <- &response
				}
			case error:
				fmt.Printf("error: %v\n", n)
				return
			}
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
		fmt.Println(request.Action)
		if (request.Action == "data" && hasFlag(flags, "borg_data_web")) {
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				return
			}
			userPublish(userId, "borg_server_to_web", string(requestJS))
		}
		if request.Action == "data" && request.Imageb64 != nil {
			if hasFlag(flags, "borg_serverdisk_image") {
				go func() {
					WriteFile(fmt.Sprintf("borg-serverdisk-%s-%.5d.jpg", userId, cnt), picarus.B64Dec(*request.Imageb64))
				}()
			}
			wsSendChan <- &BorgData{Action: "dataAck", TimestampAck: request.Timestamp}
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
}

func BorgWebHandler(c *websocket.Conn) {
	defer c.Close()
	userId := "219250584360_109113122718379096525"
	fmt.Println("Websocket connected")
	wsSendChan := make(chan *BorgData, 1)
	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok {
				break
			}
			err := websocket.JSON.Send(c, *request)
			if err != nil {
				return
			}
		}
	}()
	// Data from server loop
	go func() {
		psc, err := userSubscribe(userId, "borg_server_to_web")
		if err != nil {
			fmt.Println(err)
			return // TODO: Need to kill everything
		}
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
					case wsSendChan <- &response:
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
				continue
			}
			userPublish(userId, "borg_web_to_server", string(requestJS))
		} else if request.Action == "setMatchOverlay" {
			//deleteUserAttribute(userId, "match_h")
			//setUserAttribute(userId, "match_overlay", picarus.B64Dec(*request.Imageb64))
			requestJS, err := json.Marshal(request)
			if err != nil {
				fmt.Println(err)
				continue
			}
			userPublish(userId, "borg_web_to_server", string(requestJS))
		} else if request.Action == "setMatchImage" {
			image := picarus.B64Dec(*request.Imageb64)
			points, err := ImagePoints(image)
			if err != nil {
				fmt.Println(err)
				continue
			}
			setUserAttribute(userId, "match_features", points)
			setUserAttribute(userId, "match_overlay", image)
			fmt.Println("Finished setting match image")
		}
	}
}