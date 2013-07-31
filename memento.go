package main
import (
	picarus "github.com/bwhite/picarus/go"
	"code.google.com/p/google-api-go-client/mirror/v1"
	"code.google.com/p/goauth2/oauth"
	"net/http"
	"fmt"
	"encoding/json"
	"strconv"
	"html/template"
	"time"
	"io/ioutil"
	)


func notifyMemento(conn *picarus.Conn, svc *mirror.Service, trans *oauth.Transport, t *mirror.TimelineItem, userId string) {
	imageData, err := getImageAttachment(conn, svc, trans, t)
	if err != nil {
		fmt.Println("Couldn't get image attachment")
		return
	}

	locationSer, err := getUserListFront(userId, "locations")
	if err != nil {
		return
	}
	loc := mirror.Location{}
	err = json.Unmarshal([]byte(locationSer), &loc)
	if err != nil {
		return
	}
	curTime := strconv.FormatInt(time.Now().Unix(), 10)
	data := map[string]string{"meta:note": t.Text, "meta:openglass_user": userId, "meta:latitude": strconv.FormatFloat(loc.Latitude, 'f', 16, 64), "meta:longitude": strconv.FormatFloat(loc.Latitude, 'f', 16, 64), "meta:time": curTime}

	rowSuffix, err := randString()
	if err != nil {
		fmt.Println("Couldn't generate random string")
		return
	}
	files := map[string][]byte{}
	files["data:image"] = imageData
	imageRow := "bwhitememento:" + userId + ":" + rowSuffix
	_, err = conn.PatchRow("images", imageRow, data, files)
	if err != nil {
		fmt.Println("Couldn't patch row")
		return
	}
	_, err = PicarusApiModelStore(conn, imageRow, picarus.B64Dec(locationFeatureModel))
	if err != nil {
		fmt.Println("Couldn't compute feature")
		return
	}
	_, err = PicarusApiModelStore(conn, imageRow, picarus.B64Dec(glassImageModel))
	if err != nil {
		fmt.Println("Couldn't compute glass thumb")
		return
	}
	_, err = PicarusApiRowThumb(conn, imageRow)
	if err != nil {
		fmt.Println("Couldn't compute thumbnail")
		return
	}


	// TODO: Create image features

	//"bwhitememento;"

	// Method 1: Download all points and call the matcher on them
	// Method 2: Have a joint index with all points, first search that to vote for images to verify (need to have method for incrementally updating search indexes)
}

func reprocessMementoImages(conn *picarus.Conn) error {
	data, err := conn.PostSlice("images", "bwhitememento:", "bwhitememento;", map[string]string{"action": "io/chain", "model": picarus.B64Dec(glassImageModel)})
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = conn.WatchJob(data["row"])
	if err != nil {
		fmt.Println(err)
		return err
	}

	data, err = conn.PostSlice("images", "bwhitememento:", "bwhitememento;", map[string]string{"action": "io/chain", "model": picarus.B64Dec(locationFeatureModel)})
	if err != nil {
		fmt.Println(err)
		return err
	}
	_, err = conn.WatchJob(data["row"])
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}


func matchMementoImage(conn *picarus.Conn, queryRow string, userId string) (map[string]string, map[string]string, error) {
	queryFeatures, err := PicarusApiModel(conn, queryRow, picarus.B64Dec(locationFeatureModel))
	if err != nil {
		fmt.Println("Couldn't compute feature")
		return nil, nil, err
	}
	return matchMementoFeatures(conn, queryFeatures, userId)
}

func getMementoDB(conn *picarus.Conn, userId string) ([]string, []map[string]string, error) {
	rows := []string{}
	columnss := []map[string]string{}

	ss := conn.Scanner("images", "bwhitememento:" + userId + ":", "bwhitememento:" + userId + ";", []string{"meta:", picarus.B64Dec(locationFeatureModel)}, map[string]string{})
	for {
		row, columns, err := ss.Next()
		if err != nil {
			fmt.Println(err)
			fmt.Println("Got error in scanner next")
			return nil, nil, err
		}
		if ss.Done {
			break
		}
		if columns["meta:note"] == "" {
			continue
		}
		dbFeatures := columns[picarus.B64Dec(locationFeatureModel)]
		if dbFeatures == "" {
			continue
		}
		rows = append(rows, row)
		columnss = append(columnss, columns)
	}
	return rows, columnss, nil
}


