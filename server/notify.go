package main

import (
	"code.google.com/p/google-api-go-client/mirror/v1"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type NotifyEvent struct {
	Application   string   `json:"application"`
	Message       string   `json:"message"`
	Priority      bool     `json:"priority"`
	Title         string   `json:"title"`
	Key           string   `json:"key"`
	Html          string   `json:"html"`
	SpeakableText string   `json:"speakableText"`
	HtmlPages     []string `json:"htmlPages"`
}

func NotifyServer(w http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	fmt.Println("Got /notify/")

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		LogPrintf("/notify/: couldn't read body")
		w.WriteHeader(500)
		return
	}
	var r NotifyEvent
	err = json.Unmarshal(body, &r)
	if err != nil {
		LogPrintf("/notify/: couldn't unjson body")
		w.WriteHeader(400)
		return
	}
	fmt.Println(r)

	fmt.Println(req)
	if r.Key == "" {
		r.Key = req.URL.Query().Get(":key")
	}
	userId, err := getSecretUser("notify", secretHash(r.Key))
	if err != nil {
		w.WriteHeader(401)
		LogPrintf("/notify/: bad key")
		return
	}
	if !hasFlagSingle(userId, "flags", "user_notify") {
		w.WriteHeader(401)
		LogPrintf("/notify/: bad flag")
		return
	}
	trans := authTransport(userId)
	if trans == nil {
		LogPrintf("/notify/: couldn't get user")
		w.WriteHeader(401)
		return
	}
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		LogPrintf("/notify/: couldn't get flags")
		w.WriteHeader(500)
		return
	}
	if !hasFlag(flags, "notify") {
		LogPrintf("/notify/: user not flagged")
		w.WriteHeader(400)
		return
	}

	svc, err := mirror.New(trans.Client())
	if err != nil {
		LogPrintf("/notify/: couldn't create mirror")
		w.WriteHeader(400)
		return
	}

	nt := &mirror.TimelineItem{}
	if r.Html == "" {
		nt.Html = "<article><section><div class=\"text-x-large\" style=\"\"><p class=\"yellow\">" + r.Title + "</p><p class=\"text-small\">" + r.Message + "</p></div><p class=\"text-small\">" + r.Application + "</p></div></section></article>"
		nt.SpeakableText = r.Title + " " + r.Application + " " + r.Message
	} else {
		nt.Html = r.Html
	}
	if r.HtmlPages != nil {
		nt.HtmlPages = r.HtmlPages
	}
	if r.SpeakableText != "" {
		nt.SpeakableText = r.SpeakableText
	}
	if nt.SpeakableText != "" {
		nt.MenuItems = []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}}
	} else {
		nt.MenuItems = []*mirror.MenuItem{&mirror.MenuItem{Action: "DELETE"}}
	}
	if r.Priority {
		nt.Notification = &mirror.NotificationConfig{Level: "DEFAULT"}
	}
	fmt.Println(nt)
	_, err = svc.Timeline.Insert(nt).Do()
	if err != nil {
		LogPrintf("/notify/: unable to insert timeline")
		w.WriteHeader(500)
		return
	}
}
