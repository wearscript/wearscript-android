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
	out := picarusto.ModelChainProcessBinary(picarus.B64Dec(model), input)
	var outDec []interface{}
	outDec = append(outDec, make([]float64, 9))
	outDec = append(outDec, make([]int, 2))
	var mh2 codec.MsgpackHandle
	err = codec.NewDecoderBytes([]byte(out), &mh2).Decode(&outDec)
	if err != nil {
		fmt.Println("Couldn't decode output")
		return nil, err
	}
	return outDec[0].([]float64), nil
}