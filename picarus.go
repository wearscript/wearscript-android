package main

import (
	picarus "github.com/bwhite/picarus/go"
)

func PicarusApiImageUpload(conn *picarus.Conn, image []byte) (row string, err error) {
	// TODO: Remove this and use the underlying method since we follow this with a patch anyways
	out, err := conn.PostTable("images", map[string]string{}, map[string][]byte{"data:image": image}, []picarus.Slice{})
	return out["row"], err
}

func PicarusApiModel(conn *picarus.Conn, row string, model string) (string, error) {
	v, err := conn.PostRow("images", row, map[string]string{"model": model, "action": "i/chain"})
	if err != nil {
		return "", err
	}
	return v[model], nil
}

func PicarusApiModelStore(conn *picarus.Conn, row string, model string) (string, error) {
	v, err := conn.PostRow("images", row, map[string]string{"model": model, "action": "io/chain"})
	if err != nil {
		return "", err
	}
	return v[model], nil
}

func PicarusApiRowThumb(conn *picarus.Conn, row string) (string, error) {
	v, err := conn.PostRow("images", row, map[string]string{"action": "io/thumbnail"})
	if err != nil {
		return "", err
	}
	return v["thum:image_150sq"], nil
}
