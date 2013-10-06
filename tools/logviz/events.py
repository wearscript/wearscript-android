import bisect
import json


def get_row_bounds(times, start_time, stop_time):
    # Left: >= time Right: <= time
    i = bisect.bisect_left(times, start_time)
    j = bisect.bisect_right(times, stop_time)
    return i, j


def get_event_sensors(rows, row_columns, start_time, stop_time, max_samples=None):
    """
    Returns:
        (event_sensors, sensor_names)
        event_sensors: Dict of type with value as a list of sensors
        sensor_names: Dict of type with value as name
    """
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
    if max_samples is not None:
        for t in event_sensors:
            if len(event_sensors[t]) < max_samples:
                continue
            skip = len(event_sensors[t]) / (max_samples - 1)
            event_sensors[t] = event_sensors[t][:-1:skip] + [event_sensors[t][-1]]
    return event_sensors, sensor_names
