package main

import (
	picarus "github.com/bwhite/picarus/go"
	"github.com/ugorji/go-msgpack"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"github.com/bmizerany/pat"
	"time"
	"io"
	"strconv"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"code.google.com/p/goauth2/oauth"
	"code.google.com/p/google-api-go-client/oauth2/v2"
	"code.google.com/p/google-api-go-client/mirror/v1"
)

const revokeEndpointFmt = "https://accounts.google.com/o/oauth2/revoke?token=%s"

func UB64Dec(s string) string {
	decoded, err := base64.URLEncoding.DecodeString(s)
	if err != nil {
		panic(err)
	}
	return string(decoded)
}

func B64Dec(s string) string {
	decoded, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		fmt.Println(s)
		panic(err)
	}
	return string(decoded)
}

func B64DecBytes(s string) []byte {
	decoded, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		fmt.Println(s)
		panic(err)
	}
	return decoded
}

func UB64Enc(s string) string {
	return base64.URLEncoding.EncodeToString([]byte(s))
}

func B64Enc(s string) string {
	return base64.StdEncoding.EncodeToString([]byte(s))
}

func PicarusApiImageUpload(conn *picarus.Conn, image []byte) (row string, err error) {
	// TODO: Remove this and use the underlying method since we follow this with a patch anyways
	out, err := conn.PostTable("images", map[string]string{}, map[string][]byte{"data:image": image}, []picarus.Slice{})
	return out["row"], err
}

func PicarusApiModel(conn *picarus.Conn, row string, model string) (string, error) {
	v, err := conn.PostRow("images", row, map[string]string{"model": model, "action": "i/chain"})
	if err != nil {
		return "", err
	}
	return v[model], nil
}

func PicarusApiModelStore(conn *picarus.Conn, row string, model string) (string, error) {
	v, err := conn.PostRow("images", row, map[string]string{"model": model, "action": "io/chain"})
	if err != nil {
		return "", err
	}
	return v[model], nil
}


func PicarusApiRowThumb(conn *picarus.Conn, row string) (string, error) {
	v, err := conn.PostRow("images", row, map[string]string{"action": "io/thumbnail"})
	if err != nil {
		return "", err
	}
	return v["thum:image_150sq"], nil
}


func StaticServer(w http.ResponseWriter, req *http.Request) {
	content, err := ioutil.ReadFile("static/" + req.URL.Query().Get(":path"))
	if err != nil {
		return
	}
	io.WriteString(w, string(content))
}

func RootServer(w http.ResponseWriter, req *http.Request) {
	content, err := ioutil.ReadFile("static/app.html")
	if err != nil {
		return
	}
	io.WriteString(w, string(content))
}

func QueryServer(w http.ResponseWriter, req *http.Request) {
	fmt.Println(req.FormValue("q"))
}


// Auth: From google's demo project, apache 2.0

func bootstrapUser(r *http.Request, client *http.Client, userId string) {
	fmt.Println("Bootstrapping user...")
	m, _ := mirror.New(client)


	fmt.Println("Using mirror api...")
	s := &mirror.Subscription{
		Collection:  "timeline",
		UserToken:   userId,
		CallbackUrl: fullUrl + "/notify",
	}
	m.Subscriptions.Insert(s).Do()

	c := &mirror.Contact{
		Id:          "Memento",
		DisplayName: "Memento",
		ImageUrls:   []string{fullUrl + "/static/logo.jpg"},
	}
	m.Contacts.Insert(c).Do()

	c = &mirror.Contact{
		Id:          "OpenGlass",
		DisplayName: "OpenGlass",
		ImageUrls:   []string{fullUrl + "/static/logo.jpg"},
	}
	m.Contacts.Insert(c).Do()

	t := &mirror.TimelineItem{
		Text:         "OpenGlass",
		Creator:      c,
		MenuItems:    []*mirror.MenuItem{&mirror.MenuItem{Action: "REPLY"}, &mirror.MenuItem{Action: "TOGGLE_PINNED"}},
		Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
	}

	m.Timeline.Insert(t).Do()
}


