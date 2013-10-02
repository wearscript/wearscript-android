// +build raven

package main

import (
	"fmt"
	"github.com/kisielk/raven-go/raven"
	"log"
)

func LogPrintf(format string, v ...interface{}) {
	log.Printf(format, v)
	if ravenDSN == "" {
		return
	}
	client, err := raven.NewClient(ravenDSN)
	if err != nil {
		log.Printf("LogPrintf: could not connect: %v", ravenDSN)
		return
	}
	_, err = client.CaptureMessage(fmt.Sprintf(format, v))
	if err != nil {
		log.Printf("LogPrintf: failed logging with raven")
		return
	}
}
