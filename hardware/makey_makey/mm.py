import gevent.monkey
gevent.monkey.patch_all()
import cv2
import numpy as np
import random
import msgpack
from websocket import create_connection
import time
import json
import argparse
import os
import time
import glob
import requests
import curses


def serialize(*args):
    return msgpack.dumps(['sensors', 'Pupil Eyetracker', {'Pupil Eyetracker': -2}, {'Pupil Eyetracker': [[list(args), time.time(), int(time.time() * 1000000000)]]}])


def server(port, **kw):
    def websocket_app(environ, start_response):
        print('Connected')
        if environ["PATH_INFO"] == '/':
            ws = environ["wsgi.websocket"]
        w = curses.initscr()
        w.nodelay(1)
        w.keypad(1)
        print('Press ESC to quit')
        last_command = 0
        while 1:
            a = w.getch()
            if a == 27:
                break
            if time.time() - last_command < 1:
                continue
            if a != -1:
                time.sleep(0.01)
                print(a)
            else:
                time.sleep(0.01)
                continue
            if a == curses.KEY_RIGHT:
                ws.send(serialize(float(1)), binary=True)
                last_command = time.time()
            if a == curses.KEY_UP:
                ws.send(serialize(float(0)), binary=True)
                last_command = time.time()
        curses.endwin()
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    pywsgi.WSGIServer(("", port), websocket_app,
                      handler_class=WebSocketHandler).serve_forever()

def main():
    parser = argparse.ArgumentParser(description='Makey Makey Server')
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()
    server(**vars(args))

if __name__ == '__main__':
    main()
