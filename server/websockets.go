package main

import (
	"code.google.com/p/go.net/websocket"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"github.com/ugorji/go/codec"
	"fmt"
	"strings"
	"encoding/json"
	"time"
	"sync"
)

var Locks = map[string]*sync.Mutex{} // [user]
var DeviceChannels = map[string][]chan *[]interface{}{} // [user]
var WebChannels = map[string][]chan **[]interface{}{}    // [user]

func CurTime() float64 {
	return float64(time.Now().UnixNano()) / 1000000000.
}

func WSSendWeb(userId string, data **[]interface{}) error {
	Locks[userId].Lock()
	for _, c := range WebChannels[userId] {
		select {
		case c <- data:
		default:
			// TODO: return an error
			fmt.Println("Data skipped, web client too slow...")
		}
	}
	Locks[userId].Unlock()
	return nil
}

func WSSendDevice(userId string, data *[]interface{}) error {
	Locks[userId].Lock()
	for _, c := range DeviceChannels[userId] {
		select {
		case c <- data:
		default:
			// TODO: return an error
			fmt.Println("Data skipped, device too slow...")
		}
	}
	Locks[userId].Unlock()
	return nil
}

func WSUpdateConnections(userId string) error {
	Locks[userId].Lock()
	p := &[]interface{}{[]uint8("connections"), len(DeviceChannels[userId]), len(WebChannels[userId])}
	fmt.Println(*p)
	for _, c := range DeviceChannels[userId] {
		c <- p
	}
	for _, c := range WebChannels[userId] {
		c <- &p
	}
	Locks[userId].Unlock()
	return nil
}

func MsgpackMarshal(v interface{}) (data []byte, payloadType byte, err error) {
	mh := codec.MsgpackHandle{}
	enc := codec.NewEncoderBytes(&data, &mh)
	err = enc.Encode(v)
	//fmt.Println("Marshal: " + B64Enc(string(data)))
	payloadType = websocket.BinaryFrame
	return
}

func MsgpackUnmarshal(data []byte, payloadType byte, v interface{}) (err error) {
	mh := codec.MsgpackHandle{}
	dec := codec.NewDecoderBytes(data, &mh)
	err = dec.Decode(&v)
	if err != nil {
		fmt.Println(err)
	}
	//fmt.Println("Unmarshal: " + B64Enc(string(data)))
	return
}

func WSSend(c *websocket.Conn, request *[]interface{}) error {
    msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
    return msgcodec.Send(c, request)
}

