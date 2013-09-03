import bisect
import json


def get_row_bounds(times, start_time, stop_time):
    # Left: >= time Right: <= time
    i = bisect.bisect_left(times, start_time)
    j = bisect.bisect_right(times, stop_time)
    return i, j


def get_event_sensors(rows, row_columns, start_time, stop_time):
    event_sensors = {}  # [type] = values
    sensor_names = {}  # [type] = name
    for row in rows:
        for s in json.loads(row_columns[row]['meta:sensors']):
            if not (start_time <= s['timestamp'] <= stop_time):
                continue
            event_sensors.setdefault(s['type'], []).append(s)
            sensor_names[s['type']] = s['name']
    for t in event_sensors:
        event_sensors[t].sort(key=lambda x: float(x['timestamp']))
    return event_sensors, sensor_names
