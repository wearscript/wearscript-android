import gevent
from gevent import monkey
monkey.patch_all()
import bottle
import argparse
import picarus
import bisect
import cPickle as pickle
from image_server.auth import verify
bottle.debug(True)
import json


def generate_event(auth_key, event):
    out = []
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    duration = times[-1] - times[0]
    out.append('<h1><a href="event/%s">%s</a></h1><p>Num Rows: %d</p><p>Duration (min): %.2f</p><p>FPS: %.2f</p>' % (event, event, len(rows), duration / 60., len(rows) / duration))
    for x in range(8):
        out.append('<img class="thumb-range" src="/%s/thumb/%s/%f/%f/%d/%d">' % (auth_key, event, times[0], times[-1], 8, x))
    return out


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/')
@verify
def main(auth_key):
    out = []
    template = open('static_private/picarus_event_explorer_template.html').read()
    for event in sorted(EVENT_ROWS):
        out += ['<div class="event">'] + generate_event(auth_key, event) + ['</div>']
    return template.replace('{{events}}', ''.join(out)).replace('{{chartValues}}', '{}').replace('{{AUTH_KEY}}', auth_key).replace('{{EVENT}}', event)


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/thumb/<event>/<t>')
@verify
def thumb(auth_key, event, t):
    thumb_column = 'thum:image_150sq'
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    # >= time
    i = bisect.bisect_left(times, float(t))
    print(i)
    if i != len(times):
        bottle.response.headers['Content-Type'] = 'image/jpeg'
        bottle.response.headers['Cache-Control'] = 'max-age=2592000'
        return CLIENT.get_row('images', rows[i], columns=[thumb_column])[thumb_column]
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
    thumb_column = 'thum:image_150sq'
    rows = EVENT_ROWS[event]
    times = EVENT_ROW_TIMES[event]
    # Left: >= time Right: <= time
    i = bisect.bisect_left(times, t0f)
    j = bisect.bisect_right(times, t1f)
    print((i, j))
    if i != len(times) and j:
        rows = rows[i:j - 1]
        skip = 1
        if len(rows) > num:
            skip = len(rows) / num
        bottle.response.headers['Content-Type'] = 'image/jpeg'
        bottle.response.headers['Cache-Control'] = 'max-age=2592000'
        return CLIENT.get_row('images', rows[off * skip], columns=[thumb_column])[thumb_column]
    bottle.abort(404)


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/event/<event>')
@verify
def event(auth_key, event):
    out = []
    template = open('static_private/picarus_event_explorer_template.html').read()
    chart_count = 0
    chart_values = {}
    rows = EVENT_ROWS[event]
    event_sensors = {}  # [type] = values
    sensor_names = {}  # [type] = name
    times = EVENT_ROW_TIMES[event]
    for row in rows:
        for s in json.loads(ROW_COLUMNS[row]['meta:sensors']):
            if not (times[0] <= s['timestamp'] <= times[-1]):
                continue
            event_sensors.setdefault(s['type'], []).append(s)
            sensor_names[s['type']] = s['name']
    for t in event_sensors:
        event_sensors[t].sort(key=lambda x: float(x['timestamp']))
    out += ['<div class="event">'] + generate_event(auth_key, event)
    for chart_num in [1, 2, 3, 4, 5, 9, 10, 11]:
        chart_id = 'chart_%d' % chart_count
        out.append('<h2>%s (%d)</h2><div id="%s"></div>' % (sensor_names[chart_num], chart_num, chart_id))
        chart_values[chart_id] = [[x['timestamp'] for x in event_sensors[chart_num]]] + zip(*[x['values'] for x in event_sensors[chart_num]])
        chart_count += 1
    out.append('</div>')
    return template.replace('{{events}}', ''.join(out)).replace('{{chartValues}}', json.dumps(chart_values)).replace('{{AUTH_KEY}}', auth_key).replace('{{EVENT}}', event)


@bottle.route('/static/<path>')
def static(path):
    return bottle.static_file(path, './static/')

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('model')
    parser.add_argument('email')
    parser.add_argument('api_key')
    parser.add_argument('--port', help='Run on this port (default 8080)', default='8080')

    ARGS = parser.parse_args()
    CLIENT = picarus.PicarusClient(email=ARGS.email, api_key=ARGS.api_key)
    data_type, EVENT_ROWS, ROW_COLUMNS = pickle.load(open(ARGS.model))
    EVENT_ROW_TIMES = {e: [float(ROW_COLUMNS[row]['meta:time']) for row in rows] for e, rows in EVENT_ROWS.items()}
    bottle.run(host='0.0.0.0', port=ARGS.port, server='gevent')
