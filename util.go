package main
import (
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/sessions"
	"code.google.com/p/goauth2/oauth"
	"encoding/json"
	"fmt"
	"net/http"
)

// Cookie store used to store the user's ID in the current session.
var store = sessions.NewCookieStore([]byte(secret))

// OAuth2.0 configuration variables.
func config(host string) *oauth.Config {
	r := &oauth.Config{
		ClientId:       clientId,
		ClientSecret:   clientSecret,
		Scope:          scopes,
		AuthURL:        "https://accounts.google.com/o/oauth2/auth",
		TokenURL:       "https://accounts.google.com/o/oauth2/token",
		AccessType:     "offline",
		ApprovalPrompt: "force",
	}
	if len(host) > 0 {
		r.RedirectURL = fullUrl + "/oauth2callback"
	}
	return r
}

func GetRedisConnection() (redis.Conn, error) {
	// TODO: Replace with pool
	return redis.Dial("tcp", ":6383")
}

func storeUserID(w http.ResponseWriter, r *http.Request, userId string) error {
	session, err := store.Get(r, sessionName)
	if err != nil {
		fmt.Println("Couldn't get sessionName")
		return err
	}
	fmt.Println("Saves session")
	session.Values["userId"] = userId
	return session.Save(r, w)
}

// userID retrieves the current user's ID from the session's cookies.
func userID(r *http.Request) (string, error) {
	session, err := store.Get(r, sessionName)
	if err != nil {
		return "", err
	}
	userId := session.Values["userId"]
	if userId != nil {
		fmt.Println("Got session: " + userId.(string))
		return userId.(string), nil
	}
	return "", nil
}

func storeCredential(userId string, token *oauth.Token) error {
	// Store the tokens in the datastore.
	c, err := GetRedisConnection()
	if err != nil {
		return err
	}
	val, err := json.Marshal(token)
	if err != nil {
		return err
	}
	_, err = c.Do("HSET", userId, "OAuth2Token", val)
	return err
}

func setUserAttribute(userId string, attribute string, data string) error {
	c, err := GetRedisConnection()
	if err != nil {
		return err
	}
	_, err = c.Do("HSET", userId, attribute, data)
	return err
}

func getUserAttribute(userId string, attribute string) (string, error) {
	c, err := GetRedisConnection()
	if err != nil {
		return "", err
	}
	return redis.String(c.Do("HGET", userId, attribute))
}

func deleteUserAttribute(userId string, attribute string) error {
	c, err := GetRedisConnection()
	if err != nil {
		return err
	}
	_, err = c.Do("HDEL", userId, attribute)
	return err
}

func setLocationSubscription(userId string, id string) error {
	// Store the tokens in the datastore.
	c, err := GetRedisConnection()
	if err != nil {
		return err
	}
	_, err = c.Do("HSET", userId, "locsub", id)
	return err
}

func deleteLocationSubscription(userId string) error {
	// Store the tokens in the datastore.
	c, err := GetRedisConnection()
	if err != nil {
		return err
	}
	_, err = c.Do("HDEL", userId, "locsub")
	return err
}

func getLocationSubscription(userId string) (string, error) {
	// Store the tokens in the datastore.
	c, err := GetRedisConnection()
	if err != nil {
		return "", err
	}
	return redis.String(c.Do("HGET", userId, "locsub"))
}

// authTransport loads credential for user from the datastore.
func authTransport(userId string) *oauth.Transport {
	c, err := GetRedisConnection()
	if err != nil {
		return nil
	}
	val, err := redis.String(c.Do("HGET", userId, "OAuth2Token"))
	if err != nil {
		return nil
	}
	tok := new(oauth.Token)
	err = json.Unmarshal([]byte(val), tok)
	if err != nil {
		return nil
	}
	return &oauth.Transport{
		Config:    config(""),
		Token:     tok,
	}
}

func deleteCredential(userId string) error {
	c, err := GetRedisConnection()
	if err != nil {
		return err
	}
	_, err = c.Do("HDEL", userId, "OAuth2Token")
	if err != nil {
		return err
	}
	return nil
}
