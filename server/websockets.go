package main

import (
	"code.google.com/p/go.net/websocket"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"github.com/OpenShades/wearscript-go/wearscript"
	"fmt"
	"strings"
	"time"
	"sync"
)

var Locks = map[string]*sync.Mutex{} // [user]
var UserSockets = map[string][]chan *[]interface{}{} // [user]
var Managers = map[string]*wearscript.ConnectionManager{}

func CurTime() float64 {
	return float64(time.Now().UnixNano()) / 1000000000.
}

func WSHandler(ws *websocket.Conn) {
	defer ws.Close()
	fmt.Println("Connected with glass")
	fmt.Println(ws.Request().URL.Path)
	userId, err := userID(ws.Request())
        if err != nil || userId == "" {
                path := strings.Split(ws.Request().URL.Path, "/")
		fmt.Println(path)
                if len(path) != 3 {
                        fmt.Println("Bad path")
                        return
                }
                userId, err = getSecretUser("ws", secretHash(path[len(path)-1]))
                if err != nil {
                        fmt.Println(err)
                        return
                }
        }
	userId = SanitizeUserId(userId)
	_, err = mirror.New(authTransport(userId).Client()) // svc
	if err != nil {
		LogPrintf("ws: mirror")
		//WSSend(c, &[]interface{}{[]uint8("error"), []uint8("Unable to create mirror transport")})
		return
	}
	if Managers[userId] == nil {
		Managers[userId], err = wearscript.ConnectionManagerFactory("server", "0")
		if err != nil {
			LogPrintf("ws: cm")
			return
		}
	}
	cm := Managers[userId]
	_, err = cm.NewConnection(ws) // con
	if err != nil {
		fmt.Println("Failed to create conn")
		return
	}
	for {
		// TODO: Do something smarter
		time.Sleep(time.Second * 1)
	}
}
