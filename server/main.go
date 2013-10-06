package main

import (
	"code.google.com/p/go.net/websocket"
	"code.google.com/p/goauth2/oauth"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"code.google.com/p/google-api-go-client/oauth2/v2"
	"encoding/json"
	"fmt"
	"github.com/gorilla/pat"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

const revokeEndpointFmt = "https://accounts.google.com/o/oauth2/revoke?token=%s"

func StaticServer(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":path")
	if strings.ContainsAny(path, "/\\") {
		return
	}
	http.ServeFile(w, req, "static/"+path)
}

type PlaygroundTemplate struct {
	WSUrl     string
	GlassBody string
}

type PlaygroundGlassTemplate struct {
	WSUrl string
}

func PlaygroundServer(w http.ResponseWriter, req *http.Request) {
	userId, err := userID(req)
	if userId == "" || err != nil {
		http.Redirect(w, req, fullUrl + "/auth", http.StatusFound)
		return
	}
	t, err := template.ParseFiles("static/playground.html")
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("playground: template parse")
		return
	}
	glassBody, err := ioutil.ReadFile("static/playground_glass.html")
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("playground: glass")
		return
	}
	err = t.Execute(w, PlaygroundTemplate{WSUrl: wsUrl, GlassBody: string(glassBody)})
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("playground: template execute")
		return
	}
}

func PlaygroundGlassServer(w http.ResponseWriter, req *http.Request) {
	key := req.URL.Query().Get(":key")
	t, err := template.New("bios").Parse("<script>function s() {WS.log('Connected')};window.onload=function () {WS.serverConnect('{{.WSUrl}}', 's')}</script>")
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("playgroundglass: template parse")
		return
	}
	err = t.Execute(w, &PlaygroundGlassTemplate{WSUrl: wsUrl + "/ws/glass/" + key})
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("playgroundglass: template execute")
		return
	}
}

func setupUser(r *http.Request, client *http.Client, userId string) {
	m, _ := mirror.New(client)
	s := &mirror.Subscription{
		Collection:  "timeline",
		UserToken:   userId,
		CallbackUrl: fullUrl + "/notify",
	}
	m.Subscriptions.Insert(s).Do()

	c := &mirror.Contact{
		Id:          "WearScript",
		DisplayName: "WearScript",
		ImageUrls:   []string{fullUrl + "/static/oglogo.png"},
	}
	m.Contacts.Insert(c).Do()

	menuItems := []*mirror.MenuItem{&mirror.MenuItem{Action: "REPLY"}, &mirror.MenuItem{Action: "TOGGLE_PINNED"}}

	t := &mirror.TimelineItem{
		Text:         "WearScript",
		Creator:      c,
		MenuItems:    menuItems,
		Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
	}

	req, _ := m.Timeline.Insert(t).Do()
	setUserAttribute(userId, "ogtid", req.Id)
}

// auth is the HTTP handler that redirects the user to authenticate
// with OAuth.
func authHandler(w http.ResponseWriter, r *http.Request) {
	url := config(r.Host).AuthCodeURL(r.URL.RawQuery)
	http.Redirect(w, r, url, http.StatusFound)
}

// oauth2callback is the handler to which Google's OAuth service redirects the
// user after they have granted the appropriate permissions.
func oauth2callbackHandler(w http.ResponseWriter, r *http.Request) {
	// Create an oauth transport with a urlfetch.Transport embedded inside.
	t := &oauth.Transport{Config: config(r.Host)}

	// Exchange the code for access and refresh tokens.
	tok, err := t.Exchange(r.FormValue("code"))
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("oauth: exchange")
		return
	}
	o, err := oauth2.New(t.Client())
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("oauth: oauth get")
		return
	}
	u, err := o.Userinfo.Get().Do()
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("oauth: userinfo get")
		return
	}
	userId := fmt.Sprintf("%s_%s", strings.Split(clientId, ".")[0], u.Id)
	if err = storeUserID(w, r, userId); err != nil {
		w.WriteHeader(500)
		LogPrintf("oauth: store userid")
		return
	}
	userSer, err := json.Marshal(u)
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("oauth: json marshal")
		return
	}
	storeCredential(userId, tok, string(userSer))
	http.Redirect(w, r, fullUrl, http.StatusFound)
}

func SetupHandler(w http.ResponseWriter, r *http.Request) {
	userId, err := userID(r)
	if err != nil || userId == "" {
		w.WriteHeader(400)
		LogPrintf("setup: userid")
		return
	}
	t := authTransport(userId)
	if t == nil {
		w.WriteHeader(401)
		LogPrintf("setup: auth")
		return
	}
	setupUser(r, t.Client(), userId)
}

// signout Revokes access for the user and removes the associated credentials from the datastore.
func signoutHandler(w http.ResponseWriter, r *http.Request) {
	userId, err := userID(r)
	if err != nil || userId == "" {
		w.WriteHeader(400)
		LogPrintf("signout: userid")
		return
	}
	t := authTransport(userId)
	if t == nil {
		w.WriteHeader(500)
		LogPrintf("signout: auth")
		return
	}
	req, err := http.NewRequest("GET", fmt.Sprintf(revokeEndpointFmt, t.Token.RefreshToken), nil)
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("signout: revoke")
		return
	}
	defer response.Body.Close()
	storeUserID(w, r, "")
	deleteCredential(userId)
	http.Redirect(w, r, fullUrl, http.StatusFound)
}

func sendImageCard(image string, text string, svc *mirror.Service) {
	nt := &mirror.TimelineItem{
		SpeakableText: text,
		MenuItems:     []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}},
		Html:          "<img src=\"attachment:0\" width=\"100%\" height=\"100%\">",
		Notification:  &mirror.NotificationConfig{Level: "DEFAULT"},
	}
	req := svc.Timeline.Insert(nt)
	req.Media(strings.NewReader(image))
	_, err := req.Do()
	if err != nil {
		LogPrintf("sendimage: insert")
		return
	}
}

func main() {
	m := pat.New()
	m.Get("/static/{path}", http.HandlerFunc(StaticServer))
	m.Post("/notify/{key}", http.HandlerFunc(NotifyServer))
	m.Post("/setup", http.HandlerFunc(SetupHandler))
	m.Post("/user/key/{type}", http.HandlerFunc(SecretKeySetupHandler))

	// Control flow is: /auth -> google -> /oauth2callback
	m.Get("/auth", http.HandlerFunc(authHandler))
	m.Get("/oauth2callback", http.HandlerFunc(oauth2callbackHandler))

	m.Post("/signout", http.HandlerFunc(signoutHandler))
	m.Post("/flags", http.HandlerFunc(FlagsHandler))
	m.Get("/flags", http.HandlerFunc(FlagsHandler))
	m.Delete("/flags", http.HandlerFunc(FlagsHandler))
	m.Get("/playground/{key}", http.HandlerFunc(PlaygroundGlassServer))
	http.Handle("/ws/glass/", websocket.Handler(WSGlassHandler))
	http.Handle("/ws/web", websocket.Handler(WSWebHandler))
	http.Handle("/ws/web/", websocket.Handler(WSWebHandler))
	m.Get("/", http.HandlerFunc(PlaygroundServer))
	http.Handle("/", m)
	err := http.ListenAndServe(":"+servePort, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
