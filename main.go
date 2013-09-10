package main

import (
	picarus "github.com/bwhite/picarus/go"
	"github.com/ugorji/go-msgpack"
	"encoding/json"
	"fmt"
	"github.com/gorilla/pat"
	"io"
	"strconv"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"code.google.com/p/goauth2/oauth"
	"code.google.com/p/google-api-go-client/oauth2/v2"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"code.google.com/p/go.net/websocket"
)

const revokeEndpointFmt = "https://accounts.google.com/o/oauth2/revoke?token=%s"


func StaticServer(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":path")
	if strings.ContainsAny(path, "/\\") {
		return
	}
	http.ServeFile(w, req, "static/" + path)
}

func RootServer(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Got /")
	content, err := ioutil.ReadFile("static/app.html")
	if err != nil {
		return
	}
	io.WriteString(w, string(content))
}


func DebugServer(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Debug server")
	fmt.Println(req)
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
		Id:          "Memento",
		DisplayName: "Memento",
		ImageUrls:   []string{fullUrl + "/static/memento.jpg"},
	}
	m.Contacts.Insert(c).Do()

	c = &mirror.Contact{
		Id:          "OpenGlass",
		DisplayName: "OpenGlass",
		ImageUrls:   []string{fullUrl + "/static/oglogo.png"},
	}
	m.Contacts.Insert(c).Do()

	menuItems := []*mirror.MenuItem{&mirror.MenuItem{Action: "REPLY"}, &mirror.MenuItem{Action: "TOGGLE_PINNED"}}
	for _, eventName := range eventNames {
		menuItems = append(menuItems, &mirror.MenuItem{Action: "CUSTOM", Id: eventName + " 1", Values: []*mirror.MenuValue{&mirror.MenuValue{DisplayName: eventName, IconUrl: fullUrl + "/static/icon_plus.png"}}})
		menuItems = append(menuItems, &mirror.MenuItem{Action: "CUSTOM", Id: eventName + " 0", Values: []*mirror.MenuValue{&mirror.MenuValue{DisplayName: eventName, IconUrl: fullUrl + "/static/icon_minus.png"}}})
	}	

	t := &mirror.TimelineItem{
		Text:         "OpenGlass",
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
	t := &oauth.Transport{Config:config(r.Host)}

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
	if err != nil || userId == ""{
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
		MenuItems:    []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}},
		Html: "<img src=\"attachment:0\" width=\"100%\" height=\"100%\">",
		Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
	}
	req := svc.Timeline.Insert(nt)
	req.Media(strings.NewReader(image))
	_, err := req.Do()
	if err != nil {
		LogPrintf("sendimage: insert")
		return
	}
}

func getImageAttachment(conn *picarus.Conn, svc *mirror.Service, trans *oauth.Transport, t *mirror.TimelineItem) ([]byte, error) {
	a, err := svc.Timeline.Attachments.Get(t.Id, t.Attachments[0].Id).Do()
	if err != nil {
		LogPrintf("getattachment: metadata")
		return nil, err
	}
	req, err := http.NewRequest("GET", a.ContentUrl, nil)
	if err != nil {
		LogPrintf("getattachment: http")
		return nil, err
	}
	resp, err := trans.RoundTrip(req)
	if err != nil {
		LogPrintf("getattachment: content")
		return nil, err
	}
	defer resp.Body.Close()
	imageData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		LogPrintf("getattachment: body")
		return nil, err
	}
	return imageData, nil
}

