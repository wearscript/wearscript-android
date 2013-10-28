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
wport = 5555;

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

GLASS_ID_NOT_SET = 'XXXXX'
MY_GLASS_ID = '015D98410100801C'; # YOUR GLASS ID HERE

if MY_GLASS_ID == GLASS_ID_NOT_SET: 
    print "Please set MY_GLASS_ID in source."

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

the_status = False

def is_device_connected():
    cmd = ['adb', 'devices']
    val = subprocess.check_output(cmd)
    return val.find(MY_GLASS_ID) > -1

def user_has_root():
    cmd = ['adb', 'shell', 'getprop', 'service.adb.root']
    val = None
    try:
        val = subprocess.check_output(cmd)
    except: 
        print "no device connected", sys.exc_info()[0]
    return val == "1\r\n"

def doc_string(event_name_key):
    if event_name_key in full_event_dict.keys():
        return event_name_dict[event_name_key] + ": " + full_event_dict[event_name_key]
    else:
        return "Unrecognize event_name_key " + str(event_name_key)

def get_device_ip():
    cmd = ['adb', 'shell', 'netcfg']
    val = None
    try:
        val = subprocess.check_output(cmd)
    except: 
        print "netcfg no device connected", sys.exc_info()[0]
        return None
    return val.split("\n")[5].split()[2].split("/")[0]

# if result says "error", didn't work. if echos port, did work.
def adb_tcpip(port):
    cmd = ['adb', 'tcpip', str(port)]
    out = None
    try:
        val = subprocess.check_output(cmd)
    except:
        print "adb_tcpip something went wrong", sys.exc_info()[0]
    return val.find("error") == -1

def wireless_connect(port):
    ip = get_device_ip()
    print "Trying to connect to ip %s" % ip
    if adb_tcpip(port):
        cmd = 'adb connect %s:%s' % (ip,str(port))
        command = Command(cmd)
        command.run(timeout=5)

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

# #####
# # USED FOR FILTERING RECTANGLE PARAMS FROM LOGCAT

# line_queue = Queue.Queue()
# cmd = ["adb", "logcat"] 
# process = subprocess.Popen(cmd, stdout=subprocess.PIPE)

# data_line_re = re.compile("###([^#]+)###")

# def file_thread(process, line_queue):
#     while True:
#         line = process.stdout.readline()
#         if process.poll() is not None:
#             print "Subprocess died."
#             break
#         m = data_line_re.search(line)
#         if m:
#             line = m.groups()[0]
#             line_queue.put(line)

# thread.start_new_thread(file_thread, (process, line_queue))

#####
# MAKING ANOTHER INSTANCE FOR STATUS MONITORING

device_status_queue = Queue.Queue()
status_cmd = ["adb", "status-window"] 
status_process = subprocess.Popen(status_cmd, stdout=subprocess.PIPE)

def status_thread(process, line_queue):
    while True:
        line = status_process.stdout.readline()
        if status_process.poll() is not None:
            print "Status subprocess died."
            break
        if (line.find("device") > -1):
            # device_status_queue.put("{'value': 'True'}")
            device_status_queue.put(True)
        if (line.find("unknown") > -1):
            # device_status_queue.put("{'value': 'False'}")
            device_status_queue.put(False)

thread.start_new_thread(status_thread, (status_process, device_status_queue))

class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        global the_status
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

        elif self.path == "/statuspoll":
            # Long poll, waiting for a response from our queue.
            count = 0
            the_status_line = None
            while not device_status_queue.empty():
                try:
                    count += 1
                    the_status_line = device_status_queue.get_nowait()
                except Queue.Empty:
                    break
            if the_status_line is not None:
                the_status = the_status_line
            #    the_status_line = device_status_queue.get()
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(the_status)

        elif self.path == "/wirelessconnect":
            wireless_connect(wport)

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
        elif self.path == '/isRoot':
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(user_has_root());
        elif self.path == '/isConnected':            
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(is_device_connected());
        elif self.path.startswith("/"):
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.send_error(404, "Not found.")

if __name__ == "__main__":
    ROOT = user_has_root()
    print "Device connected: %s" % is_device_connected()
    get_device_ip()
    event_dict = root_dict if ROOT else user_dict
    full_event_dict = dict(event_dict, **launch_components)
    httpd = BaseHTTPServer.HTTPServer(("", port), MyHandler)
    httpd.serve_forever()

