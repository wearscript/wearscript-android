package main

import (
	"bytes"
	"code.google.com/p/goauth2/oauth"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
)

func AuthHandlerGH(w http.ResponseWriter, r *http.Request) {
	userId, err := userID(r)
	if userId == "" || err != nil {
		fmt.Println("User id not found")
		http.Redirect(w, r, fullUrl+"/auth", http.StatusFound)
		return
	}
	rand, err := RandString()
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("github: random")
		return
	}
	url := fmt.Sprintf("https://github.com/login/oauth/authorize?client_id=%s&scope=gist&state=%s&redirect_uri=%s/oauth2callbackgh", clientIdGH, UB64Enc(rand), fullUrl)
	http.Redirect(w, r, url, http.StatusFound)
}

func configgh() *oauth.Config {
	r := &oauth.Config{
		ClientId:     clientIdGH,
		ClientSecret: clientSecretGH,
		Scope:        "gist",
		TokenURL:     "https://github.com/login/oauth/access_token",
		RedirectURL:  fullUrl + "/oauth2callbackgh",
	}
	return r
}

func Oauth2callbackHandlerGH(w http.ResponseWriter, r *http.Request) {
	userId, err := userID(r)
	if userId == "" || err != nil {
		http.Redirect(w, r, fullUrl+"/auth", http.StatusFound)
		return
	}
	t := &oauth.Transport{Config: configgh()}
	// Exchange the code for access and refresh tokens.
	tok, err := t.Exchange(r.FormValue("code"))
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("oauthgh: exchange")
		return
	}
	err = setUserAttribute(userId, "oauth_token_gh", tok.AccessToken)
	if err != nil {
		w.WriteHeader(500)
		LogPrintf("oauthgh: store token")
		return
	}
	fmt.Println(tok)

	http.Redirect(w, r, fullUrl, http.StatusFound)
}

func githubConvertFiles(filesRaw map[interface{}]interface{}) map[string]map[string]string {
	files := map[string]map[string]string{}
	for k0, v0 := range filesRaw {
		fileRaw := v0.(map[interface{}]interface{})
		file := map[string]string{}
		for k1, v1 := range fileRaw {
			file[k1.(string)] = string(v1.([]uint8))
		}
		files[k0.(string)] = file
	}
	return files

}

func GithubGistHandle(userId string, request []interface{}) *[]interface{} {
	action := string(request[0].([]uint8))
	if action == "gist_list" {
		dataJS, err := GithubGetGists(userId)
		if err != nil {
			return nil
		} else {
			return &[]interface{}{[]uint8("gist_list_result"), dataJS}
		}
	} else if action == "gist_get" {
		dataJS, err := GithubGetGist(userId, string(request[1].([]uint8)))
		if err != nil {
			return nil
		} else {
			return &[]interface{}{[]uint8("gist_get_result"), dataJS}
		}
	} else if action == "gist_create" {
		
		dataJS, err := GithubCreateGist(userId, request[1].(bool), string(request[2].([]uint8)), string(request[3].([]uint8)), githubConvertFiles(request[4].(map[interface{}]interface{})))
		if err != nil {
			return nil
		} else {
			return &[]interface{}{[]uint8("gist_create_result"), dataJS}
		}
	} else if action == "gist_modify" {
		dataJS, err := GithubModifyGist(userId, string(request[1].([]uint8)), string(request[2].([]uint8)), string(request[3].([]uint8)), githubConvertFiles(request[4].(map[interface{}]interface{})))
		if err != nil {
			return nil
		} else {
			return &[]interface{}{[]uint8("gist_create_result"), dataJS}
		}
	} else if action == "gist_fork" {
		dataJS, err := GithubForkGist(userId, string(request[1].([]uint8)))
		if err != nil {
			return nil
		} else {
			return &[]interface{}{[]uint8("gist_fork_result"), dataJS}
		}
	}
	return nil
}

