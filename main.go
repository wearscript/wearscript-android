package main

import (
	//"bytes"
	"github.com/ugorji/go-msgpack"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"bytes"
	"strconv"
	"mime/multipart"
	"github.com/bmizerany/pat"
	"time"
	"io"
	"io/ioutil"
	"log"
	//"mime/multipart"
	"net/http"
	"net/url"
	//"regexp"
	"strings"
	"code.google.com/p/goauth2/oauth"
	"code.google.com/p/google-api-go-client/oauth2/v2"
//	"code.google.com/p/google-api-go-client/googleapi"
	"code.google.com/p/google-api-go-client/mirror/v1"
)

type PostRowResponse struct {
	Row string `json:"row"`
}

//	"os"	"errors"

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

func UB64Enc(s string) string {
	return base64.URLEncoding.EncodeToString([]byte(s))
}

func B64Enc(s string) string {
	return base64.StdEncoding.EncodeToString([]byte(s))
}

func PicarusApiImageUpload(image string) (row string, err error) {
	buf := new(bytes.Buffer)
	w := multipart.NewWriter(buf)
	_, err = w.CreateFormFile(UB64Enc("data:image"), UB64Enc("data:image")) // fw
	if err != nil {
		return "", err
	}
	buf.Write([]byte(image))
	w.Close()
	req, err := http.NewRequest("POST", "https://api.picar.us/v0/data/images", buf)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", w.FormDataContentType())
	req.SetBasicAuth(picarusEmail, picarusApiKey)
	response, err := http.DefaultClient.Do(req) // res
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}
	var rowResponse PostRowResponse  
	json.Unmarshal(body, &rowResponse)
	return rowResponse.Row, nil
}

func PicarusApi(method string, path string, params url.Values) (map[string]interface{}, error) {
	var err error
	var req *http.Request
	if method == "GET" {
		req, err = http.NewRequest(method, "https://api.picar.us/v0" + path + "?" + params.Encode(), nil)
	} else {
		req, err = http.NewRequest(method, "https://api.picar.us/v0" + path, strings.NewReader(params.Encode()))
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	}
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(picarusEmail, picarusApiKey)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	fmt.Println(body)
	var v map[string]interface{}
	err = json.Unmarshal(body, &v)
	if err != nil {
		fmt.Println("Json error 1")
		return nil, err
	}
	return v, nil
}

func PicarusApiList(method string, path string, params url.Values) ([] map[string]interface{}, error) {
	var err error
	var req *http.Request
	if method == "GET" {
		req, err = http.NewRequest(method, "https://api.picar.us/v0" + path + "?" + params.Encode(), nil)
	} else {
		req, err = http.NewRequest(method, "https://api.picar.us/v0" + path, strings.NewReader(params.Encode()))
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	}
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(picarusEmail, picarusApiKey)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	fmt.Println(body)
	var v []map[string]interface{}
	err = json.Unmarshal(body, &v)
	if err != nil {
		fmt.Println("Json error 2")
		return nil, err
	}
	return v, nil
}


