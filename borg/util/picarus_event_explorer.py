import gevent
from gevent import monkey
monkey.patch_all()
import bottle
import argparse
import picarus
import base64
import random
from image_server.auth import verify
bottle.debug(True)
import json


def generate_event(event):
    out = []
    rows = EVENT_ROWS[event]
    row_time = lambda x: float(ROW_COLUMNS[x]['meta:time'])
    thumb_column = 'thum:image_150sq'
    duration = (row_time(EVENT_ROWS[event][-1]) - row_time(EVENT_ROWS[event][0]))
    out.append('<h1><a href="event/%s">%s</a></h1><p>Num Rows: %d</p><p>Duration (min): %.2f</p><p>FPS: %.2f</p>' % (event, event, len(rows), duration / 60., len(rows) / duration))
    for r in sorted(random.sample(rows, min(16, len(rows)))):
        out.append('<img src="data:image/jpeg;base64,%s">' % base64.b64encode(CLIENT.get_row('images', r, columns=[thumb_column])[thumb_column]))
    return out


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/')
@verify
def main(auth_key):
    out = []
    template = open('static_private/picarus_event_explorer_template.html').read()
    for event in sorted(EVENT_ROWS):
        out += ['<div class="event">'] + generate_event(event) + ['</div>']
    return template.replace('{{events}}', ''.join(out)).replace('{{chartValues}}', '{}').replace('{{AUTH_KEY}}', auth_key)


@bottle.route('/:auth_key#[a-zA-Z0-9\_\-]+#/thumb/<t>')
@verify
def thumb(auth_key, t):
    row = ARGS.prefix + t
    thumb_column = 'thum:image_150sq'
    if not (ARGS.start_row < row < ARGS.stop_row):
        bottle.abort(404)
    for row, columns in CLIENT.scanner('images', row, ARGS.stop_row, columns=[thumb_column]):
        bottle.response.headers['Content-Type'] = 'image/jpeg'
        return columns[thumb_column]
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
    for row in rows:
        for s in json.loads(ROW_COLUMNS[row]['meta:sensors']):
            event_sensors.setdefault(s['type'], []).append(s)
            sensor_names[s['type']] = s['name']
    for t in event_sensors:
        event_sensors[t].sort(key=lambda x: float(x['timestamp']))
    out += ['<div class="event">'] + generate_event(event)
    for chart_num in [1, 2, 3, 4, 5, 9, 10, 11]:
        chart_id = 'chart_%d' % chart_count
        out.append('<h2>%s (%d)</h2><div id="%s"></div>' % (sensor_names[chart_num], chart_num, chart_id))
        chart_values[chart_id] = [[x['timestamp'] for x in event_sensors[chart_num]]] + zip(*[x['values'] for x in event_sensors[chart_num]])
        chart_count += 1
    out.append('</div>')
    return template.replace('{{events}}', ''.join(out)).replace('{{chartValues}}', json.dumps(chart_values)).replace('{{AUTH_KEY}}', auth_key)


@bottle.route('/static/<path>')
def static(path):
    return bottle.static_file(path, './static/')


def detect_events(client, start_row, stop_row, max_event_delay=10., min_event_rows=30):
    prev_time = 0
    time_column = 'meta:time'
    sensor_column = 'meta:sensors'
    event_boundaries = []
    event_rows = {}
    row_columns = {}
    cache_bytes = 0
    for row, columns in client.scanner('images', start_row=start_row, stop_row=stop_row, columns=[time_column, sensor_column]):
        cache_bytes += sum([len(x) for x in columns.values()])
        cur_time = float(columns[time_column])
        row_columns[row] = columns
        diff = cur_time - prev_time
        if diff > max_event_delay or not event_boundaries:
            event_boundaries.append(row)
            print((diff, cur_time))
        prev_time = cur_time
        event_rows.setdefault(event_boundaries[-1], []).append(row)
    print('Cache Bytes[%d]' % cache_bytes)
    event_rows = {k: v for k, v in event_rows.items() if len(v) > min_event_rows}
    print(event_boundaries)
    print(sorted([(x, len(y)) for x, y in event_rows.items()]))
    return event_rows, row_columns
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('email')
    parser.add_argument('api_key')
    parser.add_argument('prefix')
    parser.add_argument('--port', type=str, help='Run on this port (default 8080)', default='8080')
    ARGS = parser.parse_args()
    CLIENT = picarus.PicarusClient(email=ARGS.email, api_key=ARGS.api_key)
    ARGS.start_row = ARGS.prefix
    ARGS.stop_row = ARGS.prefix[:-1] + chr(ord(ARGS.prefix[-1]) + 1)
    EVENT_ROWS, ROW_COLUMNS = detect_events(CLIENT, ARGS.start_row, ARGS.stop_row)
    bottle.run(host='0.0.0.0', port=ARGS.port, server='gevent')
