import gevent.monkey
gevent.monkey.patch_all()
import cv2
import numpy as np
import random
import msgpack
from websocket import create_connection
from consolidate_pupil import consolidate
import time
import json
import argparse
import os
import time
import glob
import requests

PARAMS = {'_delta':10, '_min_area': 2000, '_max_area': 20000, '_max_variation': .25, '_min_diversity': .2, '_max_evolution': 200, '_area_threshold': 1.01, '_min_margin': .003, '_edge_blur_size': 5, 'pupil_intensity': 130, 'pupil_ratio': 2}
CMDS = ['X', 'PERIOD']
LAST_COMMAND_TIME_FIRST = 0
LAST_COMMAND_TIME = 0
LAST_COMMAND = None

#PARAMS = {'_delta':10, '_min_area': 5000, '_max_area': 50000, '_max_variation': .25, '_min_diversity': .2, '_max_evolution': 200, '_area_threshold': 1.01, '_min_margin': .003, '_edge_blur_size': 5, 'pupil_intensity': 125, 'pupil_ratio': 2}



#PARAMS = {'_delta':10, '_min_area': 850, '_max_area':6000, '_max_variation': .25, '_min_diversity': .2, '_max_evolution': 200, '_area_threshold': 1.01, '_min_margin': .003, '_edge_blur_size': 5, 'pupil_intensity': 75, 'pupil_ratio': 2.}
COLORS = [[0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 0], [1, 0, 1], [0, 1, 1]]

def serialize(*args):
    return msgpack.dumps(['sensors', 'Pupil Eyetracker', {'Pupil Eyetracker': -2}, {'Pupil Eyetracker': [[list(args), time.time(), int(time.time() * 1000000000)]]}])


def serialize_cmd(*args):
    return msgpack.dumps(args)


def server(port, **kw):
    dump = kw.get('dump')
    if dump is not None:
        dump = os.path.abspath(dump)
        try:
            os.makedirs(dump)
        except OSError:
            pass
    def websocket_app(environ, start_response):
        print('Connected')
        if environ["PATH_INFO"] == '/':
            ws = environ["wsgi.websocket"]
            run = [0]
            def receive():
                while 1:
                    msg_data = ws.receive()
                    if dump:
                        open(dump + '/%f.msgpack' % time.time(), 'w').write(msg_data)
                    msg = msgpack.loads(msg_data)
                    print(msg)
                    # If we get the "end of calibration" message restart the run loop
                    if dump and msg[0] == 'sensors' and any(int(x[0][0]) == -1 for x in msg[3].get('Pupil Point', [])):
                        consolidate(dump)
                        kw['calib'] = 'calib.js'
                        run[0] = 1
                    
            g = gevent.spawn(receive)
            kw.update(PARAMS)
            def command_func(cmd):
                print('--------------------Sending')
                ws.send(serialize(float(cmd)), binary=True)
                gevent.sleep(0)
            while 1:
                run[0] = 0
                #requests.get('http://localhost:8881/cmd/' + CMDS[i]).content
                for data in pupil_iter_smooth(command_func=command_func, **kw):
                    x, y = data[:2]
                    if run[0] != 0:
                        break
                    if kw.get('debug'):
                        print('Debug iter')
                        debug_iter(*data)
                    if x is None:
                        continue
                    print('Sending')
                    ws.send(serialize(y, x), binary=True)
                    gevent.sleep(0)
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    pywsgi.WSGIServer(("", port), websocket_app,
                      handler_class=WebSocketHandler).serve_forever()


def client(url, **kw):
    G = None
    kw.update(PARAMS)
    ws = create_connection(url)
    for x, y, _, _, _, _, _ in pupil_iter_smooth(**kw):
        if x is None:
            continue
        ws.send(serialize(y, x), opcode=2)

def debug(**kw):
    run = True
    while run:
        run = False
        debug_run(**kw)


def debug_run(**kw):
    print(PARAMS)
    kw.update(PARAMS)
    for data in pupil_iter_smooth(debug=True, **kw):
        # TODO: Fix the exit cases
        if debug_iter(*data):
            return

def debug_iter(x, y, frame, region, hull, box, timestamp):
    if x is not None:
        cv2.circle(frame, (int(np.round(x)), int(np.round(y))), 10, (0, 255, 0))
        cv2.ellipse(frame, box, (0, 255, 0))
        cv2.polylines(frame, [hull], 1, (0, 0, 255))
    if random.random() < .5:
        cv2.imshow("Eye", frame)
    key = cv2.waitKey(20)
    if key == -1:
        return False
    elif key == 27:
        return True
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
        return True


