package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"code.google.com/p/google-api-go-client/mirror/v1"
)

type NotifyEvent struct {
	Application string `json:"application"`
	Message string `json:"message"`
	Priority bool `json:"priority"`
	Title string `json:"title"`
}

func NotifyServer(w http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	fmt.Println(req)
	userId, err := getSecretUser("notify", secretHash(req.URL.Query().Get(":key")))
	if err != nil {
		w.WriteHeader(401)
		fmt.Println("Bad key")
		return
	}
	if !hasFlagSingle(userId, "flags", "user_notify") {
		w.WriteHeader(401)
		return
	}
	trans := authTransport(userId)
	if trans == nil {
		fmt.Println("Couldn't get user")
		w.WriteHeader(401)
		return
	}
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		w.WriteHeader(500)
		return
	}
	if !hasFlag(flags, "notify") {
		fmt.Println("User not flagged")
		w.WriteHeader(400)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Println("Couldn't read body")
		w.WriteHeader(500)
		return
	}
	var r NotifyEvent
	err = json.Unmarshal(body, &r)
	if err != nil {
		fmt.Println("Couldn't unjson body")
		w.WriteHeader(400)
		return
	}
	fmt.Println(r)

	svc, _ := mirror.New(trans.Client())
	nt := &mirror.TimelineItem{
		Html: "<article><section><div class=\"text-x-large\" style=\"\"><p class=\"yellow\">" + r.Title + "</p><p class=\"text-small\">" + r.Message + "</p></div><p class=\"text-small\">" + r.Application + "</p></div></section></article>",
		SpeakableText: r.Title + " " + r.Application + " " + r.Message,
		MenuItems:    []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}},
	}
	if r.Priority {
		nt.Notification = &mirror.NotificationConfig{Level: "DEFAULT"}
	}
	_, err = svc.Timeline.Insert(nt).Do()
	if err != nil {
		fmt.Println("Unable to insert timeline item")
		w.WriteHeader(500)
		return
	}
}