func notifyOpenGlass(conn *picarus.Conn, svc *mirror.Service, trans *oauth.Transport, t *mirror.TimelineItem, userId string) {	
	if !hasFlagSingle(userId, "flags", "user_openglass") {
		LogPrintf("openglass: flag user_openglass")
		return
	}
	var err error
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		LogPrintf("openglass: uflags")
		return
	}
	if t.Attachments != nil && len(t.Attachments) > 0 {
		imageData, err := getImageAttachment(conn, svc, trans, t)
		if err != nil {
			LogPrintf("openglass: attachment")
			return
		}
		imageRow, err := PicarusApiImageUpload(conn, imageData)
		if err != nil {
			LogPrintf("openglass: picarus upload")
			return
		}
		pushUserListTrim(userId, "images", imageRow, maxImages)
		PicarusApiRowThumb(conn, imageRow)
		if hasFlag(flags, "match_memento") {
			mementoMatches, _, err := matchMementoImage(conn, imageRow, userId)
			if err != nil {
				LogPrintf("openglass: memento match")
			} else {
				for row, note := range mementoMatches {
					m, err := conn.GetRow("images", row, []string{picarus.B64Dec(glassImageModel)})
					if err != nil {
						LogPrintf("openglass: memento get thumb")
						continue
					}
					sendImageCard(m[picarus.B64Dec(glassImageModel)], note, svc)
				}
			}
		}
		if hasFlag(flags, "location") && hasFlag(flags, "location:streetview") {
			//searchData, err := PicarusApiModel(conn, imageRow, picarus.B64Dec(locationModel))
		}
			
		if err != nil {
			LogPrintf("openglass: image search")
		}
		// Warped image example
		var imageWarped string
		if hasFlag(flags, "warp") {
			imageWarped, err := PicarusApiModel(conn, imageRow, picarus.B64Dec(homographyModel))
			if err != nil {
				LogPrintf("openglass: image warp")
				imageWarped = ""
			} else {
				sendImageCard(imageWarped, "", svc)
			}
		}
		// If there is a caption, send it to the annotation task
		if len(t.Text) > 0 {
			if hasFlag(flags, "crowdqa") {
				imageType := "full"
				if strings.HasPrefix(t.Text, "augmented ") {
					if len(imageWarped) > 0 {
						imageWarpedData := []byte(imageWarped)
						imageRowWarped, err := PicarusApiImageUpload(conn, imageWarpedData)
						PicarusApiRowThumb(conn, imageRowWarped)
						if err != nil {
							LogPrintf("openglass: warp image upload")
						} else {
							imageRow = imageRowWarped
							imageData = imageWarpedData
							imageType = "augmented"
						}
					}
					t.Text = t.Text[10:]  // Remove "augmented "
				}
				_, err = conn.PatchRow("images", imageRow, map[string]string{"meta:question": t.Text, "meta:openglass_user": userId,
					"meta:openglass_image_type": imageType}, map[string][]byte{})
				if err != nil {
					LogPrintf("openglass: patch image")
					return
				}
				// TODO: Here is where we would resize the image, we can do that later
				_, err = conn.PostRow("jobs", annotationTask, map[string]string{"action": "io/annotation/sync"})
				if err != nil {
					LogPrintf("openglass: sync annotations")
					return
				}
			}
		} else {
			if hasFlag(flags, "predict") {
				confHTML := "<article><section><ul class=\"text-x-small\">"
				menuItems := []*mirror.MenuItem{}
				for modelName, modelRow := range predictionModels {
					confMsgpack, err := PicarusApiModel(conn, imageRow, picarus.B64Dec(modelRow))
					if err != nil {
						LogPrintf("openglass: predict")
						return
					}
					var value float64
					err = msgpack.Unmarshal([]byte(confMsgpack), &value, nil)
					if err != nil {
						LogPrintf("openglass: predict msgpack")
						return
					}
					confHTML = confHTML + fmt.Sprintf("<li>%s: %f</li>", modelName, value)
					menuItems = append(menuItems, &mirror.MenuItem{Action: "CUSTOM", Id: modelName + " 1", Values: []*mirror.MenuValue{&mirror.MenuValue{DisplayName: modelName, IconUrl: fullUrl + "/static/icon_plus.png"}}})
					menuItems = append(menuItems, &mirror.MenuItem{Action: "CUSTOM", Id: modelName + " 0", Values: []*mirror.MenuValue{&mirror.MenuValue{DisplayName: modelName, IconUrl: fullUrl + "/static/icon_minus.png"}}})
				}
				menuItems = append(menuItems, &mirror.MenuItem{Action: "DELETE"})
				confHTML = confHTML + "</ul></section><footer><p>Image Attributes</p></footer></article>"
				nt := &mirror.TimelineItem{
					Html: confHTML,
					Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
					HtmlPages: []string{"<img src=\"attachment:0\" width=\"100%\" height=\"100%\">"},
					MenuItems:    menuItems,
				}
				imageThumbData, err := PicarusApiModel(conn, imageRow, picarus.B64Dec(glassImageModel))
				if err != nil {
					LogPrintf("openglass: thumb")
					return
				}
				req := svc.Timeline.Insert(nt)
				req.Media(strings.NewReader(string(imageThumbData)))
				tiConf, err := req.Do()
				if err != nil {
					LogPrintf("openglass: predictinsert")
					return
				}
				setUserAttribute(userId, "tid_to_row:" + tiConf.Id, imageRow)
			}
		}
	} else {
		if len(t.Text) > 0 {
			if strings.HasPrefix(t.Text, "where") && hasFlag(flags, "location") {
				loc, _ := svc.Locations.Get("latest").Do()
				_, err = conn.PostTable("images", map[string]string{"meta:question": t.Text, "meta:openglass_user": userId, "meta:latitude": strconv.FormatFloat(loc.Latitude, 'f', 16, 64),
					"meta:longitude": strconv.FormatFloat(loc.Longitude, 'f', 16, 64)}, map[string][]byte{}, []picarus.Slice{})
			} else {
				_, err = conn.PostTable("images", map[string]string{"meta:question": t.Text, "meta:openglass_user": userId}, map[string][]byte{}, []picarus.Slice{})
			}

			if err != nil {
				LogPrintf("openglass: qa post text-only")
				return
			}
			_, err = conn.PostRow("jobs", annotationTask, map[string]string{"action": "io/annotation/sync"})
			if err != nil {
				LogPrintf("openglass: qa post text-only sync")
				return
			}
		}
	}
}

