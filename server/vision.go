// +build vision

package main

/*
#cgo LDFLAGS: -lvision_sample
#include <stdlib.h>
#include "vision_sample/vision_sample.h"
*/
import "C"
import "unsafe"

func process_image(input *string) *string {
	inputp := C.CString(*input)
	defer C.free(unsafe.Pointer(inputp))
	var output_size C.int
	outC := C.process_image_jpeg(inputp, C.int(len(*input)), C.int(360), C.int(640), &output_size)
	out := unsafe.Pointer(outC)
	outS := string(C.GoBytes(out, output_size))
    C.process_image_free(outC)
	return &outS
}