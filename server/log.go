// +build !raven

package main

import (
	"log"
)

func LogPrintf(format string, v ...interface{}) {
	log.Printf(format, v)
}
