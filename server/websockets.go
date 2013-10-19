package main

import (
	"code.google.com/p/go.net/websocket"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"github.com/ugorji/go/codec"
	"fmt"
	"strings"
	"encoding/json"
	"time"
)

var DeviceChannels = map[string][]chan *[]interface{}{} // [user]
var WebChannels = map[string][]chan *[]interface{}{}    // [user]

func CurTime() float64 {
	return float64(time.Now().UnixNano()) / 1000000000.
}

func WSSendWeb(userId string, data *[]interface{}) error {
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

func WSSendDevice(userId string, data *[]interface{}) error {
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
	wsSendChan := make(chan *[]interface{}, 5)
	DeviceChannels[userId] = append(DeviceChannels[userId], wsSendChan)

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
			fmt.Println(request)
			msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
			err = msgcodec.Send(c, request)
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
			wsSendChan <- &[]interface{}{"flags", uflags}
			time.Sleep(time.Millisecond * 2000)
		}
	}()

	// Data from glass loop
	for {
		request := []interface{}{}
		msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
		err := msgcodec.Receive(c, &request)
		if err != nil {
			LogPrintf("ws: from glass")
			fmt.Println(err)
			die = true
			break
		}
		if die {
			break
		}
		action := string(request[0].([]uint8))
		fmt.Println(action)
		if action == "timeline" {
			ti := mirror.TimelineItem{}
			err = json.Unmarshal(request[1].([]byte), &ti)
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
			fmt.Println(request[1].(string))
			WSSendWeb(userId, &request)
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
	wsSendChan := make(chan *[]interface{}, 5)
	WebChannels[userId] = append(WebChannels[userId], wsSendChan)
	// Websocket sender
	go func() {
		for {
			request, ok := <-wsSendChan
			if !ok {
				break
			}
			msgcodec := websocket.Codec{MsgpackMarshal, MsgpackUnmarshal}
			err := msgcodec.Send(c, *request)
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
			return
		}
		action := string(request[0].([]uint8))
		fmt.Println(action)
		if action == "sendTimelineImage" {
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
			sendImageCard(request[1].(string), "", svc)
		} else if action == "signScript" {
			scriptBytes, err := SignatureSignScript(userId, request[1].([]byte))
			if err != nil {
				LogPrintf("notify: request")
				continue
			}
		    request[1] = scriptBytes
			wsSendChan <- &request
		} else {
			WSSendDevice(userId, &request)
		}
	}
}
