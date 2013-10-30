import gevent.monkey
gevent.monkey.patch_all()
import cv2
import numpy as np
import msgpack
from websocket import create_connection
import time
import json
import argparse
import os


PARAMS = {'_delta':10, '_min_area': 7000, '_max_area': 30000, '_max_variation': .25, '_min_diversity': .2, '_max_evolution': 200, '_area_threshold': 1.01, '_min_margin': .003, '_edge_blur_size': 5, 'pupil_intensity': 75, 'pupil_ratio': 1.5}

PARAMS = {'_delta':10, '_min_area': 850, '_max_area':6000, '_max_variation': .25, '_min_diversity': .2, '_max_evolution': 200, '_area_threshold': 1.01, '_min_margin': .003, '_edge_blur_size': 5, 'pupil_intensity': 75, 'pupil_ratio': 2.}

def serialize(y, x):
    return msgpack.dumps(['sensors', 'Pupil Eyetracker', {'Pupil Eyetracker': -2}, {'Pupil Eyetracker': [[[y, x], time.time(), int(time.time() * 1000000000)]]}])


def server(port, **kw):
    def websocket_app(environ, start_response):
        print('Connected')
        if environ["PATH_INFO"] == '/':
            ws = environ["wsgi.websocket"]
            for x, y, _, _, _ in pupil_iter(**PARAMS):
                if x is None:
                    continue
                print('Sending')
                ws.send(serialize(y, x), binary=True)
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    pywsgi.WSGIServer(("", port), websocket_app,
                      handler_class=WebSocketHandler).serve_forever()


def client(url, **kw):
    G = None
    ws = create_connection(url)
    for x, y, _, _, _ in pupil_iter(**PARAMS):
        if x is None:
            continue
        ws.send(serialize(y, x), opcode=2)

def debug(**kw):
    while True:
        print(PARAMS)
        for x, y, frame, region, hull in pupil_iter(debug=True, **PARAMS):
            if x is not None:
                cv2.circle(frame, (int(np.round(x)), int(np.round(y))), 10, (0, 255, 0))
                cv2.polylines(frame, [hull], 1, (0, 255, 0))
            cv2.imshow("Eye", frame)
            key = cv2.waitKey(20)
            if key == -1:
                continue
            elif key == 27:
                return
            elif key == 97: # a
                PARAMS['_delta'] += 5
            elif key == 122: # z
                PARAMS['_delta'] -= 5
            elif key == 115: # s
                PARAMS['_max_variation'] += .1
            elif key == 120: # x
                PARAMS['_max_variation'] -= .1
            elif key == 100: # d
                PARAMS['_min_diversity'] += .1
            elif key == 99: # c
                PARAMS['pupil_intensity'] -= .1
            elif key == 102: # f
                PARAMS['pupil_intensity'] += 5
            elif key == 118: # v
                PARAMS['pupil_intensity'] -= 5
            if 97 <= key <= 122:
                print(key)
                break


def pupil_iter(pupil_intensity, pupil_ratio, debug=False, **kw):
    camera_id = 1
    camera = cv2.VideoCapture(camera_id)
    camera.set(cv2.cv.CV_CAP_PROP_FRAME_WIDTH, 320)
    camera.set(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT, 240)
    rval = 1
    while rval:
        rval, frame = camera.read()
        mser = cv2.MSER(**kw)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        regions = mser.detect(gray, None)
        hulls = []
        # Select most circular hull
        for region in regions:
            h = cv2.convexHull(region.reshape(-1, 1, 2)).reshape((-1, 2))
            hc = h - np.mean(h, 0)
            _, s, _ = np.linalg.svd(hc)
            r = s[0] / s[1]
            if r > pupil_ratio:
                if debug: print('Skipping ratio %f > %f' % (r, pupil_ratio))
                continue
            mval = np.median(gray.flat[np.dot(region, np.array([1, frame.shape[1]]))])
            if mval > pupil_intensity:
                if debug: print('Skipping intensity %f > %f' % (mval, pupil_intensity))
                continue
            if debug: print('Kept: Area[%f] Intensity[%f] Ratio[%f]' % (region.shape[0], mval, r))
            hulls.append((r, region, h))
        if hulls:
            hulls.sort()
            gaze = np.mean(hulls[0][2].reshape((-1, 2)), 0).tolist()
            if debug: print('Gaze[%f,%f]' % (gaze[0], gaze[1]))
            yield gaze[0], gaze[1], frame, hulls[0][1], hulls[0][2]
        else:
            yield None, None, frame, None, None

def main():
    parser = argparse.ArgumentParser(description='Pupil tracking code')
    subparsers = parser.add_subparsers()
    subparser = subparsers.add_parser('server')
    subparser.add_argument('--port', type=int, default=8080)
    subparser.set_defaults(func=server)
    subparser = subparsers.add_parser('client')
    subparser.add_argument('url')
    subparser.set_defaults(func=client)
    subparser = subparsers.add_parser('debug')
    subparser.set_defaults(func=debug)
    args = parser.parse_args()
    args.func(**vars(args))

if __name__ == '__main__':
    main()