// auth is the HTTP handler that redirects the user to authenticate
// with OAuth.
func authHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Redirecting to Google's Oauth service...")
	url := config(r.Host).AuthCodeURL(r.URL.RawQuery)
	http.Redirect(w, r, url, http.StatusFound)
}

// oauth2callback is the handler to which Google's OAuth service redirects the
// user after they have granted the appropriate permissions.
func oauth2callbackHandler(w http.ResponseWriter, r *http.Request) {
	// Create an oauth transport with a urlfetch.Transport embedded inside.
	fmt.Println("Got oauth callback...")
	t := &oauth.Transport{Config:config(r.Host)}
	//Transport: &urlfetch.Transport{Context: c}

	// Exchange the code for access and refresh tokens.
	tok, err := t.Exchange(r.FormValue("code"))
	if err != nil {
		return
	}
	o, err := oauth2.New(t.Client())
	if err != nil {
		return
	}
	u, err := o.Userinfo.Get().Do()
	if err != nil {
		return
	}

	userId := fmt.Sprintf("%s_%s", strings.Split(clientId, ".")[0], u.Id)
	if err = storeUserID(w, r, userId); err != nil {
		return
	}
	storeCredential(userId, tok)

	bootstrapUser(r, t.Client(), userId)
	fmt.Println("Oauth callback succeeded, redirecting...")
	http.Redirect(w, r, fullUrl, http.StatusFound)
	return
}

// signout Revokes access for the user and removes the associated credentials from the datastore.
func signoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}
	fmt.Println("Signing out user...")
	userId, err := userID(r)
	if err != nil {
		return
	}
	if userId == "" {
		http.Redirect(w, r, fullUrl + "/auth", http.StatusFound)
		return
	}
	t := authTransport(userId)
	if t == nil {
		http.Redirect(w, r, fullUrl + "/auth", http.StatusFound)
		return
	}
	req, err := http.NewRequest("GET", fmt.Sprintf(revokeEndpointFmt, t.Token.RefreshToken), nil)
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return
	}
	defer response.Body.Close()
	storeUserID(w, r, "")
	deleteCredential(userId)
	http.Redirect(w, r, fullUrl, http.StatusFound)
	return
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
		fmt.Println("Unable to insert timeline item")
	}
}

func readFile(filename string) (string, error) {
	fi, err := os.Open(filename)
	if err != nil {
		fmt.Println("Couldn't open file: " + filename)
		return "", err
	}
	defer func() {
		if err := fi.Close(); err != nil {
			fmt.Println("Couldn't close file:" + filename)
		}
	}()
	buf := make([]byte, 1024)
	data := ""
	for {
		// read a chunk
		n, err := fi.Read(buf)
		if err != nil && err != io.EOF {
			fmt.Println("Couldn't read file: " + filename)
			return "", err
		}
		if n == 0 { break }
		data = data + string(buf[:n])
	}
	return data, nil
}

func WriteFile(filename string, data string) {
	fo, err := os.Create(filename)
	if err != nil { fmt.Println("Couldn't create file") }
	defer func() {
		if err := fo.Close(); err != nil {
			fmt.Println("Couldn't close file")
		}
	}()
	if _, err := fo.Write([]byte(data)); err != nil {
		fmt.Println("Couldn't write file")
	}
}


func getImageAttachment(conn *picarus.Conn, svc *mirror.Service, trans *oauth.Transport, t *mirror.TimelineItem) ([]byte, error) {
	fmt.Println("Retrieving attachment")
	a, err := svc.Timeline.Attachments.Get(t.Id, t.Attachments[0].Id).Do()
	fmt.Println(a)
	if err != nil {
		fmt.Println("Unable to retrieve attachment metadata")
		return nil, err
	}
	req, err := http.NewRequest("GET", a.ContentUrl, nil)
	if err != nil {
		fmt.Println("Unable to create new HTTP request")
		return nil, err
	}
	resp, err := trans.RoundTrip(req)
	if err != nil {
		fmt.Println("Unable to retrieve attachment content")
		return nil, err
	}
	defer resp.Body.Close()
	// Brandyn
	imageData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Unable to read attachment body")
		return nil, err
	}
	return imageData, nil
}


