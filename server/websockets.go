package main

import (
	"code.google.com/p/go.net/websocket"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"fmt"
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
	Tsave     float64              `json:"Tsave,omitempty"` // Time packet data is final
	Tg0       float64              `json:"Tg0,omitempty"`   // Time packet is saved
	Ts0       float64              `json:"Ts0,omitempty"`
	Tg1       float64              `json:"Tg1,omitempty"`
	Sensors   []WSSensor           `json:"sensors"`
	Script    string               `json:"script"`
	ScriptUrl string               `json:"scriptUrl"`
	Message   string               `json:"message"`
	Imageb64  *string              `json:"imageb64,omitempty"`
	Action    string               `json:"action,omitempty"`
	Timestamp float64              `json:"timestamp,omitempty"`
	GlassID   string               `json:"glassID,omitempty"`
	H         []float64            `json:"H,omitempty"`
	MatchKey  string               `json:"matchKey,omitempty"`
	Flags     []string             `json:"flags,omitempty"`
	Say       *string              `json:"say,omitempty"`
	Draw      [][]interface{}      `json:"draw,omitempty"`
	Ti        *mirror.TimelineItem `json:"ti,omitempty"`
}

var DeviceChannels = map[string][]chan *WSData{} // [user]
var WebChannels = map[string][]chan *WSData{}    // [user]

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
	wsSendChan := make(chan *WSData, 5)
	DeviceChannels[userId] = append(DeviceChannels[userId], wsSendChan)

	// Initialize delays
	die := false
	sensorCache := map[int]*WSSensor{}

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
			fmt.Println("Sending flags")
			wsSendChan <- &WSData{Action: "flags", Flags: uflags}
			time.Sleep(time.Millisecond * 2000)
		}
	}()

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
		} else if request.Action == "log" {
			fmt.Println(request)
			WSSendWeb(userId, &request)
		} else if request.Action == "pong" {
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
		} else if request.Action == "data" {
			request.Timestamp = request.Tsave - skew
			for _, sensor := range request.Sensors {
				sensorCache[sensor.Type] = &sensor
			}
			WSSendWeb(userId, &request)
			if request.Imageb64 != nil {
				wsSendChan <- &WSData{Action: "ping", Tg0: request.Tg0, Ts0: CurTime()}
			}
		} else {
			WSSendWeb(userId, &request)
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
	wsSendChan := make(chan *WSData, 5)
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
		if request.Action == "sendTimelineImage" {
			trans := authTransport(userId)
			if trans == nil {
				LogPrintf("notify: auth")
				continue
			}
			svc, err := mirror.New(trans.Client())
			if err != nil {
				LogPrintf("notify: mirror")
				continue
			}
			sendImageCard(B64Dec(*request.Imageb64), "", svc)
		} else if request.Action == "signScript" {
			scriptBytes, err := SignatureSignScript(userId, []byte(request.Script))
			if err != nil {
				LogPrintf("notify: request")
				continue
			}
			request.Script = string(scriptBytes)
			wsSendChan <- &request
		} else {
			WSSendDevice(userId, &request)
		}
	}
}
