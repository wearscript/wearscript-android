package main

import (
	"crypto/rand"
	"crypto/sha1"
	"fmt"
	picarus "github.com/bwhite/picarus/go"
	"io"
	"net/http"
)

func randString() (string, error) {
	nBytes := 12
	b := make([]byte, nBytes)
	n, err := io.ReadFull(rand.Reader, b)
	if n != len(b) || err != nil {
		fmt.Println("error:", err)
		return "", err
	}
	return string(b), nil
}

func secretHash(secret string) string {
	h := sha1.New()
	io.WriteString(h, secret)
	return picarus.UB64Enc(string(h.Sum(nil)))
}

func SecretKeySetupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(400)
		return
	}
	userId, err := userID(r)
	if err != nil {
		w.WriteHeader(401)
		return
	}
	flags, err := getUserFlags(userId, "flags")
	if err != nil {
		w.WriteHeader(500)
		return
	}
	if !hasFlag(flags, "user") || (!hasFlag(flags, "user_notify") && !hasFlag(flags, "user_ws")) {
		w.WriteHeader(401)
		return
	}
	secretType := r.URL.Query().Get(":type")
	if secretType != "raven" && secretType != "pupil" && secretType != "ws" && secretType != "notify" {
		w.WriteHeader(400)
		return
	}
	secret, err := randString()
	if err != nil {
		w.WriteHeader(500)
		return
	}
	// Remove previous secret
	prevSecretHash, err := getUserAttribute(userId, "secret_hash_"+secretType)
	if err == nil {
		deleteSecretUser(secretType, prevSecretHash)
	}
	secret = picarus.UB64Enc(secret)
	hash := secretHash(secret)
	setSecretUser(secretType, hash, userId)
	setUserAttribute(userId, "secret_hash_"+secretType, hash)
	io.WriteString(w, secret)
}