def pupil_iter_smooth(*args, **kw):
    xprev, yprev = None, None
    alpha = 1
    for x, y, frame, hull0, hull1, box, timestamp  in pupil_iter(*args, **kw):
        if x is None:
            yield x, y, frame, hull0, hull1, box, timestamp
            continue
        if xprev is None:
            xprev = x
            yprev = y
        xprev = (1-alpha) * xprev + alpha * x
        yprev = (1-alpha) * yprev + alpha * y
        yield xprev, yprev, frame, hull0, hull1, box, timestamp


def parse_calibration(calib, command_func):
    import matplotlib.pyplot as mp
    from plot import plot_cov_ellipse
    covis = []
    means = []
    for n, (mean, cov, pts) in enumerate(json.load(open(calib))):
        cov, mean = np.asfarray(cov), np.asfarray(mean)
        means.append(mean)
        covis.append(np.linalg.inv(cov))
        ellip = plot_cov_ellipse(cov, mean)
        ellip.set_alpha(.25)
        ellip.set_color(COLORS[n])
    means = np.asfarray(means)
    covis = np.asfarray(covis)
    mp.ylim([np.min(means[:, 1]) - np.std(means[:, 1]) * 2, np.max(means[:, 1]) + np.std(means[:, 1]) * 2])
    mp.xlim([np.min(means[:, 0]) - np.std(means[:, 0]) * 2, np.max(means[:, 0]) + np.std(means[:, 0]) * 2])
    mp.draw()
    def plot_point(x, y):
        global LAST_COMMAND_TIME, LAST_COMMAND_TIME_FIRST, LAST_COMMAND
        xy = np.array([x, y])
        ds = [np.dot(np.dot(xy - means[m, :], covis[m, :, :]), (xy - means[m, :]).T) for m in range(len(means))]
        i = np.argmin(ds)
        if ds[i] > 6:
            i = len(means)
            LAST_COMMAND_TIME_FIRST = time.time()
        else:
            # or time.time() - LAST_COMMAND_TIME_FIRST > 2
            if time.time() - LAST_COMMAND_TIME > 2.5 or LAST_COMMAND != i:
                if command_func is not None:
                    command_func(i)
                if LAST_COMMAND != i:
                    LAST_COMMAND_TIME_FIRST = time.time()
                LAST_COMMAND_TIME = time.time()
                LAST_COMMAND = i
        mp.scatter(x, y, c=np.array(COLORS[i]).reshape((1, -1)))
        mp.draw()
    return plot_point

def pupil_iter(pupil_intensity, pupil_ratio, debug=False, dump=None, load=None, plot=False, calib=None, func=None, command_func=None, **kw):
    camera_id = 0
    camera = cv2.VideoCapture(camera_id)
    camera.set(cv2.cv.CV_CAP_PROP_FRAME_WIDTH, 640)
    camera.set(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT, 480)
    rval = 1
    cnt = 0
    if load is None:
        frames = None
    else:
        frames = sorted(glob.glob(os.path.abspath(load) + '/*.jpg'), reverse=True)
    if dump is not None:
        dump = os.path.abspath(dump)
        try:
            os.makedirs(dump)
        except OSError:
            pass
    if plot:
        import matplotlib.pyplot as mp
        mp.ion()
        mp.show()
        if calib:
            plot_point = parse_calibration(calib, command_func)
        else:
            def plot_point(x, y):
                mp.scatter(x, y)
                mp.draw()
    while rval:
        st = time.time()
        if frames is None:
            rval, frame = camera.read()
            timestamp = time.time()
        else:
            try:
                path = frames.pop()
            except IndexError:
                break
            timestamp = float(os.path.basename(path).rsplit('.', 1)[0])
            frame = cv2.imread(path)
            if frame is None:
                break
        if dump is not None:
            cv2.imwrite(dump + '/%f.jpg' % (timestamp,), frame)
        cnt += 1
        print(frame.shape)
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
            print('Time[%f]' % (time.time() - st))
            e = cv2.fitEllipse(hulls[0][2])
            if debug: print('Gaze[%f,%f]' % (e[0][1], e[0][1]))
            if plot:
                plot_point(e[0][0], e[0][1])
            yield e[0][0], e[0][1], frame, hulls[0][1], hulls[0][2], e, timestamp
        else:
            yield None, None, frame, None, None, None, timestamp

def main():
    parser = argparse.ArgumentParser(description='Pupil tracking code')
    subparsers = parser.add_subparsers()
    parser.add_argument('--dump')
    parser.add_argument('--load')
    parser.add_argument('--calib')
    parser.add_argument('--plot', action='store_true')
    subparser = subparsers.add_parser('server')
    subparser.add_argument('--port', type=int, default=8080)
    subparser.add_argument('--debug', action='store_true')
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
