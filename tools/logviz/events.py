import bisect
import json
import msgpack


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
    sensor_types = {}  # [name] = type
    for row in rows:
        print(row_columns[row].keys())
        try:
            sensor_types.update(msgpack.loads(row_columns[row]['meta:sensor_types']))
        except KeyError:
            continue
        for sensor_name, samples in msgpack.loads(row_columns[row]['meta:sensor_samples']).items():
            sensor_type = sensor_types[sensor_name]
            for s in samples:
                if not (start_time <= s[1] <= stop_time):
                    continue
                event_sensors.setdefault(sensor_type, []).append(s)
    sensor_names = {v: k for k, v in sensor_types.items()}  # [type] = name
    for t in event_sensors:
        event_sensors[t].sort(key=lambda x: x[1])
    if max_samples is not None:
        for t in event_sensors:
            if len(event_sensors[t]) < max_samples:
                continue
            skip = len(event_sensors[t]) / (max_samples - 1)
            event_sensors[t] = event_sensors[t][:-1:skip] + [event_sensors[t][-1]]
    return event_sensors, sensor_names
