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
	Timestamp float64 `json:"timestamp"`
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
	PreviewWarp  bool `json:"previewWarp"`
	Overlay  bool `json:"overlay"`
	Flicker  bool `json:"flicker"`
	RavenDSN string `json:"ravenDSN"`
	HSmallToBig []float64 `json:"HSmallToBig"`
	HBigToGlass []float64 `json:"HBigToGlass"`
}

type BorgData struct {
	Tg0 float64 `json:"Tg0"` // See Hacking.md for details
	Ts0 float64 `json:"Ts0"`
	Tg1 float64 `json:"Tg1"`
	Sensors []BorgSensor `json:"sensors"`
	Imageb64 *string `json:"imageb64"`
	Action string `json:"action"`
	Timestamp float64 `json:"timestamp"`
	GlassID string `json:"glassID"`
	H []float64 `json:"H"`
	Options *BorgOptions `json:"options"`
	Say *string `json:"say"`
}

func WarpOverlay(wsSendChan chan *BorgData, image string, h []float64, glassID string) {
	st := time.Now()
	imageWarped, err := WarpImage(image, h, 360, 640)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(fmt.Sprintf("[%s][%f]", "WarpImage", float64(time.Now().Sub(st).Seconds())))
	st = time.Now()
	imageWarpedB64 := picarus.B64Enc(imageWarped)
	wsSendChan <- &BorgData{Imageb64: &imageWarpedB64, Action: "setOverlay", GlassID: glassID}
	fmt.Println(fmt.Sprintf("[%s][%f]", "SendImage", time.Now().Sub(st).Seconds()))
}

