#include <string.h>
#include <stdlib.h>
#include <opencv2/highgui/highgui_c.h>
#include "vision_sample.h"

char *process_image_jpeg(char *input_jpeg, int input_size, int output_height, int output_width, int *output_size) {
    CvMat* input_jpegm = cvCreateMat(1, input_size, CV_8UC1);
    input_jpegm->data.ptr = (unsigned char *)input_jpeg;
    IplImage *input = cvDecodeImage(input_jpegm, CV_LOAD_IMAGE_COLOR);
    unsigned char *outputBytes = malloc(output_height * output_width * 3);
    process_image((unsigned char *)input->imageData, input->width, input->height, outputBytes, output_height, output_width);
    IplImage *output =  cvCreateImageHeader(cvSize(output_width, output_height), IPL_DEPTH_8U, 3); 
    output->imageData = (char *)outputBytes;
    CvMat* output_jpegm = cvEncodeImage(".jpg", output, 0);
    *output_size = output_jpegm->rows * output_jpegm->cols;
    char *output_jpeg = malloc(*output_size);
    memcpy(output_jpeg, output_jpegm->data.ptr, *output_size);
    cvReleaseMat(&input_jpegm);
    cvReleaseMat(&output_jpegm);
    cvReleaseImage(&input);
    cvReleaseImage(&output);
    free(outputBytes);
    return output_jpeg;
}

void process_image_free(char *output) {
    free(output);
}

#ifdef USE_SAMPLE
void process_image(unsigned char *input, int input_height, int input_width, unsigned char *output, int output_height, int output_width) {
    int i, j, k;
    // Flips the image so that you can see a change
    for (i = 0; i < output_height; ++i)
        for (j = 0; j < output_width; ++j)
            for (k = 0; k < 3; ++k)
                output[(output_width * i + j) * 3 + k] = input[3 * (output_width * i + (output_width - j - 1)) + k];
    //memcpy(output, input, output_height * output_width * 3);
}
#endif

