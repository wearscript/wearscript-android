package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"io/ioutil"
	"net/http"
)

func PupilServer(w http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	fmt.Println("Got /pupil/")

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		LogPrintf("/pupil/: couldn't read body")
		w.WriteHeader(500)
		return
	}
	var r WSSensor
	err = json.Unmarshal(body, &r)
	if err != nil {
		LogPrintf("/pupil/: couldn't unjson body")
		w.WriteHeader(400)
		return
	}

	key := req.URL.Query().Get(":key")

	userId, err := getSecretUser("pupil", secretHash(key))
	if err != nil {
		w.WriteHeader(401)
		LogPrintf("/pupil/: bad key")
		return
	}
	if !hasFlagSingle(userId, "flags", "user_pupil") {
		w.WriteHeader(401)
		LogPrintf("/pupil/: bad flag")
		return
	}
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		LogPrintf("/pupil/: couldn't get flags")
		w.WriteHeader(500)
		return
	}
	if !hasFlag(flags, "pupil") {
		LogPrintf("/pupil/: user not flagged")
		w.WriteHeader(400)
		return
	}

	if hasFlag(flags, "ws_web") {
		data := &WSData{Action: "data", Ts0: r.Timestamp, Sensors: []WSSensor{r}, GlassID: "pupil"}
		dataJS, err := json.Marshal(data)
		if err != nil {
			LogPrintf("/pupil/: couldn't create data packet")
			w.WriteHeader(500)
			return
		}
		fmt.Println(string(dataJS))
		userPublish(userId, "ws_server_to_web", string(dataJS))
	}

	pupilStateStr, err := getUserAttribute(userId, "control_state")
	if err == nil {
		pupilState, err := strconv.Atoi(pupilStateStr)
		if err != nil || pupilState % 2 == 1 || pupilState > 8 {
			return
		}
		
		sampleJS, err := json.Marshal([]float64{float64(pupilState) / 2., r.Values[0], r.Values[1]})
		if err != nil {
			return
		}
		pushUserListTrim(userId, "control_samples", string(sampleJS), 1000)
	}
}

func ControlServer(w http.ResponseWriter, req *http.Request) {
	userId, err := userID(req)
	if err != nil || userId == "" {
		LogPrintf("control: userid")
		w.WriteHeader(401)
		return
	}
	action := req.URL.Query().Get(":action")
	pupilState := 1
	if action == "calibrate" {
		setUserAttribute(userId, "control_state", "1")
		deleteUserKey(userId, "control_samples")
	} else if action == "calibrate_next" {
		pupilState, err = incrUserAttribute(userId, "control_state", 1)
		if err != nil {
			LogPrintf("/control/: couldn't get pupil state")
			w.WriteHeader(500)
			return
		}
		if pupilState == 9 {
			fmt.Println("Calibrating")
			controlSamples, err := getUserList(userId, "control_samples")
			if err != nil {
				return
			}
			fmt.Println(controlSamples)
		}
	} else {
		LogPrintf("/control/: bad action")
		w.WriteHeader(400)
		return
	}
	if err := json.NewEncoder(w).Encode(map[string]string{"state": strconv.Itoa(pupilState)}); err != nil {
		w.WriteHeader(500)
		return
	}
}
