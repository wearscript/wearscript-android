#include <Servo.h> 

#define NUM_SERVOS 3
Servo servos[NUM_SERVOS];
int servo_pins[] = {9, 10, 11};

#define NUM_LEDS 2
int led_pins[] = {13, 8};

#define MIN_PULSE 600
#define MAX_PULSE 2400

int data[3];
int i;
 
void setup() 
{ 
  for (i = 0; i < NUM_SERVOS; i++)
    servos[i].attach(servo_pins[i], MIN_PULSE, MAX_PULSE);
  for (i = 0; i < NUM_LEDS; i++)
    pinMode(led_pins[i], OUTPUT);
  Serial.begin(9600);
} 
 
void loop() 
{     
  if (Serial.available() < 3)
    return;
  data[0] = Serial.read();
  if (data[0] != 255)
      return;
  data[1] = Serial.read();
  data[2] = Serial.read();
  if (data[1] >= NUM_SERVOS + NUM_LEDS)
      return;
  if (data[1] < NUM_SERVOS) // SERVO
      servos[data[1]].write(data[2]);
  else // LED
      digitalWrite(led_pins[data[1] - NUM_SERVOS], data[2] ? HIGH : LOW);
}