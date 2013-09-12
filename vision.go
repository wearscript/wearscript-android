package main

import (
	"bytes"
	"fmt"
	picarus "github.com/bwhite/picarus/go"
	picarusto "github.com/bwhite/picarus_takeout/go"
	"github.com/ugorji/go/codec"
)

func ImagePoints(image string) (string, error) {
	model := "kYKia3eDrXBhdHRlcm5fc2NhbGXLP/AAAAAAAACmdGhyZXNoFKdvY3RhdmVzAqRuYW1lu3BpY2FydXMuQlJJU0tJbWFnZUZlYXR1cmUyZA=="
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
func ImagePointsMatchFloat64(points0 float64, points1 float64) ([]float64, error)

}

func ImagePointsMatch(points0 string, points1 string) ([]float64, error) {
	model := "kYKia3eDqG1heF9kaXN0eKttaW5faW5saWVycwqtcmVwcm9qX3RocmVzaMtAFAAAAAAAAKRuYW1l2gAkcGljYXJ1cy5JbWFnZUhvbW9ncmFwaHlSYW5zYWNIYW1taW5n"
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
	models = append(models, map[string]interface{}{"name": "picarus.ImageWarp", "kw": model})
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

func HMult(a, b []float64) []float64 {
	c := make([]float64, 9, 9)
	c[0] = a[0]*b[0] + a[1]*b[3] + a[2]*b[6]
	c[1] = a[0]*b[1] + a[1]*b[4] + a[2]*b[7]
	c[2] = a[0]*b[2] + a[1]*b[5] + a[2]*b[8]
	c[3] = a[3]*b[0] + a[4]*b[3] + a[5]*b[6]
	c[4] = a[3]*b[1] + a[4]*b[4] + a[5]*b[7]
	c[5] = a[3]*b[2] + a[4]*b[5] + a[5]*b[8]
	c[6] = a[6]*b[0] + a[7]*b[3] + a[8]*b[6]
	c[7] = a[6]*b[1] + a[7]*b[4] + a[8]*b[7]
	c[8] = a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
	return c
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
	return ImagePointsMatch(pts0, pts1)
}
