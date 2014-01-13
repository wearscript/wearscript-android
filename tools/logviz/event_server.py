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
import bisect
import numpy as np

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
            mime = {'js': 'application/javascript', 'html': 'text/html', 'css': 'text/css', 'png': 'image/png', 'woff': 'application/x-font-woff'}
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

def user_tags(db, user):
    events = msgpack.loads(db.get(user + ':events'))
    tags = db.smembers('%s:tags' % user)
    tag_samples = {}  # [tag] = (time, polarity)
    tag_keys = {}  # [tag] = list of times
    if 1:
        for tag in tags:
            tag_key = '%s:tag:%s' % (user, tag)
            tag_samples[tag] = map(msgpack.loads, db.zrange(tag_key, 0, -1))
            tag_samples[tag] = [(x[1], x[0][0]) for x in tag_samples[tag]]
            tag_keys[tag] = [x[0] for x in tag_samples]
        # Apply rules to add data
        for tag in tags:
            tag_key = '%s:tag:%s' % (user, tag)
            def insert_sorted(tag, time, value):
                # TODO: Use bisect results
                if time in tag_keys:
                    return
                ind = bisect.bisect_left(tag_keys.setdefault(tag, []), time)
                tag_keys[tag].insert(ind, time)
                tag_samples.setdefault(tag, []).insert(ind, (time, value))
            for event in events:
                insert_sorted(tag, event['start_time'], 0)
                insert_sorted(tag, event['stop_time'], 0)
        tag_data = {}
        for tag in tags:
            tag_samples_new = []
            tag_samples_cur = tag_samples[tag]
            tag_samples_len = len(tag_samples_cur)
            for x in range(tag_samples_len):
                if x == 0 or x == tag_samples_len - 1 or tag_samples_cur[x - 1][1] != tag_samples_cur[x][1] or tag_samples_cur[x + 1][1] != tag_samples_cur[x][1]:
                    tag_samples_new.append(tag_samples_cur[x])
            tag_samples[tag] = tag_samples_new
            tag_data[tag] = [(x[0], y[0], x[1], y[0] - x[0]) for x, y in zip(tag_samples_new, tag_samples_new[1:]) if x[1] == y[1] and x[1] != 0]
    return tag_data
        
    

