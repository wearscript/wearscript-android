package main

import (
	"encoding/json"
	"net/http"
)


func FlagsHandler(w http.ResponseWriter, r *http.Request) {
	userId, err := userID(r)
	if err != nil {
		return
	}
	if r.Method == "GET" {
		flags, err := getUserFlags(userId, "uflags")
		if err != nil {
			return // TODO
		}
		if err := json.NewEncoder(w).Encode(flags); err != nil {
			w.WriteHeader(500)
			return // TODO
		}		
	} else if r.Method == "POST" {
		flags := []string{}
		// TODO: Restrict # of flags that can be set and limit their size
		if err := json.NewDecoder(r.Body).Decode(&flags); err != nil {
			w.WriteHeader(500)
			return // TODO
		}
		for _, v:= range flags {
			setUserFlag(userId, "uflags", v)
		}
	} else if r.Method == "DELETE" {
		flags := []string{}
		if err := json.NewDecoder(r.Body).Decode(&flags); err != nil {
			w.WriteHeader(500)
			return // TODO
		}
		for _, v:= range flags {
			unsetUserFlag(userId, "uflags", v)
		}
	} else {
		w.WriteHeader(500)
		return // TODO
	}
}