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

import BaseHTTPServer
import SimpleHTTPServer
import thread
import os
import re

port = 8881;

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
WEARSCRIPT_LAUNCHY = 12

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
    WEARSCRIPT_LAUNCHY: 'WEARSCRIPT_LAUNCHY',
    COLORS: 'COLORS'
}

event_id_dict = dict([[v,k] for k,v in event_name_dict.items()])

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
    WEARSCRIPT_LAUNCHY: 'com.openshades.android.glass.launchy/.MainActivity',
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
    'w': WEARSCRIPT_LAUNCHY,
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

def user_has_root():
    cmd = ['adb', 'shell', 'getprop', 'service.adb.root']
    val = subprocess.check_output(cmd)
    ret = True if val == "1\r\n" else False
    return ret

def doc_string(event_name_key):
    if event_name_key in full_event_dict.keys():
        return event_name_dict[event_name_key] + ": " + full_event_dict[event_name_key]
    else:
        return "Unrecognize event_name_key " + str(event_name_key)

class Command(object):
    def __init__(self, cmd):
        self.cmd = cmd
        self.process = None

    def run(self, timeout):
        print "running " + self.cmd
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

line_queue = Queue.Queue()
cmd = ["adb", "logcat"] # ["./pass_through.py"] 
process = subprocess.Popen(cmd, stdout=subprocess.PIPE)

data_line_re = re.compile("###([^#]+)###")

def file_thread(process, line_queue):
    while True:
        line = process.stdout.readline()
        if process.poll() is not None:
            print "Subprocess died."
            break
        m = data_line_re.search(line)
        if m:
            line = m.groups()[0]
            line_queue.put(line)

thread.start_new_thread(file_thread, (process, line_queue))

class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Respond to a GET request."""
        print "RESPONDING", self.path
        if self.path == "/longpoll":
            # Long poll, waiting for a response from our queue.
            count = 0
            the_line = None
            while not line_queue.empty():
                try:
                    count += 1
                    the_line = line_queue.get_nowait()
                except Queue.Empty:
                    break
            if the_line is None:
                the_line = line_queue.get()
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(the_line)

        elif self.path.startswith("/data/"):
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        elif self.path.startswith("/cmd/"):
            # get command name
            cmd = self.path.split("/")[-1]
            print "Got cmd %s" % (cmd)
            # run adb command
            if (cmd in event_id_dict.keys()):
                print "Found cmd " + cmd 
                command = Command(full_event_dict[event_id_dict[cmd]])
                print doc_string(event_id_dict[cmd])
                command.run(timeout=3)
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write("Did it: " + cmd)
                # get result?
        elif self.path == "/wake":
            subprocess.call("adb shell input keyevent 3".split())
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write("Did it.")
        elif self.path.startswith("/"):
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.send_error(404, "Not found.")

if __name__ == "__main__":
    ROOT = user_has_root()
    event_dict = root_dict if ROOT else user_dict
    full_event_dict = dict(event_dict, **launch_components)
    httpd = BaseHTTPServer.HTTPServer(("", port), MyHandler)
    httpd.serve_forever()

