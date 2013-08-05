package main

import (
	picarus "github.com/bwhite/picarus/go"
	picarusto "github.com/bwhite/picarus_takeout/go"
	"fmt"
	"bytes"
	"github.com/ugorji/go/codec"
)


func ImagePoints(image string) (string, error) {
	model := "kYKia3eDrXBhdHRlcm5fc2NhbGXLP/AAAAAAAACmdGhyZXNoHqdvY3RhdmVzAqRuYW1lu3BpY2FydXMuQlJJU0tJbWFnZUZlYXR1cmUyZA=="
	out := picarusto.ModelChainProcessBinary(picarus.B64Dec(model), image)
	// TODO: Error check
	return out, nil
}

func DecodeHomography(data string) ([]float64, error) {
	var dec []interface{}
	dec = append(dec, make([]float64, 9))
	dec = append(dec, make([]int, 2))
	var mh2 codec.MsgpackHandle
	err := codec.NewDecoderBytes([]byte(data), &mh2).Decode(&dec)
	if err != nil {
		fmt.Println("Couldn't decode output")
		return nil, err
	}
	return dec[0].([]float64), nil
}

func ImagePointsMatch(points0 string, points1 string) ([]float64, error) {
	model := "kYKia3eDqG1heF9kaXN0eKttaW5faW5saWVycwqtcmVwcm9qX3RocmVzaMs/hHrhR64Ue6RuYW1l2gAkcGljYXJ1cy5JbWFnZUhvbW9ncmFwaHlSYW5zYWNIYW1taW5n"
	var mh codec.MsgpackHandle
	var w bytes.Buffer
	err := codec.NewEncoder(&w, &mh).Encode([]string{points0, points1})
	if err != nil {
		fmt.Println("Couldn't encode msgpack")
		return nil, err
	}
	input := w.String()
	return DecodeHomography(picarusto.ModelChainProcessBinary(picarus.B64Dec(model), input))
}

func WarpImage(image string, h []float64, height int, width int) (string, error) {
	models := []map[string]interface{}{}
	model := map[string]interface{}{}
	model["h"] = h
	model["height"] = height
	model["width"] = width
	model["compression"] = "jpg"
	models = append(models, model)
	var mh codec.MsgpackHandle
	var w bytes.Buffer
	err := codec.NewEncoder(&w, &mh).Encode(models)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	modelBin := w.String()
	return picarusto.ModelChainProcessBinary(modelBin, image), nil
}

func ImageMatch(fn0 string, fn1 string) ([]float64, error) {
	image0, err := ReadFile(fn0)
	if err != nil {
		return nil, err
	}
	image1, err := ReadFile(fn1)
	if err != nil {
		return nil, err
	}
	pts0, err := ImagePoints(image0)
	if err != nil {
		return nil, err
	}
	pts1, err := ImagePoints(image1)
	if err != nil {
		return nil, err
	}
	h, err := ImagePointsMatch(pts0, pts1)
	fmt.Println(h)
	return h, err
}