func CurTime() float64 {
	return float64(time.Now().UnixNano()) / 1000000000.
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
	flags, err := getUserFlags(userId, "flags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		return
	}
	if !hasFlag(flags, "user_borg") {
		return
	}
	uflags, err := getUserFlags(userId, "uflags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		return
	}
	// Initialize delays
	die := false
	matchAnnotatedDelay := 0.
	matchMementoDelay := 0.
	wsSendChan := make(chan *BorgData, 1)
	matchMementoChan := make(chan *BorgData)
	matchAnnotatedChan := make(chan *BorgData)
	annotationPoints := ""
	hFlip := []float64{-1., 0., float64(borgWidth), 0., -1., float64(borgHeight), 0., 0., 1.}
	hSmallToBig := []float64{3., 0., 304., 0., 3., 388., 0., 0., 1.}
	hBigToGlass := []float64{1.4538965634675285, -0.10298433991228334, -1224.726117650959, 0.010066418722892632, 1.3287672714218164, -526.977020143425, -4.172194829863231e-05, -0.00012170226282961026, 1.0}
	sensorLUT := map[string]int{"borg_sensor_accelerometer": 1, "borg_sensor_magneticfield": 2, "borg_sensor_orientation": 3, "borg_sensor_gyroscope": 4, "borg_sensor_light": 5, "borg_sensor_gravity": 9, "borg_sensor_linearacceleration": 10, "borg_sensor_rotationvector": 11}
	
	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok {
				die = true
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
			if die {
				break
			}
			uflags, err = getUserFlags(userId, "uflags")
			if err != nil {
				fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
				time.Sleep(time.Millisecond * 2000)
				continue
			}
			flags, err = getUserFlags(userId, "flags")
			if err != nil {
				fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
				time.Sleep(time.Millisecond * 2000)
				continue
			}
			fmt.Println("Sending options")

			// TODO: have it send this based on a subscription
			sensors := []int{}
			for _, flag := range uflags {
				ind := sensorLUT[flag]
				if ind != 0 {
					sensors = append(sensors, ind)
				}
			}
			opt := BorgOptions{DataDelay: math.Max(matchAnnotatedDelay, matchMementoDelay), DataLocal: hasFlag(uflags, "borg_data_local"), DataRemote: hasFlag(uflags, "borg_data_server") || hasFlag(uflags, "borg_data_serverdisk") || hasFlag(uflags, "borg_data_web"), Sensors: sensors, Image: hasFlag(uflags, "borg_image"), SensorResolution: .1, PreviewWarp:  hasFlag(uflags, "glass_preview_warp"), Flicker:  hasFlag(uflags, "glass_flicker"), Overlay:  hasFlag(uflags, "glass_overlay"), HSmallToBig: hSmallToBig, HBigToGlass: hBigToGlass}
			if hasFlag(flags, "debug") {
				opt.RavenDSN = ravenDSN
			}
			fmt.Println(opt)
			wsSendChan <- &BorgData{Action: "options", Options: &opt}
			annotationPoints, err = getUserAttribute(userId, "match_features")
			if err != nil {
				fmt.Println(err)
				annotationPoints = ""
			}
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
			requestTime := time.Now()
			st := time.Now()
			if annotationPoints == "" {
				continue
			}
			image := picarus.B64Dec(*(*request).Imageb64)
			fmt.Println(fmt.Sprintf("[%s][%f]", "GetMatchFeat", float64(time.Now().Sub(st).Seconds())))
			flipImage := false
			if hasFlag(uflags, "match_annotated_flipper") {
				for _, v := range request.Sensors {
					if v.Type == 9 && v.Values[1] < -5 {
						flipImage = true
						break
					}
				}
				if flipImage {
					imageWarped, err := WarpImage(image, hFlip, 360, 640)
					if err != nil {
						LogPrintf("borg: match_annotated_flipper warp")
						flipImage = false
					} else {
						fmt.Println("Image flipped")
						image = imageWarped
					}
				}
			}
			st = time.Now()
			points1, err := ImagePoints(image)
			if err != nil {
				fmt.Println(err)
				continue
			}
			fmt.Println(fmt.Sprintf("[%s][%f]", "ComputePoints", float64(time.Now().Sub(st).Seconds())))
			st = time.Now()
			h, err := ImagePointsMatch(annotationPoints, points1)
			if err != nil {
			    curMatchAnnotatedDelay := time.Now().Sub(requestTime).Seconds()
				if matchAnnotatedDelay < curMatchAnnotatedDelay {
					matchAnnotatedDelay = curMatchAnnotatedDelay
				}
				fmt.Println("No match")
				fmt.Println(err)
				continue
			}
			if flipImage {
				h = HMult(hFlip, h)
			}
			fmt.Println(fmt.Sprintf("[%s][%f]", "ImageMatch", float64(time.Now().Sub(st).Seconds())))
			if hasFlag(uflags, "match_annotated_web") {
				matchJS, err := json.Marshal(BorgData{Action: "match", Imageb64: (*request).Imageb64, H: h, Sensors: (*request).Sensors, Options: &BorgOptions{HSmallToBig: hSmallToBig, HBigToGlass: hBigToGlass}})
				if err != nil {
					fmt.Println(err)
				} else {
					userPublish(userId, "borg_server_to_web", string(matchJS))
				}
			}
			wsSendChan <- &BorgData{H: &h, Action: "setOverlayH", GlassID: glassID}
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
			if die {
				break
			}
			switch n := psc.Receive().(type) {
			case redis.Message:
				fmt.Printf("Message: %s\n", n.Channel)
				response := BorgData{}
				err := json.Unmarshal(n.Data, &response)
				if err != nil {
					fmt.Println(err)
					continue
				}
				wsSendChan <- &response
			case error:
				die = true
				fmt.Printf("error: %v\n", n)
				break
			}
		}
	}()

	// Data from glass loop
	skew := 0.
	delay := 0.
	delayData := 0.
	cnt := 0
	for {
		request := BorgData{}
		err := websocket.JSON.Receive(c, &request)
		if err != nil {
			fmt.Println(err)
			die = true
			return
		}
		if die {
			break
		}
		fmt.Println(fmt.Sprintf("Send Delay[%f] (not deskewed)", CurTime() - request.Tg0))
		cnt += 1
		fmt.Println(request.Action)
		if (request.Action == "pong") {
			Ts1 := CurTime()
			delay = .5 * (Ts1 - request.Ts0)
			skew = request.Tg1 - Ts1 + delay
			delayData = request.Ts0 + skew - request.Tg0
			fmt.Println(fmt.Sprintf("Tg0[%f] -> D0[%f] -> Ts0[%f]", request.Tg0, delayData, request.Ts0))
			fmt.Println(fmt.Sprintf("Tg1[%f] <- D[%f] <- Ts0[%f]", request.Tg1, delay, request.Ts0))
			fmt.Println(fmt.Sprintf("Tg1[%f] -> D[%f] -> Ts1[%f]", request.Tg1, delay, Ts1))
			fmt.Println(fmt.Sprintf("Skew[%f] Deskewed times (server centric, origin at glass send)", skew))
			origin := request.Tg0 - skew
			fmt.Println(fmt.Sprintf("Tg0[%f] -> D0[%f] -> Ts0[%f]", request.Tg0 - skew - origin, delayData, request.Ts0 - origin))
			fmt.Println(fmt.Sprintf("Tg1[%f] <- D[%f] <- Ts0[%f]", request.Tg1 - skew - origin, delay, request.Ts0 - origin))
			fmt.Println(fmt.Sprintf("Tg1[%f] -> D[%f] -> Ts1[%f]", request.Tg1 - skew - origin, delay, Ts1 - origin))
		}
		if (request.Action == "data") {
			wsSendChan <- &BorgData{Action: "ping", Tg0: request.Tg0, Ts0: CurTime()}
			if hasFlag(uflags, "borg_data_web") {
				requestJS, err := json.Marshal(request)
				if err != nil {
					fmt.Println(err)
					return
				}
				userPublish(userId, "borg_server_to_web", string(requestJS))
			}
			if request.Imageb64 != nil {
				if hasFlag(uflags, "borg_serverdisk_image") {
					go func() {
						WriteFile(fmt.Sprintf("borg-serverdisk-%s-%.5d.jpg", userId, cnt), picarus.B64Dec(*request.Imageb64))
					}()
				}
				if hasFlag(uflags, "match_annotated") {
					select {
					case matchAnnotatedChan <- &request:
					default:
						fmt.Println("Image skipping match annotated, too slow...")
					}
				}
				if hasFlag(uflags, "match_memento_borg") {
					select {
					case matchMementoChan <- &request:
					default:
						fmt.Println("Image skipping match memento, too slow...")
					}
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
			deleteUserAttribute(userId, "match_features")
			userPublish(userId, "borg_web_to_server", string(requestJS))
		} else if request.Action == "setMatchOverlay" {
			setUserAttribute(userId, "match_overlay", picarus.B64Dec(*request.Imageb64))
			// TODO: Send
		} else if request.Action == "setMatchImage" {
			image := picarus.B64Dec(*request.Imageb64)
			points, err := ImagePoints(image)
			if err != nil {
				fmt.Println(err)
				continue
			}
			setUserAttribute(userId, "match_features", points)
			// TODO: Send
			fmt.Println("Finished setting match image")
		}
	}
}