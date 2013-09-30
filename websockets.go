package main

import (
	"code.google.com/p/go.net/websocket"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"encoding/json"
	"fmt"
	picarus "github.com/bwhite/picarus/go"
	"strings"
	"time"
)

type WSSensor struct {
	Timestamp    float64   `json:"timestamp"`
	TimestampRaw int64     `json:"timestampRaw"`
	Type         int       `json:"type"`
	Name         string    `json:"name"`
	Values       []float64 `json:"values"`
}

type WSAnnotation struct {
	Timestamp float64 `json:"timestamp"`
	Name      string  `json:"name"`
	Polarity  bool    `json:"polarity"`
}

type WSData struct {
	// See Hacking.md for details
	Tsave     float64         `json:"Tsave,omitempty"` // Time packet data is final
	Tg0       float64         `json:"Tg0,omitempty"`   // Time packet is saved
	Ts0       float64         `json:"Ts0,omitempty"`
	Tg1       float64         `json:"Tg1,omitempty"`
	Sensors   []WSSensor      `json:"sensors"`
	Script    string          `json:"script"`
	ScriptUrl string          `json:"scriptUrl"`
	Message   string          `json:"message"`
	Imageb64  *string         `json:"imageb64,omitempty"`
	Action    string          `json:"action,omitempty"`
	Timestamp float64         `json:"timestamp,omitempty"`
	GlassID   string          `json:"glassID,omitempty"`
	H         []float64       `json:"H,omitempty"`
	MatchKey  string          `json:"matchKey,omitempty"`
	Flags     []string        `json:"flags,omitempty"`
	Say       *string         `json:"say,omitempty"`
	Draw      [][]interface{} `json:"draw,omitempty"`
	Ti *mirror.TimelineItem   `json:"ti,omitempty"`
}

var DeviceChannels = map[string][]chan *WSData{} // [user]
var WebChannels = map[string][]chan *WSData{}    // [user]

func WarpOverlay(wsSendChan chan *WSData, image string, h []float64, glassID string) {
	st := time.Now()
	imageWarped, err := WarpImage(image, h, 360, 640)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(fmt.Sprintf("[%s][%f]", "WarpImage", float64(time.Now().Sub(st).Seconds())))
	st = time.Now()
	imageWarpedB64 := picarus.B64Enc(imageWarped)
	wsSendChan <- &WSData{Imageb64: &imageWarpedB64, Action: "setOverlay", GlassID: glassID}
	fmt.Println(fmt.Sprintf("[%s][%f]", "SendImage", time.Now().Sub(st).Seconds()))
}

func CurTime() float64 {
	return float64(time.Now().UnixNano()) / 1000000000.
}

func WSSendWeb(userId string, data *WSData) error {
	for _, c := range WebChannels[userId] {
		select {
		case c <- data:
		default:
			// TODO: return an error
			fmt.Println("Data skipped, web client too slow...")
		}
	}
	return nil
}

func WSSendDevice(userId string, data *WSData) error {
	for _, c := range DeviceChannels[userId] {
		select {
		case c <- data:
		default:
			// TODO: return an error
			fmt.Println("Data skipped, device too slow...")
		}
	}
	return nil
}