def verify_tags(db):
    users = db.smembers('users')
    rules = {}
    rules['outdoor'] = ['indoor', 'incar driving driven', '']
    rules['indoor'] = ['outdoor biking', 'incar driving driven', '']
    rules['incar'] = ['standing walking biking shopping', 'sitting outdoor indoor', '']
    rules['sitting'] = ['shopping standing walking', 'driving driven biking incar', '']
    rules['standing'] = ['incar sitting driving driven biking walking', '', '']
    rules['walking'] = ['incar sitting driving driven biking standing', '', '']
    rules['driving'] = ['standing walking biking shopping', 'indoor outdoor sitting', 'incar']
    rules['driven'] = ['standing walking biking shopping', 'indoor outdoor sitting', 'incar']
    rules['biking'] = ['indoor standing incar walking driving driven shopping', 'sitting', '']
    rules['shopping'] = ['biking sitting incar driving driven outdoor', '', '']
    rules = {k: [set(x.split()) for x in v] for k, v in rules.items()}
    # Set tags to "0" at event boundaries
    for user in users:
        events = msgpack.loads(db.get(user + ':events'))
        print(events)
        tag_data = user_tags(db, user)
        def tag_vals(t, tag, start_time, stop_time, polarity):
            for d in tag_data.get(tag, []):
                if d[0] <= start_time < d[1] or d[0] < stop_time <= d[1]:
                    if d[2] in polarity:
                        print('Tag failure[%s][%s][%f][%f][%f][%f][%d]' % (t, tag, start_time, stop_time, d[0], d[1], d[2]))
                        return False
            return True
        # Verify Rules
        for tag in tag_data:
            for d in tag_data.get(tag, []):
                if d[2] == 1:
                    for tag2 in rules[tag][0]:
                        tag_vals(tag, tag2, d[0], d[1], [1])
                    for tag2 in rules[tag][1]:
                        tag_vals(tag, tag2, d[0], d[1], [-1, 1])
                    for tag2 in rules[tag][2]:
                        tag_vals(tag, tag2, d[0], d[1], [-1])
        #print(rules[tag])
        print(tag_data)
        # Train
        sensors = db.hgetall(user + ':sensors')
        print(sensors)
        window_size = 6
        training_data = {}
        training_labels = {}
        training_times = {}
        def compute_features(t):
            sensor_samples = np.asfarray([msgpack.loads(x)[0]
                                          for x in db.zrangebyscore(user + ':sensor:MPL Linear Acceleration', t, t + window_size)])
            sensor_samples_light = np.asfarray([msgpack.loads(x)[0][:1]
                                                for x in db.zrangebyscore(user + ':sensor:LTR-506ALS Light sensor', t, t + window_size)])
            return np.hstack([fft_power_feature(sensor_samples), mean_feature(sensor_samples, 3), std_feature(sensor_samples, 3), mean_feature(sensor_samples_light, 1)]).ravel()
            
        for tag in tag_data:
            for x in tag_data[tag]:
                ds = []
                for t in np.arange(x[0], x[1] - window_size, window_size):
                    f = compute_features(t)
                    training_data.setdefault(tag, []).append(f)
                    training_labels.setdefault(tag, []).append(1)
                    training_times.setdefault(tag, []).append(t + window_size / 2)
                    for x in rules[tag][0]:
                        training_data.setdefault(x, []).append(f)
                        training_labels.setdefault(x, []).append(-1)
                        training_times.setdefault(x, []).append(t + window_size / 2)
                    for x in rules[tag][2]:
                        training_data.setdefault(x, []).append(f)
                        training_labels.setdefault(x, []).append(1)
                        training_times.setdefault(x, []).append(t + window_size / 2)
        classifiers = {}
        for tag in training_data:
            num_neg, num_pos = sum(1 for z in training_labels[tag] if z == -1), sum(1 for z in training_labels[tag] if z == 1)
            print((tag, num_neg, num_pos))
            if not num_neg or not num_pos:
                continue
            from sklearn import svm
            clf = svm.LinearSVC()
            clf.fit(training_data[tag], training_labels[tag])
            classifiers[tag] = clf
            ps = []
            corrects = []
            db.delete('%s:pred:%s' % (user, tag))
            print(dir(clf))
            for x, y, t in zip(training_data[tag], training_labels[tag], training_times[tag]):
                ps.append(float(clf.predict(x)[0] * clf.classes_[1]))
                corrects.append(ps[-1] == y)
            print((tag, np.mean(corrects), clf.coef_, clf.intercept_))
        ps.append(float(clf.predict(x)[0] * clf.classes_[1]))
        events = msgpack.loads(db.get(user + ':events'))        
        for event in events:
            for t in np.arange(event['start_time'], event['stop_time'] - window_size, window_size):
                f = compute_features(t)
                for tag, clf in classifiers.items():
                    p = float(clf.predict(f)[0] * clf.classes_[1])
                    db.zadd('%s:pred:%s' % (user, tag), t, msgpack.dumps([[p], t, int(t * 10**9)]))
                    
                

def fft_power_feature(sensor_samples):
    a = np.abs(np.fft.fft(sensor_samples))
    a = np.max(a * a)
    return np.array([a])

def mean_feature(sensor_samples, ndim):
    if not len(sensor_samples):
        return np.array([0] * ndim)
    return np.mean(sensor_samples, 0)

def std_feature(sensor_samples, ndim):
    if not len(sensor_samples):
        return np.array([0] * ndim)
    return np.std(sensor_samples, 0)

def redis_factory():
    return redis.StrictRedis()

def setup():
    db = redis_factory()
    verify_tags(db)
    if 1:
        return
    users = db.smembers('users')
    for user in users:
        compute_events(db, user)


