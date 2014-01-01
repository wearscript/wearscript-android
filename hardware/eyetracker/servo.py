#!/usr/bin/env python

################################################
# Module:   servo.py
# Created:  2 April 2008
# Author:   Brian D. Wendt
#   http://principialabs.com/
# Version:  0.3
# License:  GPLv3
#   http://www.fsf.org/licensing/
'''
Provides a serial connection abstraction layer
for use with Arduino "MultipleSerialServoControl" sketch.
'''
################################################

import serial

# Assign Arduino's serial port address
#   Windows example
#     usbport = 'COM3'
#   Linux example
#     usbport = '/dev/ttyUSB0'
#   MacOSX example
#     usbport = '/dev/tty.usbserial-FTALLOK2'
usbport = '/dev/ttyACM0'

# Set up serial baud rate
ser = serial.Serial(usbport, 9600, timeout=1)

def eye_x(value):
    if (0 <= value <= 1.0):
        scaledVal = scale(73, value, 135)
        print(scaledVal)
        ser.write(chr(255))
        ser.write(chr(1))
        ser.write(chr(scaledVal))

def eye_y(value):
    if(0 <= value <= 1.0):
        scaledVal = scale(30, value, 160)
        print(scaledVal)
        ser.write(chr(255))
        ser.write(chr(2))
        ser.write(chr(scaledVal))

def mouth(value):
    if(0 <= value <= 1.0):
        scaledVal = scale(73, value, 145)
        print(scaledVal)
        ser.write(chr(255))
        ser.write(chr(3))
        ser.write(chr(scaledVal))

def scale(low, val, high):
    #val in [0-1]
    # low = value to return when val = 0
    return int(low + (high-low) * val)

#def scale(val, src, dst):
#    return int(((val - src[0]) / (src[1]-src[0])) * (dst[1] - dst[0]) + dst[0])

def move(servo, angle):
    '''Moves the specified servo to the supplied angle.

    Arguments:
        servo
          the servo number to command, an integer from 1-4
        angle
          the desired servo angle, an integer from 0 to 180

    (e.g.) >>> servo.move(2, 90)
           ... # "move servo #2 to 90 degrees"'''

    if (0 <= angle <= 180):
        ser.write(chr(255))
        ser.write(chr(servo))
        ser.write(chr(angle))
    else:
        print "Servo angle must be an integer between 0 and 180.\n"

if __name__ == '__main__':
    import random
    import time
    while 1:
        #eye_x(random.random())
        #eye_y(random.random())
        #mouth(random.random())
        eye_x(.5)
        eye_y(.5)
        mouth(.5)
        time.sleep(1)
        