func notifyHandler(w http.ResponseWriter, r *http.Request) {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
    not := new(mirror.Notification)
    if err := json.NewDecoder(r.Body).Decode(not); err != nil {
		LogPrintf("notify: decode")
        return
    }
    userId := not.UserToken
	itemId := not.ItemId
	fmt.Println(not)
	if not.Operation == "UPDATE" {
		ogTid, err := getUserAttribute(userId, "ogtid")
		if err != nil {
			LogPrintf("notify: ogtid")
			return
		}
		// Annotation set by user in OpenGlass
		fmt.Println(not.ItemId)
		fmt.Println(ogTid)
		if not.ItemId == ogTid {
			for _, v := range not.UserActions {
				vs := strings.Split(v.Payload, " ")
				if len(vs) != 2 || len(vs[1]) != 1 {
					LogPrintf("notify: payload")
					continue
				}
				annotationJS, err := json.Marshal(WSAnnotation{Timestamp: CurTime(), Name: vs[0], Polarity: vs[1] == "1"})
				if err != nil {
					LogPrintf("notify: annotationJS")
					return
				}
				err = pushUserListTrim(userId, "annotations", string(annotationJS), 100)
				if err != nil {
					LogPrintf("notify: push list")
					return
				}
			}
			return
		}

		imageRow, err := getUserAttribute(userId, "tid_to_row:" + not.ItemId)
		if err != nil {
			LogPrintf("notify: tid_to_row")
			return
		}
		for _, v := range not.UserActions {
			vs := strings.Split(v.Payload, " ")
			if len(vs) != 2 || predictionModels[vs[0]] == "" || len(vs[1]) != 1 {
				LogPrintf("notify: payload")
				continue
			}
			_, err = conn.PatchRow("images", imageRow, map[string]string{"meta:userannot-" + vs[0]: vs[1]}, map[string][]byte{})
			if err != nil {
				LogPrintf("notify: patch annotation")
				continue
			}
		}
		return
	}

	if not.Operation != "INSERT" {
		return
	}
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
	
	t, err := svc.Timeline.Get(itemId).Do()
	if err != nil {
		LogPrintf("notify: timeline item")
		return
	}
	notifyOG := true
	for _, r := range t.Recipients {
		if r.Id == "Memento" {
			notifyOG = false
		}
	}
	if notifyOG {
		go notifyOpenGlass(&conn, svc, trans, t, userId)
	} else {
		go notifyMemento(&conn, svc, trans, t, userId)
	}
}

func main() {
    //conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	//reprocessMementoImages(&conn)
	//ImageMatch("109113122718379096525-00031.jpg", "20130804_231641_375.jpg")
	m := pat.New()
	//m.Post("/", http.HandlerFunc(DebugServer))
	m.Get("/map", http.HandlerFunc(MapServer))
	m.Get("/search", http.HandlerFunc(MementoSearchServer))
	m.Get("/static/{path}", http.HandlerFunc(StaticServer))
	m.Post("/raven/{key}", http.HandlerFunc(RavenServer))
	m.Post("/notify/{key}", http.HandlerFunc(NotifyServer))
	m.Post("/pupil/{key}", http.HandlerFunc(PupilServer))
	m.Post("/location", http.HandlerFunc(LocationHandler))
	m.Post("/setup", http.HandlerFunc(SetupHandler))
	m.Post("/user/key/{type}", http.HandlerFunc(SecretKeySetupHandler))

	// /auth -> google -> /oauth2callback
	m.Get("/auth", http.HandlerFunc(authHandler))
	m.Get("/oauth2callback", http.HandlerFunc(oauth2callbackHandler))
	m.Post("/notify", http.HandlerFunc(NotifyServer))
	//m.Post("/notify", http.HandlerFunc(notifyHandler))
	m.Post("/signout", http.HandlerFunc(signoutHandler))
	m.Post("/flags", http.HandlerFunc(FlagsHandler))
	m.Get("/flags", http.HandlerFunc(FlagsHandler))
	m.Delete("/flags", http.HandlerFunc(FlagsHandler))
	m.Get("/", http.HandlerFunc(RootServer))
	go pollAnnotations()
	http.Handle("/ws/glass/", websocket.Handler(WSGlassHandler))
	http.Handle("/ws/web", websocket.Handler(WSWebHandler))
	http.Handle("/", m)
	err := http.ListenAndServe(":16001", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
