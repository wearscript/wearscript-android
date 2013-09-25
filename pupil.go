package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"io/ioutil"
	"time"
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
	if hasFlag(flags, "pupil_draw") {
		yx := []float64{0, 0}
		color := []int{255, 0, 0}
		yxValid := false
		if false {
			meansJS, err := getUserAttribute(userId, "pupil_means")
			if err == nil {
				minDist := 1000000.
					minInd := 1000000
				var means [9][]float64
				err = json.Unmarshal([]byte(meansJS), &means)
				if err != nil {
					LogPrintf("/pupil/: couldn't unjson means")
				} else {
					for k, v := range means {
						fmt.Println(v)
						if v == nil || len(v) == 0 {
							continue
						}
						dist := (v[0] - r.Values[0]) * (v[0] - r.Values[0]) + (v[1] - r.Values[1]) * (v[1] - r.Values[1])
						if dist < minDist {
							minDist = dist
							minInd = k
						}
					}
				}
				yx = PupilPointToYX(minInd)
				yxValid = true
			}
		}
		if true {
			hpupilJS, err := getUserAttribute(userId, "pupil_homography")
			if err == nil {
				var hpupil []float64
				err = json.Unmarshal([]byte(hpupilJS), &hpupil)
				if err != nil {
					LogPrintf("/pupil/: couldn't unjson homography")
				} else {
					fmt.Println(r)
					pt := HWarp(hpupil, []float64{r.Values[0], r.Values[1], 1.})
					fmt.Println(pt)
					if pt[1] < 0 {
						pt[1] = 0
						color[1] = 255
					}
					if pt[1] > 640 {
						pt[1] = 640
						color[1] = 255
					}
					if pt[0] < 0 {
						pt[0] = 0
						color[1] = 255
					}
					if pt[0] > 360 {
						pt[0] = 360
						color[2] = 255
					}
					yx[0] = pt[0]
					yx[1] = pt[1]
					yxValid = true
				}
			}
		}
		if yxValid {
			yxJS, err := json.Marshal(yx)
			if err != nil {
				return
			}
			setUserAttribute(userId, "pupil_yx", string(yxJS))
			if !hasFlag(flags, "pong") {
				err := WSSendGlass(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{0, 0, 0}}, []interface{}{"circle", []int{int(yx[1]), int(yx[0])}, 50, color}}})
				if err != nil {
					LogPrintf("/pupil/: couldn't send data packet to glass")
					w.WriteHeader(500)
				}
			}
		}
	}

	if hasFlag(flags, "ws_web") {
		err := WSSendWeb(userId, &WSData{Action: "data", Ts0: r.Timestamp, Sensors: []WSSensor{r}, GlassID: "pupil"})
		if err != nil {
			LogPrintf("/pupil/: couldn't send data packet to web")
			w.WriteHeader(500)
		}
	}

	pupilStateStr, err := getUserAttribute(userId, "control_state")
	if err == nil {
		pupilState, err := strconv.Atoi(pupilStateStr)
		if err != nil || pupilState % 2 == 1 {
			return
		}
		
		sampleJS, err := json.Marshal([]float64{float64(pupilState) / 2. - 1, r.Values[0], r.Values[1]})
		if err != nil {
			return
		}
		pushUserListTrim(userId, "control_samples", string(sampleJS), 1000)
	}
}

func PupilPointToYX(state int) []float64 {
	return []float64{float64((state / 3) * 180.), float64((state % 3) * 320.)}
}

func PupilMatches(samples [][]float64) []float64 {
	matches := []float64{}
	for _, v := range samples {
		// num, y, x
		state := int(v[0])
		matches = append(matches, v[1])
		matches = append(matches, v[2])
		yx := PupilPointToYX(state)
		matches = append(matches, yx[0])
		matches = append(matches, yx[1])
	}
	return matches
}