func WSGlassHandler(c *websocket.Conn) {
	defer c.Close()
	fmt.Println("Connected with glass")
	path := strings.Split(c.Request().URL.Path, "/")
	if len(path) != 4 {
		fmt.Println("Bad path")
		WSSend(c, &[]interface{}{[]uint8("error"), "Bad url path"})
		return
	}
	userId, err := getSecretUser("ws", secretHash(path[len(path)-1]))
	if err != nil {
		fmt.Println(err)
		WSSend(c, &[]interface{}{[]uint8("error"), "Invalid credentials please setup glass"})
		return
	}
	svc, err := mirror.New(authTransport(userId).Client())
	if err != nil {
		LogPrintf("ws: mirror")
		WSSend(c, &[]interface{}{[]uint8("error"), "Unable to create mirror transport"})
		return
	}
	// TODO: make buffer size configurable
	if Locks[userId] == nil {
		Locks[userId] = &sync.Mutex{}
	}
	Locks[userId].Lock()
	wsSendChan := make(chan *[]interface{}, 5)
	DeviceChannels[userId] = append(DeviceChannels[userId], wsSendChan)
	Locks[userId].Unlock()
	WSUpdateConnections(userId)
	wsSendChan <- &[]interface{}{[]uint8("version"), version}
	if ravenDSN != "" {
		wsSendChan <- &[]interface{}{[]uint8("raven"), ravenDSN}
	}
	defer func () {
		Locks[userId].Lock()
		var p []chan *[]interface{}
		for _, v := range DeviceChannels[userId] {
			if v != wsSendChan {
				p = append(p, v)
			}
		}
		DeviceChannels[userId] = p
		Locks[userId].Unlock()
		WSUpdateConnections(userId)
	}()
	var latestSensors, latestImage *[]interface{}

	// Initialize delays
	die := false

	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok {
				die = true
				break
			}
			fmt.Println("Sending to glass")
			msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
			err = msgcodec.Send(c, request)
			if err != nil {
				die = true
				break
			}
		}
	}()

	// Data from glass loop
	for {
		request := []interface{}{}
		requestP := &request
		msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
		err := msgcodec.Receive(c, &request)
		if err != nil {
			LogPrintf("ws: from glass")
			fmt.Println(err)
			die = true
			close(wsSendChan)
			break
		}
		if die {
			break
		}
		action := string(request[0].([]uint8))
		//fmt.Println(action)
		if action == "timeline" {
			ti := mirror.TimelineItem{}
			err = json.Unmarshal(request[1].([]uint8), &ti)
			if err != nil {
				LogPrintf("ws: timeline: js")
				continue
			}
			req := svc.Timeline.Insert(&ti)
			//req.Media(strings.NewReader(image))
			_, err := req.Do()
			if err != nil {
				LogPrintf("ws: timeline: send")
				continue
			}
		} else if action == "log" {
			fmt.Println(request[1].([]uint8))
			WSSendWeb(userId, &requestP)
		} else if action == "sensors" {
			latestSensors = requestP
			WSSendWeb(userId, &latestSensors)
		} else if action == "image" {
			latestImage = requestP
			WSSendWeb(userId, &latestImage)
		} else {
			WSSendWeb(userId, &requestP)
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
		userId, err = getSecretUser("client", secretHash(path[len(path)-1]))
		if err != nil {
			fmt.Println(err)
			return
		}
	}
	fmt.Println("Websocket connected")
	// TODO: make buffer size configurable
	if Locks[userId] == nil {
		Locks[userId] = &sync.Mutex{}
	}
	die := false
	Locks[userId].Lock()
	wsSendChan := make(chan **[]interface{}, 5)
	WebChannels[userId] = append(WebChannels[userId], wsSendChan)
	Locks[userId].Unlock()
	WSUpdateConnections(userId)
	versionRequestP := &[]interface{}{[]uint8("version"), version}
	wsSendChan <- &versionRequestP
	if ravenDSN != "" {
		ravenRequestP := &[]interface{}{[]uint8("raven"), ravenDSN}
		wsSendChan <- &ravenRequestP
	}
	defer func () {
		Locks[userId].Lock()
		var p []chan **[]interface{}
		for _, v := range WebChannels[userId] {
			if v != wsSendChan {
				p = append(p, v)
			}
		}
		WebChannels[userId] = p
		Locks[userId].Unlock()
		WSUpdateConnections(userId)
	}()
	var lastSensors, lastImage *[]interface{}
	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok || die {
				break
			}
			msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
			action := string((**request)[0].([]uint8))
			/* NOTE(brandyn): This assumes that the pointer changes between samples,
			   I believe this is safe and it greatly simplifies sending the latest image/sensors.
			   If this doesn't hold, then we would only miss sending a sample so the harm is minimal.
			 */
			if action == "image" {
				if *request == lastImage {
					fmt.Println("Already sent image, skipping")
					continue
				}
				lastImage = *request
			} else if action == "sensors" {
				if *request == lastSensors {
					fmt.Println("Already sent sensors, skipping")
					continue
				}
				lastSensors = *request
			}
			err := msgcodec.Send(c, **request)
			if err != nil {
				return
			}
		}
	}()
	// Data from web loop
	for {
		request := []interface{}{}
		msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
		err := msgcodec.Receive(c, &request)
		if err != nil {
			fmt.Println(err)
			die = true
			close(wsSendChan)
			return
		}
		action := string(request[0].([]uint8))
		fmt.Println(action)
		if action == "signScript" {
			scriptBytes, err := SignatureSignScript(userId, request[1].([]byte))
			if err != nil {
				LogPrintf("notify: request")
				continue
			}
		    request[1] = scriptBytes
			requestP := &request
			wsSendChan <- &requestP
		} else {
			WSSendDevice(userId, &request)
		}
	}
}