func PicarusApiModel(row string, model string) (string, error) {
	v, err := PicarusApi("POST", "/data/images/" + row, url.Values{"model": {model}, "action": {B64Enc("i/chain")}})
	if err != nil {
		return "", err
	}
	return v[model].(string), nil
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
		Id:          "OpenGlass",
		DisplayName: "OpenGlass",
		ImageUrls:   []string{fullUrl + "/static/logo.jpg"},
	}
	m.Contacts.Insert(c).Do()

	t := &mirror.TimelineItem{
		Text:         "Welcome to OpenGlass",
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

func notifyHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got notify...")
    not := new(mirror.Notification)
    if err := json.NewDecoder(r.Body).Decode(not); err != nil {
        fmt.Println(fmt.Errorf("Unable to decode notification: %v", err))
        return
    }
	fmt.Println(not)
    userId := not.UserToken
	itemId := not.ItemId
	fmt.Println(userId)
	fmt.Println(itemId)
	trans := authTransport(userId)

	svc, _ := mirror.New(trans.Client())

	
	t, err := svc.Timeline.Get(itemId).Do()
	fmt.Println(t)
	fmt.Println("Text: " + t.Text)
	if err != nil {
		fmt.Println(fmt.Errorf("Unable to retrieve timeline item: %s", err))
		return
	}
	if t.Attachments != nil && len(t.Attachments) > 0 {
		fmt.Println("Retrieving attachment")
		a, err := svc.Timeline.Attachments.Get(t.Id, t.Attachments[0].Id).Do()
		fmt.Println(a)
		if err != nil {
			fmt.Println("Unable to retrieve attachment metadata")
			return
		}
		req, err := http.NewRequest("GET", a.ContentUrl, nil)
		if err != nil {
			fmt.Println("Unable to create new HTTP request")
			return
		}
		resp, err := trans.RoundTrip(req)
		if err != nil {
			fmt.Println("Unable to retrieve attachment content")
			return
		}
		defer resp.Body.Close()
		// Brandyn
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Unable to read attachment body")
			return
		}
		imageRow, err := PicarusApiImageUpload(string(body))
		if err != nil {
			fmt.Println("Could not upload to Picarus")
			return
		}
		fmt.Println(imageRow)
		// If there is a caption, send it to the annotation task
		if len(t.Text) > 0 {
			_, err = PicarusApi("PATCH", "/data/images/" + UB64Enc(B64Dec(imageRow)), url.Values{B64Enc("meta:question"): {B64Enc(t.Text)}, B64Enc("meta:response_type"): {B64Enc("text")}, B64Enc("meta:openglass_user"): {B64Enc(userId)}})
			if err != nil {
				fmt.Println("Unable to patch image")
				return
			}
			// TODO: Here is where we would resize the image, we can do that later
			_, err = PicarusApi("POST", "/data/jobs/" + UB64Enc(annotationTask), url.Values{"action": {B64Enc("io/annotation/sync")}})
			if err != nil {
				fmt.Println("Unable to sync annotations")
				return
			}
		} else {
			confMsgpack, err := PicarusApiModel(UB64Enc(B64Dec(imageRow)), "cHJlZDo7bbnf0NdIIju0gHF8y+Fx")
			if err != nil {
				fmt.Println("Picarus predict error")
				return
			}
			fmt.Println(confMsgpack)

			var value float64
			err = msgpack.Unmarshal([]byte(B64Dec(confMsgpack)), &value, nil)
			if err != nil {
				fmt.Println("Msgpack unpack error")
				return
			}
			fmt.Println(value)
			nt := &mirror.TimelineItem{
				Text: fmt.Sprintf("Indoor: %f", value),
				Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
			}
			_, err = svc.Timeline.Insert(nt).Do()
			if err != nil {
				fmt.Println("Unable to insert timeline item")
				return
			}
		}
	}
}

func pollAnnotations() {
	prevTime := time.Now()
	for {
		time.Sleep(1000 * time.Millisecond)
		v, err := PicarusApiList("GET", "/data/annotation-results-" + annotationTask, url.Values{})
		if err != nil {
			fmt.Println("Poll failed")
			continue
		}
		fmt.Println(v)
		for _, element := range v {
			endTimeStrB64 := element[B64Enc("endTime")]
			if endTimeStrB64 == nil {
				continue
			}
			endTime, err := strconv.ParseFloat(B64Dec(endTimeStrB64.(string)), 64)
			if err != nil {
				fmt.Println("Couldn't parse float")
				continue
			}

			userDataB64 := element[B64Enc("userData")]
			if userDataB64 == nil {
				continue
			}
			userData := B64Dec(userDataB64.(string))

			imageB64 := element[B64Enc("image")]
			if imageB64 == nil {
				continue
			}
			image := B64Dec(imageB64.(string))

			fmt.Println(image)
			fmt.Println(userData)

			m, err := PicarusApi("GET", "/data/images/" + UB64Enc(image), url.Values{"columns": {B64Enc("meta:openglass_user")}})
			if err != nil {
				fmt.Println("Getting openglass_user failed")
				continue
			}
			userId := B64Dec(m[B64Enc("meta:openglass_user")].(string))
			fmt.Println(userId)

			if prevTime.After(time.Unix(int64(endTime), 0)) {
				continue
			}
			fmt.Println("Going to send a card!")
			trans := authTransport(userId)
			svc, _ := mirror.New(trans.Client())
			nt := &mirror.TimelineItem{
				Text: userData,
				Notification: &mirror.NotificationConfig{Level: "DEFAULT"},
			}
			_, err = svc.Timeline.Insert(nt).Do()
			if err != nil {
				fmt.Println("Unable to insert timeline item")
				continue
			}
		}
		prevTime = time.Now()
	}
}


func main() {
	m := pat.New()
	m.Get("/", http.HandlerFunc(RootServer))
	m.Get("/static/:path", http.HandlerFunc(StaticServer))
	m.Post("/query", http.HandlerFunc(QueryServer))
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