func WSGlassHandler(c *websocket.Conn) {
	defer c.Close()
	fmt.Println("Connected with glass")
	conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	path := strings.Split(c.Request().URL.Path, "/")
	if len(path) != 4 {
		fmt.Println("Bad path")
		return
	}
	userId, err := getSecretUser("ws", secretHash(path[len(path)-1]))
	if err != nil {
		fmt.Println(err)
		return
	}
	flags, err := getUserFlags(userId, "flags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		return
	}
	if !hasFlag(flags, "user_ws") {
		return
	}
	uflags, err := getUserFlags(userId, "uflags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		return
	}
	svc, err := mirror.New(authTransport(userId).Client())
	if err != nil {
		LogPrintf("ws: mirror")
		return
	}
	// TODO: Look into locking and add defer to cleanup later, make buffer size configurable
	wsSendChan := make(chan *WSData, 10)
	DeviceChannels[userId] = append(DeviceChannels[userId], wsSendChan)

	// Initialize delays
	die := false
	matchAnnotatedDelay := 0.
	matchMementoDelay := 0.
	matchMementoChan := make(chan *WSData)
	matchAnnotatedChan := make(chan *WSData)
	annotationPoints := map[string]string{}
	sensorCache := map[int]*WSSensor{}
	hFlip := []float64{-1., 0., float64(wsWidth), 0., -1., float64(wsHeight), 0., 0., 1.}
	//hSmallToBig := []float64{3., 0., 304., 0., 3., 388., 0., 0., 1.}
	//hBigToGlass := []float64{1.4538965634675285, -0.10298433991228334, -1224.726117650959, 0.010066418722892632, 1.3287672714218164, -526.977020143425, -4.172194829863231e-05, -0.00012170226282961026, 1.0}
	//sensorLUT := map[string]int{"sensor_gps": -1, "sensor_accelerometer": 1, "sensor_magneticfield": 2, "sensor_orientation": 3, "sensor_gyroscope": 4, "sensor_light": 5, "sensor_gravity": 9, "sensor_linearacceleration": 10, "sensor_rotationvector": 11}

	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok {
				die = true
				break
			}
			fmt.Println("Sending to glass")
			fmt.Println(request)
			err = websocket.JSON.Send(c, *request)
			if err != nil {
				die = true
				break
			}
		}
	}()

	// Flags sender
	go func() {
		for {
			if die {
				break
			}
			// TODO: Make a subscription and have this repeated only when things change
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
			fmt.Println("Sending flags")
			wsSendChan <- &WSData{Action: "flags", Flags: uflags}
			annotationPoints, err = getUserMapAll(userId, "match_points")
			if err != nil {
				fmt.Println(err)
				annotationPoints = map[string]string{}
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
				wsSendChan <- &WSData{Say: &note}
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
			if len(annotationPoints) == 0 {
				continue
			}
			image := picarus.B64Dec(*(*request).Imageb64)
			fmt.Println(fmt.Sprintf("[%s][%f]", "GetMatchFeat", float64(time.Now().Sub(st).Seconds())))
			flipImage := false
			if hasFlag(uflags, "match_annotated_flipper") {
				lastGravityVector := sensorCache[9]
				if lastGravityVector != nil && lastGravityVector.Values[1] < -5 {
					flipImage = true
				}
				if flipImage {
					imageWarped, err := WarpImage(image, hFlip, 360, 640)
					if err != nil {
						LogPrintf("ws: match_annotated_flipper warp")
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
			for matchKey, points0 := range annotationPoints {
				st = time.Now()
				h, err := ImagePointsMatch(points0, points1)
				if h == nil || err != nil {
					fmt.Println("No match")
					fmt.Println(err)
					continue
				}
				if flipImage {
					h = HMult(hFlip, h)
				}
				fmt.Println(fmt.Sprintf("[%s][%f]", "ImageMatch", float64(time.Now().Sub(st).Seconds())))
				if hasFlag(uflags, "match_annotated_web") {
					matchData := WSData{Action: "match", MatchKey: matchKey, Imageb64: (*request).Imageb64, H: h, Sensors: (*request).Sensors}
					if err != nil {
						fmt.Println(err)
					} else {
						WSSendWeb(userId, &matchData)
					}
				}
				fmt.Println(fmt.Sprintf("Match delay: %f", CurTime()-request.Timestamp))
				wsSendChan <- &WSData{H: h, Action: "setMatchH", MatchKey: matchKey}
				fmt.Println("Finished computing homography")
			}
			matchAnnotatedDelay = time.Now().Sub(requestTime).Seconds()
		}
	}()

	// Pong!
	if hasFlag(uflags, "pong") {
		go func() {
			state := PongInit()
			for hasFlag(uflags, "pong") {
				if die {
					break
				}
				PongIter(state)
				yxJS, err := getUserAttribute(userId, "pupil_yx")
				if err == nil {
					var yx []float64
					err = json.Unmarshal([]byte(yxJS), &yx)
					if err == nil {
						fmt.Println(yx[0])
						PongSetPlayer(state, &state.PlayerL, int(yx[0]))
					}
				}
				PongAI(state, &state.PlayerR)
				wsSendChan <- &WSData{Action: "draw", Draw: PongRender(state)}
				time.Sleep(time.Millisecond * 250)
			}
		}()
	}
	// Data from glass loop
	skew := 0.
	delay := 0.
	delayData := 0.
	cnt := 0
	for {
		request := WSData{}
		err := websocket.JSON.Receive(c, &request)
		if err != nil {
			fmt.Println(err)
			die = true
			break
		}
		if die {
			break
		}
		fmt.Println(fmt.Sprintf("Send Delay[%f] (not deskewed)", CurTime()-request.Tg0))
		cnt += 1
		fmt.Println(request.Action)
		if request.Action == "timeline" {
			fmt.Println(request)
			req := svc.Timeline.Insert(request.Ti)
			//req.Media(strings.NewReader(image))
			_, err := req.Do()
			if err != nil {
				LogPrintf("ws: timeline")
				continue
			}
		}
		if request.Action == "log" {
			WSSendWeb(userId, &request)
		}
		if request.Action == "pong" {
			Ts1 := CurTime()
			delay = .5 * (Ts1 - request.Ts0)
			skew = request.Tg1 - Ts1 + delay
			delayData = request.Ts0 + skew - request.Tg0
			fmt.Println(fmt.Sprintf("Tg0[%f] -> D0[%f] -> Ts0[%f]", request.Tg0, delayData, request.Ts0))
			fmt.Println(fmt.Sprintf("Tg1[%f] <- D[%f] <- Ts0[%f]", request.Tg1, delay, request.Ts0))
			fmt.Println(fmt.Sprintf("Tg1[%f] -> D[%f] -> Ts1[%f]", request.Tg1, delay, Ts1))
			fmt.Println(fmt.Sprintf("Skew[%f] Deskewed times (server centric, origin at glass send)", skew))
			origin := request.Tg0 - skew
			fmt.Println(fmt.Sprintf("Tg0[%f] -> D0[%f] -> Ts0[%f]", request.Tg0-skew-origin, delayData, request.Ts0-origin))
			fmt.Println(fmt.Sprintf("Tg1[%f] <- D[%f] <- Ts0[%f]", request.Tg1-skew-origin, delay, request.Ts0-origin))
			fmt.Println(fmt.Sprintf("Tg1[%f] -> D[%f] -> Ts1[%f]", request.Tg1-skew-origin, delay, Ts1-origin))
		}
		if request.Action == "data" {
			request.Timestamp = request.Tsave - skew
			for _, sensor := range request.Sensors {
				sensorCache[sensor.Type] = &sensor
			}
			if hasFlag(uflags, "ws_web") {
				WSSendWeb(userId, &request)
			}
			if request.Imageb64 != nil {
				wsSendChan <- &WSData{Action: "ping", Tg0: request.Tg0, Ts0: CurTime()}
				if hasFlag(uflags, "data_serverdisk") {
					requestJS, err := json.Marshal(request)
					if err != nil {
						fmt.Println(err)
					} else {
						go func() {
							WriteFile(fmt.Sprintf("ws-serverdisk-%s-%.5d.js", userId, cnt), string(requestJS))
						}()
					}
				}
				if hasFlag(uflags, "match_annotated") {
					select {
					case matchAnnotatedChan <- &request:
					default:
						fmt.Println("Image skipping match annotated, too slow...")
					}
				}
				if hasFlag(uflags, "match_memento_ws") {
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

func WSWebHandler(c *websocket.Conn) {
	defer c.Close()
	userId, err := userID(c.Request())
	if err != nil || userId == "" {
		path := strings.Split(c.Request().URL.Path, "/")
		if len(path) != 4 {
			fmt.Println("Bad path")
			return
		}
		userId, err = getSecretUser("ws", secretHash(path[len(path)-1]))
		if err != nil {
			fmt.Println(err)
			return
		}
	}
	fmt.Println("Websocket connected")
	// TODO: Look into locking and add defer to cleanup later, make buffer size configurable
	// TODO: This needs the "die" code added, look into glass side also
	wsSendChan := make(chan *WSData, 10)
	WebChannels[userId] = append(WebChannels[userId], wsSendChan)
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
	// Data from web loop
	for {
		request := WSData{}
		err := websocket.JSON.Receive(c, &request)
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println(request.Action)
		if request.Action == "setMatchImage" {
			image := picarus.B64Dec(*request.Imageb64)
			points, err := ImagePoints(image)
			if err != nil {
				fmt.Println(err)
				continue
			}
			setUserMap(userId, "match_points", request.MatchKey, points)
			// NOTE(brandyn): We won't publish this to glass, it isn't needed
		} else if request.Action == "sendTimelineImage" {
			trans := authTransport(userId)
			if trans == nil {
				LogPrintf("notify: auth")
				return
			}

			svc, err := mirror.New(trans.Client())
			if err != nil {
				LogPrintf("notify: mirror")
				return
			}
			sendImageCard(picarus.B64Dec(*request.Imageb64), "", svc)
		} else if request.Action == "pupil" {
			PupilUpdate(userId, &request.Sensors[0])
		} else if request.Action == "resetMatch" {
			deleteUserMapAll(userId, "match_points")
			WSSendDevice(userId, &request)
		} else {
			WSSendDevice(userId, &request)
		}
	}
}