func GithubGetGists(userId string) ([]byte, error) {
	values := url.Values{}
	accessToken, err := getUserAttribute(userId, "oauth_token_gh")
	if err != nil {
		return nil, err
	}
	values.Set("access_token", accessToken)
	r, err := http.Get("https://api.github.com/gists" + "?" + values.Encode())
	if err != nil {
		return nil, err
	}
	defer r.Body.Close()
	data, err := ioutil.ReadAll(r.Body)
	datas := []map[string]interface{}{}
	datasKeep := []map[string]interface{}{}
	err = json.Unmarshal(data, &datas)
	for _, v := range datas {
		if githubCheckDescription(v) {
			datasKeep = append(datasKeep, v)
		}
	}
	fmt.Println(datasKeep)
	return json.Marshal(datasKeep)
}

func githubCheckDescription(gist map[string]interface{}) bool {
	vs, ok := gist["description"].(string)
	return ok && strings.HasPrefix(vs, "[wearscript]")
}

func GithubGetGist(userId string, gistId string) ([]byte, error) {
	values := url.Values{}
	accessToken, err := getUserAttribute(userId, "oauth_token_gh")
	if err != nil {
		return nil, err
	}
	values.Set("access_token", accessToken)
	response, err := http.Get("https://api.github.com/gists/" + gistId + "?" + values.Encode())
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	if response.StatusCode != 200 {
		return nil, errors.New(fmt.Sprintf("Bad status[%d][%s]", response.StatusCode, body))
	}
	return body, nil
}

func GithubCheckGist(userId string, gistId string) bool {
	dataJS, err := GithubGetGist(userId, gistId)
	if err != nil {
		LogPrintf("github: check gist")
		return false
	}
	data := map[string]interface{}{}
	err = json.Unmarshal(dataJS, &data)
	return githubCheckDescription(data)
}

func GithubCreateGist(userId string, public bool, name string, description string, files map[string]map[string]string) ([]byte, error) {
	accessToken, err := getUserAttribute(userId, "oauth_token_gh")
	if err != nil {
		return nil, err
	}
	values := url.Values{}
	values.Set("access_token", accessToken)
	data := map[string]interface{}{}
	data["description"] = fmt.Sprintf("[wearscript][%s] %s", name, description)
	data["public"] = public
	data["files"] = files
	datajs, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("POST", fmt.Sprintf("https://api.github.com/gists?%s", values.Encode()), bytes.NewBuffer(datajs))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 201 {
		return nil, errors.New(fmt.Sprintf("Bad status[%d][%s]", response.StatusCode, body))
	}
	return body, nil
}

func GithubModifyGist(userId string, gistId string, name string, description string, files map[string]map[string]string) ([]byte, error) {
	if !GithubCheckGist(userId, gistId) {
		return nil, errors.New("GithubCheckGist failed")
	}
	accessToken, err := getUserAttribute(userId, "oauth_token_gh")
	if err != nil {
		return nil, err
	}
	values := url.Values{}
	values.Set("access_token", accessToken)
	data := map[string]interface{}{}
	data["description"] = fmt.Sprintf("[wearscript][%s] %s", name, description)
	data["files"] = files
	datajs, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("PATCH", fmt.Sprintf("https://api.github.com/gists/%s?%s", gistId, values.Encode()), bytes.NewBuffer(datajs))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, errors.New(fmt.Sprintf("Bad status[%d][%s]", response.StatusCode, body))
	}
	return body, nil
}

func GithubForkGist(userId string, gistId string) ([]byte, error) {
	if !GithubCheckGist(userId, gistId) {
		return nil, errors.New("GithubCheckGist failed")
	}
	accessToken, err := getUserAttribute(userId, "oauth_token_gh")
	if err != nil {
		return nil, err
	}
	values := url.Values{}
	values.Set("access_token", accessToken)
	data := map[string]interface{}{}
	datajs, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("POST", fmt.Sprintf("https://api.github.com/gists/%s/forks?%s", gistId, values.Encode()), bytes.NewBuffer(datajs))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(response.Body)
	defer response.Body.Close()
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 201 {
		return nil, errors.New(fmt.Sprintf("Bad status[%d][%s]", response.StatusCode, body))
	}
	return body, nil
}
