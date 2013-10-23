#include "vision_sample.h"
#include <stdlib.h>
#include <stdio.h>

int main() {
    FILE *fp = fopen("input.jpg", "rb");
    if (fp == NULL)
        return 1;
    fseek(fp, 0, SEEK_END);
    int num_bytes = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    char *data = malloc(num_bytes);
    if (fread(data, num_bytes, 1, fp) != 1)
        return 1;
    fclose(fp);
    
    int output_size;
    char *output = process_image_jpeg(data, num_bytes, 360, 640, &output_size);
    free(data);

    fp = fopen("output.jpg", "wb");
    if (fp == NULL)
        return 1;
    fwrite(output, output_size, 1, fp);
    fclose(fp);
    free(output);
    
    return 0;
}
