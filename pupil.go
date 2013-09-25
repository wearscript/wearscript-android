package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func PupilUpdate(userId string, r *WSSensor) {
	if !hasFlagSingle(userId, "flags", "user_pupil") {
		LogPrintf("/pupil/: bad flag")
		return
	}
	flags, err := getUserFlags(userId, "uflags")
	if err != nil {
		LogPrintf("/pupil/: couldn't get flags")
		return
	}
	if !hasFlag(flags, "pupil") {
		LogPrintf("/pupil/: user not flagged")
		return
	}
	if hasFlag(flags, "pupil_draw") {
		yx := []float64{0., 0.}
		color := []int{255, 0, 0}
		yxValid := false

		meansJS, err := getUserAttribute(userId, "pupil_means")
		if err == nil {
			minDist := 1000000.
				minInd := 1000000
			means := [][]float64{}
			err = json.Unmarshal([]byte(meansJS), &means)
			if err != nil {
				LogPrintf("/pupil/: couldn't unjson means")
			} else {
				for k, v := range means {
					fmt.Println(v)
					if v == nil || len(v) == 0 {
						continue
					}
					dist := (v[0]-r.Values[0])*(v[0]-r.Values[0]) + (v[1]-r.Values[1])*(v[1]-r.Values[1])
					if dist < minDist {
						minDist = dist
						minInd = k
					}
				}
			}
			yxInt := PupilPointToYX(minInd)
			yx[0] = float64(yxInt[0])
			yx[1] = float64(yxInt[1])
			yxValid = true
		}

		if yxValid {
			yxJS, err := json.Marshal(yx)
			if err != nil {
				return
			}
			setUserAttribute(userId, "pupil_yx", string(yxJS))
			if !hasFlag(flags, "pong") {
				err := WSSendDevice(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{0, 0, 0}}, []interface{}{"circle", []int{int(yx[1]), int(yx[0])}, 50, color}}})
				if err != nil {
					LogPrintf("/pupil/: couldn't send data packet to glass")
				}
			}
		}
	}

	// TODO: Move this to the websocket code
	if hasFlag(flags, "ws_web") {
		err := WSSendWeb(userId, &WSData{Action: "data", Ts0: r.Timestamp, Sensors: []WSSensor{*r}, GlassID: "pupil"})
		if err != nil {
			LogPrintf("/pupil/: couldn't send data packet to web")
		}
	}

	pupilStateStr, err := getUserAttribute(userId, "control_state")
	if err == nil {
		pupilState, err := strconv.Atoi(pupilStateStr)
		if err != nil || pupilState%2 == 1 {
			return
		}

		sampleJS, err := json.Marshal([]float64{float64(pupilState)/2. - 1, r.Values[0], r.Values[1]})
		if err != nil {
			return
		}
		pushUserListTrim(userId, "control_samples", string(sampleJS), 1000)
	}
}

func PupilStep(steps int, sz int) int {
	// 1: middle: 0
	// 2: sides: 0, w
	// 3: 0, w/2, w
	// 4: 0, w/3, 2w/3, w
	// 5: 0, w/4, w/2, 3w/4, w
	if steps <= 1 {
		return 0
	} else {
		return sz / (steps - 1)
	}
}

func PupilPointToYX(state int) []int {
	return []int{(state / pupilCalibX) * PupilStep(pupilCalibY, 360), (state % pupilCalibX) * PupilStep(pupilCalibX, 640)}
}

func PupilMatches(samples [][]float64) []float64 {
	matches := []float64{}
	for _, v := range samples {
		// num, y, x
		state := int(v[0])
		matches = append(matches, v[1])
		matches = append(matches, v[2])
		yx := PupilPointToYX(state)
		matches = append(matches, float64(yx[0]))
		matches = append(matches, float64(yx[1]))
	}
	return matches
}

func PupilCalibrateMeans(userId string) bool {
	means, counts := PupilComputeMeans(userId)
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

func PupilComputeMeans(userId string) ([][]float64, map[int]float64) {
	controlSamples, err := getUserList(userId, "control_samples")
	if err != nil {
		return nil, nil
	}
	samples := [][]float64{}
	for _, v := range controlSamples {
		var sample []float64
		err := json.Unmarshal([]byte(v), &sample)
		if err != nil {
			LogPrintf("pupil: unmarshal")
			return nil, nil
		}
		samples = append(samples, sample)
	}
	means := make([][]float64, pupilCalibX * pupilCalibY)
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
	return means, counts
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
		for i := 0; i < pupilCalibY; i++ {
			for j := 0; j < pupilCalibX; j++ {
				yx := PupilPointToYX(i * pupilCalibX + j)
				draw = append(draw, []interface{}{"circle", []int{yx[1], yx[0]}, 25, []int{0, 255, 0}})
			}
		}
		WSSendDevice(userId, &WSData{Action: "draw", Draw: draw})
		time.Sleep(time.Second * 10)
		for i := 0; i < pupilCalibY; i++ {
			for j := 0; j < pupilCalibX; j++ {
				yx := PupilPointToYX(i * pupilCalibX + j)
				draw := [][]interface{}{[]interface{}{"clear", []int{0, 0, 0}}, []interface{}{"circle", []int{yx[1], yx[0]}, 25, []int{0, 0, 255}}}
				WSSendDevice(userId, &WSData{Action: "draw", Draw: draw})
				time.Sleep(time.Second * 3)
				pupilStateCheckStr, _ := getUserAttribute(userId, "control_state")
				pupilStateCheck, err := strconv.Atoi(pupilStateCheckStr)
				if err != nil || pupilStateCheck != pupilState {
					// Another calibration process was started, lets kill this one
					return
				}
				pupilState, err = incrUserAttribute(userId, "control_state", 1)
				draw = [][]interface{}{[]interface{}{"clear", []int{0, 0, 0}}, []interface{}{"circle", []int{yx[1], yx[0]}, 25, []int{0, 255, 0}}}
				WSSendDevice(userId, &WSData{Action: "draw", Draw: draw})
				for {
					_, counts := PupilComputeMeans(userId)
					if counts[pupilState / 2 - 1] >= 10  {
						break
					}
					fmt.Println(counts[pupilState / 2 - 1])
					time.Sleep(time.Millisecond * 100)
				}
				pupilStateCheckStr, _ = getUserAttribute(userId, "control_state")
				pupilStateCheck, err = strconv.Atoi(pupilStateCheckStr)
				if err != nil || pupilStateCheck != pupilState {
					// Another calibration process was started, lets kill this one
					return
				}
				pupilState, err = incrUserAttribute(userId, "control_state", 1)
			}
		}
		WSSendDevice(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{255, 0, 0}}}})
		
		if PupilCalibrateMeans(userId) {
			WSSendDevice(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{0, 255, 0}}}})
		} else {
			WSSendDevice(userId, &WSData{Action: "draw", Draw: [][]interface{}{[]interface{}{"clear", []int{0, 0, 255}}}})
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
