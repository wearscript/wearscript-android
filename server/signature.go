package main

import (
	"bytes"
	"crypto/dsa"
	"crypto/rand"
	"encoding/base64"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/big"
	"net/http"
)

func SignatureGenerateServerKey() *dsa.PrivateKey {
	priv := dsa.PrivateKey{}
	dsa.GenerateParameters(&priv.Parameters, rand.Reader, dsa.L3072N256)
	dsa.GenerateKey(&priv, rand.Reader)
	return &priv
}

func SignatureSign(hash []byte, priv *dsa.PrivateKey) (r, s []byte, err error) {
	ri, si, err := dsa.Sign(rand.Reader, priv, hash)
	if err != nil {
		return nil, nil, err
	}
	return []byte(base64.StdEncoding.EncodeToString(ri.Bytes())), []byte(base64.StdEncoding.EncodeToString(si.Bytes())), nil
}

func SignatureVerify(hash []byte, priv *dsa.PrivateKey, r []byte, s []byte) bool {
	ri := big.Int{}
	si := big.Int{}
	rb, err := base64.StdEncoding.DecodeString(string(r))
	if err != nil {
		return false
	}
	sb, err := base64.StdEncoding.DecodeString(string(s))
	if err != nil {
		return false
	}
	return dsa.Verify(&priv.PublicKey, hash, ri.SetBytes(rb), si.SetBytes(sb))
}

func hashScript(script []byte) []byte {
	h := sha256.New()
	h.Write(script)
	return h.Sum(nil)
}

type ScriptSignature struct {
	R string `json:"r"`
	S string `json:"s"`
	V int    `json:"v"`
	H string `json:"h"`
}

func SignatureCreateKey() error {
	has, err := hasUserAttribute("", "private_key")
	if err != nil {
		return err
	}
	if has {
		return nil
	}
	fmt.Println("Generating DSA Script Key (takes ~30-60 sec)")
	priv := SignatureGenerateServerKey()
	privJS, err := json.Marshal(priv)
	if err != nil {
		return err
	}
	fmt.Println("Done generating key, server running...")
	return setUserAttribute("", "private_key", string(privJS))
}

func SignatureSignScript(userId string, script []byte) ([]byte, error) {
	// Make script with headers
	userInfoJS, err := getUserAttribute(userId, "user_info")
	if err != nil {
		return nil, err
	}
	userInfo := map[string]string{}
	err = json.Unmarshal([]byte(userInfoJS), &userInfo)
	if err != nil {
		return nil, err
	}
	userProfileLink := userInfo["link"]
	if userProfileLink == "" {
		return nil, errors.New("Can't get user link")
	}

	parts := [][]byte{}
	parts = append(parts, []byte("<!--"))
	parts = append(parts, []byte(userProfileLink+"-->\n"))
	parts = append(parts, script)
	script = bytes.Join(parts, []byte(""))

	// Sign script w/ header
	// TODO: Cache privateKey
	var priv dsa.PrivateKey
	privJS, err := getUserAttribute("", "private_key")
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal([]byte(privJS), &priv)
	if err != nil {
		return nil, err
	}
	r, s, err := SignatureSign(hashScript(script), &priv)
	if err != nil {
		return nil, err
	}
	ss := ScriptSignature{R: string(r), S: string(s), V: 0, H: fullUrl}
	ssJS, err := json.Marshal(ss)
	if err != nil {
		return nil, err
	}
	parts = [][]byte{}
	parts = append(parts, []byte("<!--"))
	parts = append(parts, ssJS)
	parts = append(parts, []byte("-->\n"))
	parts = append(parts, script)
	return bytes.Join(parts, []byte("")), nil
}

func SignatureVerifyHandler(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	// Get first line from body
	splits := bytes.SplitAfterN(body, []byte("\n"), 2)
	if len(splits) != 2 {
		w.WriteHeader(500)
		return
	}
	// Parse data in the form of: <!--data-->\n
	splits[0] = splits[0][4 : len(splits[0])-4]
	ss := ScriptSignature{}
	err := json.Unmarshal(splits[0], &ss)
	if err != nil {
		w.WriteHeader(500)
		return
	}
	if ss.V != 0 {
		w.WriteHeader(500)
		return
	}
	privJS, err := getUserAttribute("", "private_key")
	var priv dsa.PrivateKey
	if err != nil {
		w.WriteHeader(500)
		return
	}
	err = json.Unmarshal([]byte(privJS), &priv)
	if err != nil {
		w.WriteHeader(500)
		return
	}
	if !SignatureVerify(hashScript(splits[1]), &priv, []byte(ss.R), []byte(ss.S)) {
		w.WriteHeader(500)
		return
	}
}