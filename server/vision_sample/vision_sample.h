#ifndef VISION_SAMPLE_H
#define VISION_SAMPLE_H
char *process_image_jpeg(char *input_jpeg, int input_size, int output_height, int output_width, int *output_size);
void process_image_free(char *output);
void process_image(unsigned char *input, int input_height, int input_width, unsigned char *output, int output_height, int output_width);
#endif
