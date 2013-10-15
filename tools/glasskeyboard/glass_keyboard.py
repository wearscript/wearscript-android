#!/usr/bin/env python
import sys
import termios
import contextlib
import subprocess, threading
from subprocess import call
import argparse
import Queue
import datetime
import time

startMessage = \
"""
GlassKeyboard: control your Glass with key events from Python
=========================================================

exit with ^C or ^D

Enabled Keys
------------

key          command
------------ ------------
h            home
enter        tap
right arrow  swipe right
left arrow   swipe left
down arrow   swipe down
s            launch android settings
g            launch glass settings
l            launch Launchy
p            take a picture (broken)
i            show this doc

Known Limitations
-----------------

* For adb running as root, GlassKeyboard uses a system binary called
  `simulated_input` to generate touchpad events. This works well and fast,
  with the caveat that in applications where LEFT and RIGHT are mapped to
  scroll events, they generate two unit scrolls instead of one.

* When not running as root, GlassKeyboard uses keyevents to imitate touchpad
  events, but these are not mapped to scroll events, as real swipe events
  would be. For example, in Launchy, keyevents do not scroll through options.

* When not running as root, performance is a little slow. This seems to be a
  limitation of the technique of using adb to send keyevents, as far as I can
  tell. Batching `input` events in a single `adb shell` call doesn't seem to
  help much, so I'm using separate calls for each event.

* I don't know if the representation of keys is platform independent.
  This works on Mac OS X right now.

Notes on implementation
-----------------------

* GlassKeyboard uses threads with timeouts because adb doesn't reliably
  return, particularly over wireless. The device will continue to
  accept new commands even if the previous one hasn't returned. 

* Arrow keys are represented with three bytes, so there's a goofy-looking
  state machine (involving multiByte) in the single-byte-reading loop that
  combines these in order to interpret them.

Todo
----

* Enable lots more keys

License
-------

GlassKeyboard is part of WearScript, see the license of WearScript.
WearScript is a project of OpenShades.

Author
______
Scott Greenwald (swgreen on GitHub)

"""

TAP = 0
LEFT = 1
RIGHT = 2
DOWN = 3
HOME = 4
GLASS_SETTINGS = 5
SETTINGS = 6
SCREENSHOT = 7
LAUNCHY = 8
PICTURE = 9
WEARSCRIPT = 10
COLORS = 11

# rooted command, e.g.:
#  adb shell simulated_input TAP ON

# unrooted command:
#  adb shell input keyevent 66

# these are keycodes
event_name_dict = {
    TAP: 'TAP',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    HOME: 'HOME',
    GLASS_SETTINGS: 'GLASS_SETTINGS',
    SETTINGS: 'SETTINGS',
    LAUNCHY: 'LAUNCHY',
    PICTURE: 'PICTURE',
    WEARSCRIPT: 'WEARSCRIPT',
    COLORS: 'COLORS'
}

user_dict = {
    TAP: '66', 
    LEFT: '21', 
    RIGHT: '22', 
    DOWN: '4',
    HOME: '3'
}
cmd = "adb shell input keyevent "
for key, value in user_dict.items():
    user_dict[key] = cmd + value

launch_components = {
    GLASS_SETTINGS: 'com.google.glass.home/.settings.SettingsTimelineActivity',
    SETTINGS: 'com.android.settings',
    LAUNCHY: 'com.mikedg.android.glass.launchy/.MainActivity',
    PICTURE: '-a com.google.glass.action.TAKE_PICTURE com.google.glass.camera',
    WEARSCRIPT: 'com.dappervision.wearscript/.MainActivity',
    COLORS: '--es extra "http://wearscript.com/colors.html" com.dappervision.wearscript/.MainActivity'
}
cmd = "adb shell am start "
for key, value in launch_components.items():
    launch_components[key] = user_dict[HOME] + " && " + cmd + value

key_bindings = {
    'g': GLASS_SETTINGS,
    's': SETTINGS,
    'p': PICTURE,
    'l': LAUNCHY,
    'h': HOME,
    'w': WEARSCRIPT,
    'c': COLORS
}

root_overrides = {
    TAP: 'TAP',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
}
rcmd = 'adb shell simulated_input %s ON'
for key, value in root_overrides.items():
    root_overrides[key] = rcmd % value
root_dict = dict(user_dict, **root_overrides)

class Command(object):
    def __init__(self, cmd):
        self.cmd = cmd
        self.process = None

    def run(self, timeout):
        def target():
            #print 'Thread started'
            self.process = subprocess.Popen(self.cmd, shell=True)
            self.process.communicate()
            #print 'Thread finished'

        thread = threading.Thread(target=target)
        thread.start()

        thread.join(timeout)
        if thread.is_alive():
            print 'Terminating process'
            self.process.terminate()
            thread.join()
        #print self.process.returncode