func PupilCalibrate(userId string) bool {
	controlSamples, err := getUserList(userId, "control_samples")
	if err != nil {
		return false
	}
	samples := [][]float64{}
	for _, v := range controlSamples {
		var sample []float64
		err := json.Unmarshal([]byte(v), &sample)
		if err != nil {
			LogPrintf("pupil: unmarshal")
			return false
		}
		samples = append(samples, sample)
	}
	if len(samples) < 4 {
		return false
	}
	matches := PupilMatches(samples)
	fmt.Println(matches)
	hpupil, err := HomographyRansac(matches)
	if err == nil {
		hpupilJS, err := json.Marshal(hpupil)
		if err != nil {
			LogPrintf("/pupil/: calibrate json pupil")
			return false
		}
		fmt.Println(hpupilJS)
		setUserAttribute(userId, "pupil_homography", string(hpupilJS))
		return true
	}
	return false
}

func PupilCalibrateMeans(userId string) bool {
	controlSamples, err := getUserList(userId, "control_samples")
	if err != nil {
		return false
	}
	samples := [][]float64{}
	for _, v := range controlSamples {
		var sample []float64
		err := json.Unmarshal([]byte(v), &sample)
		if err != nil {
			LogPrintf("pupil: unmarshal")
			return false
		}
		samples = append(samples, sample)
	}
	if len(samples) < 4 {
		return false
	}
	means := [9][]float64{}
	counts := map[int]float64{}
	for _, v := range samples {
		// num, y, x
		state := int(v[0])
		if means[state] == nil {
			means[state] = []float64{0., 0.}
			counts[state] = 0.
		}
		means[state][0] += v[1]
		means[state][1] += v[2]
		counts[state]++
	}
	for k, v := range counts {
		means[k][0] /= v
		means[k][1] /= v
	}
	fmt.Println(samples)
	fmt.Println(means)
	fmt.Println(counts)
	meansJS, err := json.Marshal(means)
	if err != nil {
		LogPrintf("/pupil/: calibrate json pupil")
		return false
	}
	fmt.Println(meansJS)
	setUserAttribute(userId, "pupil_means", string(meansJS))
	return true
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
		deleteUserKey(userId, "control_samples")
		deleteUserAttribute(userId, "pupil_homography")
		deleteUserAttribute(userId, "pupil_means")
		setUserAttribute(userId, "control_state", "1")
		draw := [][]interface{}{[]interface{}{"clear", []int{255, 0, 255}}}
		for i := 0; i < 3; i++ {
			for j := 0; j < 3; j++ {
				draw = append(draw, []interface{}{"circle", []int{j * 320, i * 180}, 25, []int{0, 255, 0}})
			}
		}
		WSSendGlass(userId, &WSData{Action: "draw", Draw: draw})
		time.Sleep(time.Second * 10)
		for i := 0; i < 3; i++ {
			for j := 0; j < 3; j++ {
				draw := [][]interface{}{[]interface{}{"clear", []int{0, 0, 0}}, []interface{}{"circle", []int{j * 320, i * 180}, 25, []int{0, 0, 255}}}
				WSSendGlass(userId, &WSData{Action: "draw", Draw: draw})
				time.Sleep(time.Second * 3)
				pupilStateCheckStr, _ := getUserAttribute(userId, "control_state")
				pupilStateCheck, err := strconv.Atoi(pupilStateCheckStr)
				if err != nil || pupilStateCheck != pupilState {
					// Another calibration process was started, lets kill this one
					return
				}
				pupilState, err = incrUserAttribute(userId, "control_state", 1)
				draw = [][]interface{}{[]interface{}{"clear", []int{0, 0, 0}}, []interface{}{"circle", []int{j * 320, i * 180}, 25, []int{0, 255, 0}}}
				WSSendGlass(userId, &WSData{Action: "draw", Draw: draw})
				time.Sleep(time.Second * 6)
				pupilStateCheckStr, _ = getUserAttribute(userId, "control_state")
				pupilStateCheck, err = strconv.Atoi(pupilStateCheckStr)
				if err != nil || pupilStateCheck != pupilState {
					// Another calibration process was started, lets kill this one
					return
				}
				pupilState, err = incrUserAttribute(userId, "control_state", 1)
			}
		}
		WSSendGlass(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{255, 0, 0}}}})
		PupilCalibrateMeans(userId)
		if PupilCalibrate(userId) {
			WSSendGlass(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{0, 255, 0}}}})
		} else {
			WSSendGlass(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{0, 0, 255}}}})
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
