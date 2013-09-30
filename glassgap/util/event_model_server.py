import gevent
from gevent import monkey
monkey.patch_all()
from picarus_event_model import _local_data, _picarus_data
import bottle
import argparse
import picarus
import bisect
import cPickle as pickle
from events import get_row_bounds, get_event_sensors
try:
    from image_server.auth import verify
except ImportError:
    from static_server.auth import verify
from event_classification import classify_slice
import event_classification
bottle.debug(True)
import json


def generate_event(auth_key, event):
    out = []
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    duration = times[-1] - times[0]
    out.append('<h1><a href="event/%s">%s</a></h1><p>Num Rows: %d</p><p>Duration (min): %.2f</p><p>FPS: %.2f</p>' % (event, event, len(rows), duration / 60., len(rows) / duration))
    colors = ['00B25C', '0A67A3', 'FF8E00', 'FF4100']
    for x in range(8):
        out.append('<img width="%spx" class="thumb-range" src="/%s/thumb/%s/%f/%f/%d/%d">' % (ARGS.thumbwidth, auth_key, event, times[0], times[-1], 8, x))
    if ARGS.classify:
        for class_type, class_counts in EVENT_CLASSIFICATIONS_AGGREGATE[event].items():
            out.append(' '.join('<span style="color: #%s">%s</span>' % x for x in zip(colors, event_classification.CLASSES[class_type])))
            out.append('<span class="pie" data-colours=\'[%s]\' data-diameter="40">%s</span>' % (','.join('"#%s"' % x for x in colors), ','.join(map(str, class_counts))))
    return out


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/')
@verify
def main(auth_key):
    out = []
    template = open('static_private/picarus_event_explorer_template.html').read()
    for event in sorted(EVENT_ROWS):
        out += ['<div class="event">'] + generate_event(auth_key, event) + ['</div>']
    return template.replace('{{events}}', ''.join(out)).replace('{{chartValues}}', '{}').replace('{{AUTH_KEY}}', auth_key).replace('{{EVENT}}', event).replace('{{THUMBWIDTH}}', ARGS.thumbwidth)


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/thumb/<event>/<t>')
@verify
def thumb(auth_key, event, t):
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    # >= time
    i = bisect.bisect_left(times, float(t))
    print(i)
    if i != len(times):
        bottle.response.headers['Content-Type'] = 'image/jpeg'
        bottle.response.headers['Cache-Control'] = 'max-age=2592000'
        return CLIENT.get_row('images', rows[i], columns=[THUMB_COLUMN])[THUMB_COLUMN]
    bottle.abort(404)


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/thumb/<event>/<t0>/<t1>/<num>/<off>')
@verify
def thumb_range(auth_key, event, t0, t1, num, off):
    num = int(num)
    off = int(off)
    if not (0 < num <= 16):
        bottle.abort(400)
    if not (0 <= off < num):
        bottle.abort(400)
    t0f = float(t0)
    t1f = float(t1)
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    # Left: >= time Right: <= time
    i, j = get_row_bounds(times, t0f, t1f)
    print((i, j))
    if i != len(times) and j:
        rows = rows[i:j - 1]
        skip = 1
        if len(rows) > num:
            skip = len(rows) / num
        bottle.response.headers['Content-Type'] = 'image/jpeg'
        bottle.response.headers['Cache-Control'] = 'max-age=2592000'
        return CLIENT.get_row('images', rows[off * skip], columns=[THUMB_COLUMN])[THUMB_COLUMN]
    bottle.abort(404)


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/event/<event>')
@verify
def event(auth_key, event):
    out = []
    template = open('static_private/picarus_event_explorer_template.html').read()
    chart_count = 0
    chart_values = {}
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    event_sensors, sensor_names = get_event_sensors(rows, ROW_COLUMNS, times[0], times[-1])
    out += ['<div class="event">'] + generate_event(auth_key, event)
    for chart_num in [1, 2, 3, 4, 5, 9, 10, 11]:
        chart_id = 'chart_%d' % chart_count
        out.append('<h2>%s (%d)</h2><div id="%s"></div>' % (sensor_names[chart_num], chart_num, chart_id))
        chart_values[chart_id] = [[x['timestamp'] for x in event_sensors[chart_num]]] + zip(*[x['values'] for x in event_sensors[chart_num]])
        chart_count += 1
    out.append('</div>')
    return template.replace('{{events}}', ''.join(out)).replace('{{chartValues}}', json.dumps(chart_values)).replace('{{AUTH_KEY}}', auth_key).replace('{{EVENT}}', event).replace('{{THUMBWIDTH}}', ARGS.thumbwidth)


@bottle.route('/static/<path>')
def static(path):
    return bottle.static_file(path, './static/')
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--thumbwidth', default='150')
    parser.add_argument('--classify', action='store_true')
    subparsers = parser.add_subparsers()
    subparser = subparsers.add_parser('picarus')
    subparser.add_argument('model')
    subparser.add_argument('email')
    subparser.add_argument('api_key')
    subparser.set_defaults(func=_picarus_data)

    subparser = subparsers.add_parser('local')
    subparser.add_argument('model')
    subparser.add_argument('input_dir')
    subparser.set_defaults(func=_local_data)

    parser.add_argument('--port', help='Run on this port (default 8080)', default='8080')

    ARGS = parser.parse_args()
    CLIENT = ARGS.func(**vars(ARGS))
    data_type, EVENT_ROWS, ROW_COLUMNS = pickle.load(open(ARGS.model))
    EVENT_ROW_TIMES = {e: [float(ROW_COLUMNS[row]['meta:time']) for row in rows] for e, rows in EVENT_ROWS.items()}
    EVENT_CLASSIFICATIONS = {}  # [event_name] = list of (start_time, stop_time, classification results)
    for event_name, rows in EVENT_ROWS.items():
        EVENT_CLASSIFICATIONS[event_name] = list(classify_slice(rows, ROW_COLUMNS, EVENT_ROW_TIMES[event_name][0], EVENT_ROW_TIMES[event_name][-1]))
    # Compute aggregate event classifications
    EVENT_CLASSIFICATIONS_AGGREGATE = {}
    for event_name, classifications in EVENT_CLASSIFICATIONS.items():
        agg = EVENT_CLASSIFICATIONS_AGGREGATE[event_name] = {x: [0] * len(y) for x, y in event_classification.CLASSES.items()}
        for _, _, classification in classifications:
            for c, v in classification.items():
                agg[c][v] += 1
    print(EVENT_CLASSIFICATIONS_AGGREGATE)
    if ARGS.func == _local_data:
        THUMB_COLUMN = 'data:image'
    else:
        THUMB_COLUMN = 'thum:image_150sq'
    bottle.run(host='0.0.0.0', port=ARGS.port, server='gevent')
