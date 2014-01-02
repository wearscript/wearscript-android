#include <Adafruit_NeoPixel.h>

#define PIN 6

// Parameter 1 = number of pixels in strip
// Parameter 2 = pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(30, PIN, NEO_GRB + NEO_KHZ800);
uint8_t *data;
uint8_t loop_data[2560];
int loop_pos = 0;
int loop_state = 0; // 0: no loop, 1: saving loop data, 2: looping
int i;
void setup() {
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  Serial.begin(9600);
}

void loop() {
  data = loop_data + loop_pos;
  if (Serial.available() < 6) {
    if (loop_state != 2)
      return;
  } else {
      if (loop_state == 2) {
          // If data comes in while we loop, clear the loop
          loop_state = 0;
	  loop_pos = 0;
      }
      data[0] = Serial.read();
      if (data[0] != 255)
          return;
      for (i = 0; i < 5; i++)
          data[i] = Serial.read();
  }
  if (loop_state != 0)
      loop_pos += 5;
  switch (data[0]) {
    case 0:
      strip.setPixelColor(data[1], data[2], data[3], data[4]);
      break;
    case 1:
      strip.setBrightness(data[1]);
      break;
    case 2:
      strip.show();
      break;
    case 3:
      delay(data[1]);
      break;
    case 4: // start loop
      loop_state = 1;
      loop_pos = 0;
      break;
    case 5: // finish loop
      loop_state = 2;
      loop_pos = 0;
      break;
  }
}
