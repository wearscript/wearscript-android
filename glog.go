package main

import (
	"fmt"
	"net/http"
)

func SensorsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got sensor")
}

func ImagesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got image")
	b := make([]byte, 0, 1048576)
	f, _, err := r.FormFile("image")
	if err != nil {
		fmt.Println("Couldn't get param")
		return
	}
	n, err := f.Read(b)
	if err != nil {
		fmt.Println("Couldn't read")
		return
	}
	fmt.Println(n)
	fmt.Println(b[0:n])
}