func matchMementoFeatures(conn *picarus.Conn, queryFeatures string, userId string) (map[string]string, map[string]string, error) {
	// TODO: Refactor to use getMementoDB to avoid reuse, features fit in memory
	rowsMatched := map[string]string{}
	rowsUnmatched := map[string]string{}
	ss := conn.Scanner("images", "bwhitememento:" + userId + ":", "bwhitememento:" + userId + ";", []string{"meta:", picarus.B64Dec(locationFeatureModel)}, map[string]string{})
	for {
		row, columns, err := ss.Next()
		if err != nil {
			fmt.Println(err)
			fmt.Println("Got error in scanner next")
			return nil, nil, err
		}
		if ss.Done {
			break
		}
		if columns["meta:note"] == "" {
			continue
		}
		dbFeatures := columns[picarus.B64Dec(locationFeatureModel)]
		if dbFeatures == "" {
			continue
		}
		fmt.Println("Verifying match to db image")
		_, err = ImagePointsMatch(queryFeatures, dbFeatures)
		if err != nil {
			rowsUnmatched[row] = columns["meta:note"]
		} else {
			rowsMatched[row] = columns["meta:note"]
		}
	}
	return rowsMatched, rowsUnmatched, nil
}

type SearchTemplateData struct {
	Query *ThumbnailTemplate
	Thumbnails []*ThumbnailTemplate
}


func getImageThumb(conn *picarus.Conn, row string) (string, error) {
	m, err := conn.GetRow("images", row, []string{"thum:image_150sq"})
	if err != nil {
		fmt.Println("Getting thumb failed")
		return "", err
	}
	return m["thum:image_150sq"], nil
}

func MementoSearchServer(w http.ResponseWriter, req *http.Request) {
    conn := picarus.Conn{Email: picarusEmail, ApiKey: picarusApiKey, Server: "https://api.picar.us"}
	userId, err := userID(req)
	if err != nil {
		http.Redirect(w, req, "auth", http.StatusFound)
		return
	}
	content, err := ioutil.ReadFile("static/search.html")
	if err != nil {
		return
	}

	queryRow, err := getUserListFront(userId, "images")
	if err != nil {
		return
	}
	//YndoaXRlbWVtZW50bzq3szcWII3vQCHG
	//dXNlcnVwbG9hZGkwSm9XendKUXVFblNlbGZKa2Jld0RSZlhGYzowNzczMDM3ODU10TkY2z34T8Gz5zBnIHky4A== // Couch + table
	//dXNlcnVwbG9hZGkwSm9XendKUXVFblNlbGZKa2Jld0RSZlhGYzowNzczMDM0NDAxuW998RdtQouInS9UXAGZzg==
	//queryRow = picarus.B64Dec("dXNlcnVwbG9hZGkwSm9XendKUXVFblNlbGZKa2Jld0RSZlhGYzowNzczMDMzOTczalE6vU9USOaLkkUOwF1rRw==")

	t := template.New("Map template")
	t, err = t.Parse(string(content))
	if err != nil {
		fmt.Println(err)
		return
	}
	rowsMatched, rowsUnmatched, err := matchMementoFeatures(&conn, queryRow, userId)
	if err != nil {
		fmt.Println("Error matching memento rows")
		return
	}

	thumbQuery, err := getImageThumb(&conn, queryRow)
	if err != nil {
		fmt.Println("Getting thumb failed: " + queryRow)
		return
	}

	queryImage := ThumbnailTemplate{Data: picarus.B64Enc(thumbQuery), Title: picarus.B64Enc(queryRow)}

	thumbnails := []*ThumbnailTemplate{}
	for row, note := range rowsMatched {
		thumb, err := getImageThumb(&conn, row)
		if err != nil {
			fmt.Println("Getting thumb failed: " + row)
			continue
		}
		thumbnails = append(thumbnails, &ThumbnailTemplate{Data: picarus.B64Enc(thumb), Title: picarus.B64Enc(row) + " | " + note, Class: "image-matched"})
	}

	for row, note := range rowsUnmatched {
		thumb, err := getImageThumb(&conn, row)
		if err != nil {
			fmt.Println("Getting thumb failed: " + row)
			continue
		}
		thumbnails = append(thumbnails, &ThumbnailTemplate{Data: picarus.B64Enc(thumb), Title: picarus.B64Enc(row) + " | " + note, Class: "image-unmatched"})
	}

	err = t.Execute(w, SearchTemplateData{Thumbnails: thumbnails, Query: &queryImage})
}