def websocket_callback(ws, **kw):
    print('Got args[%r]' % (kw,))
    print('Demo callback, prints all inputs and sends nothing')
    db = redis_factory()    
    users = db.smembers('users')
    for user in users:
        events = msgpack.loads(db.get(user + ':events'))
        ws.send('events', user, events)
        tags = db.smembers('%s:tags' % user)
        def inside_event(start_time, stop_time):
            for e in events:
                if e['start_time'] <= start_time < stop_time <= e['stop_time']:
                    return True
            return False
        tags = ['indoor', 'outdoor', 'standing', 'sitting', 'walking', 'driving', 'driven', 'biking', 'shopping']
        print(tags)
        ws.send('tags', user, list(tags))
        for tag in tags:
            value_times = [msgpack.loads(x)[:2] for x in db.zrange('%s:tag:%s' % (user, tag), 0, -1)]
            # TODO: Change this threshold to be the window size of the data being used
            #
            events_tag = [{'start_time': x[1], 'stop_time': y[1]} for x, y in zip(value_times, value_times[1:]) if x[0][0] == y[0][0]and inside_event(x[1], y[1])]
            #print((tag, events_tag, value_times))
            ws.send('events_tag', user, tag, events_tag)
            #event = events[0]
    while 1:
        data = ws.receive()
        if data[0] == 'image':
            try:
                image_fn = db.zrangebyscore(data[1] + ':images', data[2], data[2])[0]
                #print(image_fn)
                ws.send('image_data', data[1], data[2], open(IMAGE_DIR + image_fn).read())
            except IndexError:
                pass
        elif data[0] == 'slice':
            sensor_samples = {}
            user = data[1]
            tags = db.smembers('%s:tags' % user)
            event_start_time, start_time, stop_time, event_stop_time = data[2:6]
            sensors = db.hgetall(user + ':sensors')
            for sensor in sensors:
                sensor_samples[sensor] = map(msgpack.loads, db.zrangebyscore(user + ':sensor:' + sensor, start_time, stop_time))
            for tag in tags:
                tag_key = '%s:pred:%s' % (user, tag)
                tag_samples = db.zrangebyscore(tag_key, start_time, stop_time)
                sensor_samples['Pred:' + tag] = map(msgpack.loads, tag_samples)
                if tag_samples:
                    tag_start = [[0.], start_time, int(start_time * 10 ** 9)]
                    tag_stop = [[0.], stop_time, int(stop_time * 10 ** 9)]
                    sensor_samples['Pred:' + tag] = [tag_start] + sensor_samples['Pred:' + tag] + [tag_stop]
            for tag in tags:
                tag_key = '%s:tag:%s' % (user, tag)
                tag_samples = db.zrangebyscore(tag_key, start_time, stop_time)
                sensor_samples['Tag:' + tag] = map(msgpack.loads, tag_samples)
                # Inside an event continue the tag value from previous
                if tag_samples:
                    tag_start_ind = db.zrank(tag_key, tag_samples[0])
                    tag_stop_ind = db.zrank(tag_key, tag_samples[-1])
                    tag_start = msgpack.loads(db.zrange(tag_key, tag_start_ind, tag_start_ind)[0])
                    tag_stop = msgpack.loads(db.zrange(tag_key, tag_stop_ind, tag_stop_ind)[0])
                    tag_start[1] = start_time
                    tag_start[2] = start_time * 10 ** 9
                    tag_stop[1] = stop_time
                    tag_stop[2] = stop_time * 10 ** 9
                    sensor_samples['Tag:' + tag] = [tag_start] + sensor_samples['Tag:' + tag] + [tag_stop]
                print(tag)
            images = db.zrangebyscore(user + ':images', start_time, stop_time, withscores=True)
            images = [x for _, x in images]
            ws.send('slice_data', user, event_start_time, start_time, stop_time, event_stop_time, sensor_samples, images)
        elif data[0] == 'tag':  # 'tag', user, time, tag, value
            db.zadd('%s:tag:%s' % (data[1], data[3]), data[2], msgpack.dumps([[data[4]], data[2], int(data[2] * 10**9)]))
            db.sadd('%s:tags' % user, data[3])
        elif data[0] == 'untag':  # 'untag', user, startTime, stopTime, tag
            db.zremrangebyscore('%s:tag:%s' % (data[1], data[4]), data[2], data[3])

if __name__ == '__main__':
    STATIC_FILES = {os.path.basename(x):open(x).read()
                    for x in glob.glob('static/*') if not os.path.isdir(x)}
    STATIC_FILES.update({os.path.basename(x):open(x).read()
                         for x in glob.glob('static/images/*')})
    TEMPLATE = open('static_private/template.html').read()
    setup()
    #quit()
    parse(websocket_callback, argparse.ArgumentParser())
