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


def detect_events(client, start_row, stop_row, max_event_delay=10., min_event_rows=30, max_event_rows=500):
    prev_time = 0
    time_column = 'meta:time'
    sensor_column = 'meta:sensors'
    event_boundaries = []
    event_rows = {}
    row_columns = {}
    event_row_times = {}
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
        event_row_times.setdefault(event_boundaries[-1], []).append(cur_time)
    print('Cache Bytes[%d]' % cache_bytes)
    event_rows = {k: v for k, v in event_rows.items() if len(v) > min_event_rows}
    print(event_boundaries)
    # Split events that are too big
    event_rows_split = {}
    event_row_times_split = {}
    for e in event_rows:
        cur_rows = event_rows[e]
        cur_times = event_row_times[e]
        split_count = 0
        while cur_rows:
            esplit = '%s-%.3d' % (e, split_count)
            event_rows_split[esplit] = cur_rows[:max_event_rows]
            event_row_times_split[esplit] = cur_times[:max_event_rows]
            cur_rows = cur_rows[max_event_rows:]
            cur_times = cur_times[max_event_rows:]
            split_count += 1
    print(sorted([(x, len(y)) for x, y in event_rows_split.items()]))
    return event_rows_split, row_columns, event_row_times_split


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('email')
    parser.add_argument('api_key')
    parser.add_argument('prefix')
    parser.add_argument('--port', help='Run on this port (default 8080)', default='8080')
    parser.add_argument('--dump', help='Dump data to this path')
    ARGS = parser.parse_args()
    CLIENT = picarus.PicarusClient(email=ARGS.email, api_key=ARGS.api_key)
    ARGS.start_row = ARGS.prefix
    ARGS.stop_row = ARGS.prefix[:-1] + chr(ord(ARGS.prefix[-1]) + 1)
    EVENT_ROWS, ROW_COLUMNS, EVENT_ROW_TIMES = detect_events(CLIENT, ARGS.start_row, ARGS.stop_row)
    if ARGS.dump:
        pickle.dump({'event_rows': EVENT_ROWS, 'row_columns': ROW_COLUMNS}, open(ARGS.dump, 'w'), -1)
    bottle.run(host='0.0.0.0', port=ARGS.port, server='gevent')