func notifyOpenGlass(conn *picarus.Conn, svc *mirror.Service, trans *oauth.Transport, t *mirror.TimelineItem, userId string) {	
	fmt.Println("Text: " + t.Text)
	var err error
	if err != nil {
		fmt.Println(fmt.Errorf("Unable to retrieve timeline item: %s", err))
		return
	}
	if t.Attachments != nil && len(t.Attachments) > 0 {
		imageData, err := getImageAttachment(conn, svc, trans, t)
		if err != nil {
			fmt.Println("Couldn't get image attachment")
			return
		}
		imageRow, err := PicarusApiImageUpload(conn, imageData)
		if err != nil {
			fmt.Println("Could not upload to Picarus")
			return
		}
		PicarusApiRowThumb(conn, imageRow)

		mementoMatches, _, err := matchMementoFeatures(conn, imageRow)
		if err != nil {
			fmt.Println("Couldn't match memento")
		} else {
			fmt.Println("Memento matches")
			fmt.Println(mementoMatches)
			for row, note := range mementoMatches {
				m, err := conn.GetRow("images", row, []string{picarus.B64Dec(glassImageModel)})
				if err != nil {
					fmt.Println("Getting image thumb failed in memento")
					continue
				}
				sendImageCard(m[picarus.B64Dec(glassImageModel)], note, svc)
			}
		}
		//searchData, err := PicarusApiModel(conn, imageRow, B64Dec(locationModel))
			
		if err != nil {
			fmt.Println("Image search error")
			fmt.Println(err)
		} else {
			setUserAttribute(userId, "latest_image_row", imageRow)
			//setUserAttribute(userId, "latest_image_search", searchData)
		}
		// Warped image example
		imageWarped, err := PicarusApiModel(conn, imageRow, B64Dec(homographyModel))
		if err != nil {
			fmt.Println("Image warp error")
			imageWarped = ""
		} else {
			sendImageCard(imageWarped, "", svc)
			fo, err := os.Create(userId + ".output.jpg")
			if err != nil { fmt.Println("Couldn't create warp file") }
			// close fo on exit and check for its returned error
			defer func() {
				if err := fo.Close(); err != nil {
					fmt.Println("Couldn't close warp file")
				}
			}()
			if _, err := fo.Write([]byte(imageWarped)); err != nil {
				fmt.Println("Couldn't write warp file")
			}
		}

		// If there is a caption, send it to the annotation task
		if len(t.Text) > 0 {
			imageType := "full"
			if strings.HasPrefix(t.Text, "augmented ") {
				if len(imageWarped) > 0 {
					imageWarpedData := []byte(imageWarped)
					imageRowWarped, err := PicarusApiImageUpload(conn, imageWarpedData)
					PicarusApiRowThumb(conn, imageRowWarped)
					if err != nil {
						fmt.Println("Could not upload warped image to Picarus")
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
				fmt.Println("Unable to patch image")
				return
			}
			// TODO: Here is where we would resize the image, we can do that later
			_, err = conn.PostRow("jobs", annotationTask, map[string]string{"action": "io/annotation/sync"})
			if err != nil {
				fmt.Println("Unable to sync annotations")
				return
			}
		} else {
			confHTML := "<article><section><ul class=\"text-x-small\">"
			menuItems := []*mirror.MenuItem{}
			for modelName, modelRow := range predictionModels {
				confMsgpack, err := PicarusApiModel(conn, imageRow, B64Dec(modelRow))
				if err != nil {
					fmt.Println("Picarus predict error")
					return
				}

				var value float64
				err = msgpack.Unmarshal([]byte(confMsgpack), &value, nil)
				if err != nil {
					fmt.Println("Msgpack unpack error")
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
				fmt.Println("Unable to create thumbnail")
				return
			}
			req := svc.Timeline.Insert(nt)
			req.Media(strings.NewReader(string(imageThumbData)))
			tiConf, err := req.Do()
			if err != nil {
				fmt.Println("Unable to insert timeline item")
				return
			}
			setUserAttribute(userId, "tid_to_row:" + tiConf.Id, imageRow)
		}
	} else {
		if len(t.Text) > 0 {
			if strings.HasPrefix(t.Text, "where") {
				loc, _ := svc.Locations.Get("latest").Do()
				fmt.Println(*loc)
				_, err = conn.PostTable("images", map[string]string{"meta:question": t.Text, "meta:openglass_user": userId, "meta:latitude": strconv.FormatFloat(loc.Latitude, 'f', 16, 64),
					"meta:longitude": strconv.FormatFloat(loc.Longitude, 'f', 16, 64)}, map[string][]byte{}, []picarus.Slice{})
			} else {
				_, err = conn.PostTable("images", map[string]string{"meta:question": t.Text, "meta:openglass_user": userId}, map[string][]byte{}, []picarus.Slice{})
			}

			if err != nil {
				fmt.Println("Unable to POST text-only message")
				return
			}
			_, err = conn.PostRow("jobs", annotationTask, map[string]string{"action": "io/annotation/sync"})
			if err != nil {
				fmt.Println("Unable to sync annotations")
				return
			}
		}
	}
}


func notifyHandler(w http.ResponseWriter, r *http.Request) {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	fmt.Println("Got notify...")
    not := new(mirror.Notification)
    if err := json.NewDecoder(r.Body).Decode(not); err != nil {
        fmt.Println(fmt.Errorf("Unable to decode notification: %v", err))
        return
    }
	fmt.Println("Notification")
	fmt.Println(not)
	for _, v := range not.UserActions {
		fmt.Println(v)
	}
    userId := not.UserToken
	itemId := not.ItemId
	if not.Operation == "UPDATE" {
		imageRow, err := getUserAttribute(userId, "tid_to_row:" + not.ItemId)
		if err != nil {
			fmt.Println(err)
			return
		}
		for _, v := range not.UserActions {
			vs := strings.Split(v.Payload, " ")
			if len(vs) != 2 || predictionModels[vs[0]] == "" || len(vs[1]) != 1 {
				fmt.Println("Unknown payload")
				continue
			}
			_, err = conn.PatchRow("images", imageRow, map[string]string{"meta:userannot-" + vs[0]: vs[1]}, map[string][]byte{})
			if err != nil {
				fmt.Println("Couldn't patch row with annotation")
			}
		}
		return
	}

	if not.Operation != "INSERT" {
		fmt.Println("Not an insert, quitting...")
		return
	}
	trans := authTransport(userId)

	svc, _ := mirror.New(trans.Client())
	t, err := svc.Timeline.Get(itemId).Do()
	if err != nil {
		fmt.Println("Couldn't get timeline item")
		return
	}
	fmt.Println("Timelineitem")
	fmt.Println(t)
	notifyOG := true
	for _, r := range t.Recipients {
		if r.Id == "Memento" {
			notifyOG = false
		}
	}
	// TODO: Look into this more
	if notifyOG {
		notifyOpenGlass(&conn, svc, trans, t, userId)
	} else {
		notifyMemento(&conn, svc, trans, t, userId)
	}

}

type UserData struct {
	Text string `json:"text"`	
	Latitude  float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
	ImageUrl string `json:"image_url"`
}

func download(url string) (io.ReadCloser, error) {
	var err error
	var req *http.Request

	req, err = http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	return res.Body, nil
}

func pollAnnotations() {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	prevTime := time.Now()
	for {
		time.Sleep(10000 * time.Millisecond)
		v, err := conn.GetTable("annotation-results-" + annotationTask, []string{})
		if err != nil {
			fmt.Println("Poll failed")
			continue
		}
		nextTime := prevTime
		cnt := 0
		for _, element := range v {
			endTime, err := strconv.ParseFloat(element["endTime"], 64)
			if err != nil {
				continue
			}
			curTime := time.Unix(int64(endTime), 0)
			if nextTime.Before(curTime) {
				nextTime = curTime
			}

			if !prevTime.Before(curTime) {
				continue
			}
			var userData UserData
			err = json.Unmarshal([]byte(element["userData"]), &userData)
			if err != nil {
				fmt.Println("Json error in user data")
				continue
			}

			image := element["image"]
			question := element["question"]
			if len(question) == 0 || len(image) == 0 {
				fmt.Println("Missing image or question")
				continue
			}

			fmt.Println(userData)

			m, err := conn.GetRow("images", image, []string{"meta:openglass_user"})
			if err != nil {
				fmt.Println("Getting openglass_user failed")
				continue
			}
			userId := m["meta:openglass_user"]
			//fmt.Println(userId)
			if cnt > 3 {
				return
			}
			cnt += 1
			fmt.Println("Going to send a card!")
			trans := authTransport(userId)
			svc, _ := mirror.New(trans.Client())
		    text := question + "? " + userData.Text
			fmt.Println(text)

			nt := &mirror.TimelineItem{
				Text: text,
			    Html: "<article><section><p class=\"text-normal\" data-text-autosize=\"true\">" + text + "</p></section></article>",
				SpeakableText: text,
				MenuItems:    []*mirror.MenuItem{&mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}},
				Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
			}

			if userData.ImageUrl != "" {
				nt.HtmlPages = []string{"<img src=\"attachment:0\" width=\"100%\" height=\"100%\">"}
			}
			if userData.Latitude != 0. && userData.Longitude != 0. {
				nt.MenuItems = []*mirror.MenuItem{&mirror.MenuItem{Action: "NAVIGATE"}, &mirror.MenuItem{Action: "READ_ALOUD"}, &mirror.MenuItem{Action: "DELETE"}}
				nt.Location = &mirror.Location{Latitude: userData.Latitude, Longitude: userData.Longitude}
			}
			req := svc.Timeline.Insert(nt)

			if userData.ImageUrl != "" {
				media, err := download(userData.ImageUrl)
				if err != nil {
					fmt.Println("Couldn't download image")
					continue
				}
				req.Media(media)
				defer media.Close()
			}
			_, err = req.Do()
			if err != nil {
				fmt.Println("Unable to insert timeline item")
				continue
			}
		}
		prevTime = nextTime
	}
}


func main() {
    //conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	//reprocessMementoImages(&conn)
	m := pat.New()
	m.Get("/", http.HandlerFunc(RootServer))
	m.Get("/map", http.HandlerFunc(MapServer))
	m.Get("/search", http.HandlerFunc(MementoSearchServer))
	m.Get("/static/:path", http.HandlerFunc(StaticServer))
	m.Post("/raven/:raven", http.HandlerFunc(RavenServer))
	m.Post("/location/on", http.HandlerFunc(LocationOnHandler))
	m.Post("/location/off", http.HandlerFunc(LocationOffHandler))
	m.Post("/location", http.HandlerFunc(LocationHandler))
	m.Post("/raven", http.HandlerFunc(RavenSetupHandler))
	m.Post("/query", http.HandlerFunc(QueryServer))
	m.Post("/sensors", http.HandlerFunc(SensorsHandler))
	m.Post("/images", http.HandlerFunc(ImagesHandler))
	// /auth -> google -> /oauth2callback
	m.Get("/auth", http.HandlerFunc(authHandler))
	m.Get("/oauth2callback", http.HandlerFunc(oauth2callbackHandler))
	m.Post("/signout", http.HandlerFunc(signoutHandler))
	m.Post("/notify", http.HandlerFunc(notifyHandler))
	go pollAnnotations()
	http.Handle("/", m)
	err := http.ListenAndServe(":16001", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
