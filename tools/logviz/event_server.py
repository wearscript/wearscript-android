try:
    import gevent.monkey
    gevent.monkey.patch_all()
    import msgpack
    import websocket
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
except ImportError:
    print('Need to install imports, on Ubuntu try...\nsudo apt-get install libevent-dev python-pip python-dev\nsudo pip install gevent gevent-websocket msgpack-python websocket-client\n')
    raise

import glob
import argparse
import redis
import logging
import json
import os

class WebSocketServerConnection(object):

    def __init__(self, ws):
        self.ws = ws

    def send(self, *args):
        self.ws.send(msgpack.dumps(list(args)), binary=True)

    def receive(self):
        data = self.ws.receive()
        print(data)
        if data is None:
            raise WebSocketException
        return msgpack.loads(data)


def websocket_server(callback, port, **kw):

    def websocket_app(environ, start_response):
        logging.info('Glass connected')
        if environ["PATH_INFO"].startswith('/static/'):
            f = os.path.basename(os.path.abspath(environ["PATH_INFO"]))
            mime = {'js': 'application/javascript', 'html': 'text/html', 'css': 'text/css'}
            start_response("200 OK", [("Content-Type", mime[f.split('.')[-1]])])
            return STATIC_FILES[f]
        elif environ["PATH_INFO"] == '/':
            try:
                ws = environ["wsgi.websocket"]
                callback(WebSocketServerConnection(ws), **kw)
                wsgi_server.stop()
            except KeyError:
                start_response("200 OK", [("Content-Type", "text/html")])
                return TEMPLATE
        else:
            start_response("400 Bad Request", [])
    wsgi_server = pywsgi.WSGIServer(("", port), websocket_app,
                                    handler_class=WebSocketHandler)
    wsgi_server.serve_forever()


def parse(callback, parser):
    global IMAGE_DIR
    parser.add_argument('port', type=int)
    parser.add_argument('image_path')
    parser.set_defaults(func_=websocket_server)
    args = parser.parse_args()
    IMAGE_DIR = args.image_path
    vargs = dict(vars(args))
    del vargs['func_']
    args.func_(callback, **vargs)

def compute_events(db, user, max_event_delay=10.):
    times = [score for _, score in db.zrange(user + ':times', 0, -1, withscores=True)]
    db.delete(user + ':events')
    if not times:
        return
    events = [{'start_time': times[0], 'unique_times': 1, 'stop_time': times[0]}]
    last_time = times[0]
    for t in times[1:]:
        if t - last_time > max_event_delay:
            events.append({'start_time': t, 'unique_times': 0})
        events[-1]['stop_time'] = t
        events[-1]['unique_times'] += 1
        last_time = t
    db.set(user + ':events', msgpack.dumps(events))
    print(events)
    return events


def redis_factory():
    return redis.StrictRedis()

def setup():
    db = redis_factory()
    users = db.smembers('users')
    for user in users:
        compute_events(db, user)


def websocket_callback(ws, **kw):
    print('Got args[%r]' % (kw,))
    print('Demo callback, prints all inputs and sends nothing')
    db = redis_factory()    
    users = db.smembers('users')
    for user in users:
        sensors = db.hgetall(user + ':sensors')
        events = msgpack.loads(db.get(user + ':events'))
        ws.send('events', user, events)
        event = events[0]
    while 1:
        data = ws.receive()
        print(data)
        if data[0] == 'image':
            try:
                image_fn = db.zrangebyscore(data[1] + ':images', data[2], data[2])[0]
                print(image_fn)
                ws.send('image_data', data[1], data[2], open(IMAGE_DIR + image_fn).read())
            except IndexError:
                pass
        elif data[0] == 'slice':
            sensor_samples = {}
            user = data[1]
            print(data)
            event_start_time, start_time, stop_time, event_stop_time = data[2:6]
            for sensor in sensors:
                sensor_samples[sensor] = map(msgpack.loads, db.zrangebyscore(user + ':sensor:' + sensor, start_time, stop_time))
            images = db.zrangebyscore(user + ':images', start_time, stop_time, withscores=True)
            images = [x for _, x in images]
            ws.send('slice_data', user, event_start_time, start_time, stop_time, event_stop_time, sensor_samples, images)

if __name__ == '__main__':
    STATIC_FILES = {os.path.basename(x):open(x).read()
                    for x in glob.glob('static/*')}
    TEMPLATE = open('static_private/template.html').read()
    setup()
    parse(websocket_callback, argparse.ArgumentParser())