@contextlib.contextmanager
def raw_mode(file):
    old_attrs = termios.tcgetattr(file.fileno())
    new_attrs = old_attrs[:]
    new_attrs[3] = new_attrs[3] & ~(termios.ECHO | termios.ICANON)
    try:
        termios.tcsetattr(file.fileno(), termios.TCSADRAIN, new_attrs)
        yield
    finally:
        termios.tcsetattr(file.fileno(), termios.TCSADRAIN, old_attrs)

def doc_string(event_name_key):
    if event_name_key in full_event_dict.keys():
        return event_name_dict[event_name_key] + ": " + full_event_dict[event_name_key]
    else:
        return "Unrecognize event_name_key " + str(event_name_key)

def main(**kw):
    print "GlassKeyboard. Press i for intro"
    print "User " + ("has" if ROOT else "does not have") + " root privileges."
    for key, value in event_dict.items():
        print event_name_dict[key] + ": " + event_dict[key]
    for key, value in launch_components.items():
        print event_name_dict[key] + ": " + launch_components[key]
    print 'exit with ^C or ^D'
    with raw_mode(sys.stdin):
        try:
            multiByte = []
            chHex = '0a'
            while True:
                chPrev = chHex
                ch = sys.stdin.read(1)
                chHex = '%02x' % ord(ch)
                #print "Read a character " + ch + " " + chHex
                if ch in key_bindings.keys():
                    command = Command(full_event_dict[key_bindings[ch]])
                    print doc_string(key_bindings[ch])
                    command.run(timeout=3)
                elif ch == 'i':
                    print startMessage
                elif ch == 'e':
                    easter_egg()
                elif ch == 'r':
                    command = Command('adb root')
                    print "ROOT: adb root"
                    command.run(timeout=3)
                elif ch == 'd':
                    command = Command('adb devices')
                    print "List devices: adb devices"
                    command.run(timeout=3)
                elif chHex == '0a':
                    print event_name_dict[TAP] + ": " + event_dict[TAP]
                    command = Command(event_dict[TAP])
                    command.run(timeout=3)
                if multiByte == [] and chHex == '1b':
                    multiByte += ['1b']
                elif multiByte == ['1b'] and chHex == '5b':
                    multiByte += ['5b']
                    # print "Got an arrow key"
                elif multiByte == ['1b','5b']:
                    if chHex == '43': # RIGHT
                        command = Command(event_dict[RIGHT])
                        print event_name_dict[RIGHT] + ": " + event_dict[RIGHT]
                        command.run(timeout=3)
                    elif chHex == '44': # LEFT
                        command = Command(event_dict[LEFT])
                        print event_name_dict[LEFT] + ": " + event_dict[LEFT]
                        command.run(timeout=3)
                    # elif chHex == '41': # UP
                    elif chHex == '42': # DOWN
                        command = Command(event_dict[DOWN])
                        print event_name_dict[DOWN] + ": " + event_dict[DOWN]
                        command.run(timeout=3)
                    elif chHex == '41': # UP
                        command = Command(event_dict[HOME])
                        print doc_string(HOME)
                        command.run(timeout=3)
                    else:
                        print "Unrecognized arrow key"
                    multiByte = []
                else:
                    multiByte = []
                if not ch or ch == chr(4):
                    break
        except (KeyboardInterrupt, EOFError):
            pass

def event_sequence(sequence):
    for specifier in sequence:
        command = Command(event_dict[specifier])
        print event_dict[specifier]
        command.run(timeout=3)

def user_has_root():
    cmd = ['adb', 'shell', 'getprop', 'service.adb.root']
    val = subprocess.check_output(cmd)
    ret = True if val == "1\r\n" else False
    return ret



def easter_egg(**kw):
    print 'Goin for the easter egg.'
    if ROOT:
        print 'as root'
        # Flush logcat to clear old matches
        subprocess.call('adb logcat -c'.split())
        # wake up the device
        subprocess.call("adb shell input keyevent 3".split())
        # (apparently) need root to launch this directly
        c = 'adb shell am start com.google.glass.home/.settings.ViewLicensesActivity'
        subprocess.call(c.split())

        time.sleep(10)
        sequence = [TAP] * 25
        event_sequence(sequence)
    else:
        sequence = [RIGHT, RIGHT, TAP, TAP]
        sequence_taps = [TAP] * 25
        c = 'adb shell am start com.google.glass.home/.settings.SettingsTimelineActivity'
        event_sequence([HOME])
        subprocess.call(c.split())
        event_sequence(sequence)
        time.sleep(10)
        event_sequence(sequence_taps)

if __name__ == '__main__':
    ROOT = user_has_root()
    event_dict = root_dict if ROOT else user_dict
    full_event_dict = dict(event_dict, **launch_components)
    main()




















