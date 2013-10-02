package main

import (
	"code.google.com/p/google-api-go-client/mirror/v1"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/*
{
    'id': '134343',
    'project': 'project-slug',
    'message': 'This is an example',
    'culprit': 'foo.bar.baz',
    'logger': 'root',
    'level': 'error'
}
*/

type RavenEvent struct {
	Id      string `json:"id"`
	Project string `json:"project"`
	Message string `json:"message"`
	Culprit string `json:"culprit"`
	Logger  string `json:logger"`
	Level   string `json:"level"`
}

func RavenServer(w http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	fmt.Println("Got /raven/")
	fmt.Println(req)
	userId, err := getSecretUser("raven", secretHash(req.URL.Query().Get(":key")))
	if err != nil {
		fmt.Println("Bad key")
		return
	}
	if !hasFlagSingle(userId, "flags", "user_notify") {
		return
	}
	trans := authTransport(userId)
	if trans == nil {
		fmt.Println("Couldn't get user")
		w.WriteHeader(401)
		return
	}
	if err != nil {
		fmt.Println(fmt.Errorf("Couldn't get flags: %s", err))
		w.WriteHeader(500)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Println("Couldn't read body")
		w.WriteHeader(500)
		return
	}
	var r RavenEvent
	err = json.Unmarshal(body, &r)
	if err != nil {
		fmt.Println("Couldn't unjson body")
		w.WriteHeader(400)
		return
	}
	fmt.Println(r)

	svc, _ := mirror.New(trans.Client())
	nt := &mirror.TimelineItem{
		Html:          "<article><section><div class=\"text-x-large\" style=\"\"><p class=\"yellow\">" + r.Project + "</p><p class=\"text-small\">" + r.Message + "</p></div><p class=\"text-small\">" + r.Culprit + "</p></div></section><footer><div>" + r.Level + "</div></footer></article>",
		SpeakableText: r.Project + " " + r.Level + " " + r.Message + " " + r.Culprit,
		MenuItems:     []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}},
		Notification:  &mirror.NotificationConfig{Level: "DEFAULT"},
	}
	_, err = svc.Timeline.Insert(nt).Do()
	if err != nil {
		fmt.Println("Unable to insert timeline item")
		w.WriteHeader(500)
		return
	}
}
