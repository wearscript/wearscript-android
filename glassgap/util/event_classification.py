import pickle
import argparse
import picarus
import numpy as np
import json
from event_training_data import DATA
from events import get_row_bounds, get_event_sensors


def fft_power_feature(sensors):
    a = np.abs(np.fft.fft(sensors[10][:, 2]))
    a = np.max(a * a)
    print(a)
    return a


def accel_mean_feature(sensors):
    print(('mean', np.mean(np.abs(sensors[10][:, 2]))))
    print(('median', np.median(np.abs(sensors[10][:, 2]))))
    print(('std', np.std(sensors[10][:, 2])))
    #a = np.abs(np.fft.fft(sensors[10][:, 2]))
    #print(np.max(a * a))
    #print(sensors[10][:, 2].tolist())


def light_sensor_feature(sensors):
    print(np.median(sensors[5][:, 1]))
    #print(sensors[10][:, 2].tolist())

CLASSES = {'locomotion': ['walking', 'still', 'driving', 'biking']}


def locomotion_classifier(sensors):
    if fft_power_feature(sensors) >= 10000:
        return 0
    accel_std = np.std(sensors[10][:, 2])
    if accel_std < .25:
        return 1
    if accel_std < .9:
        return 2
    return 3


def classify_sensors(sensor_values, window_size=10):
    if not len(sensor_values):
        return
    start_time = min(sensor_values[tp][0, 0] for tp in sensor_values)
    stop_time = max(sensor_values[tp][-1, 0] for tp in sensor_values)
    for t in np.arange(start_time, stop_time - window_size, window_size):
        slice_sensor_values = {}
        for tp in sensor_values:
            i = np.searchsorted(sensor_values[tp][:, 0], t)
            j = np.searchsorted(sensor_values[tp][:, 0], t + window_size)
            slice_sensor_values[tp] = sensor_values[tp][i:j, :]
        yield t, t + window_size, {'locomotion': locomotion_classifier(slice_sensor_values)}


def classify_slice(rows, row_columns, start_time, stop_time, window_size=10):
    sensors, sensor_names = get_event_sensors(rows, row_columns, start_time, stop_time)
    sensor_values = {k: np.array([[v['timestamp']] + v['values'] for v in vs]) for k, vs in sensors.items()}
    return classify_sensors(sensor_values)
    #print({k: len(v) for k, v in event_sensor_values.items()})
    #accel_mean_feature(event_sensor_values)
    #fft_power_feature(event_sensor_values)
    #print walking_classifier(event_sensor_values)
    #print((still_classifier(event_sensor_values), biking_classifier(event_sensor_values), driving_classifier(event_sensor_values)))
    #light_sensor_feature(event_sensor_values)
    #print(event_sensor_values.values()[0][:10])
    #print(event_sensors.keys())


def extract_data():
    global event_sensor_values
    for d in [DATA['movement']]:  # DATA['scene']
        cm = {x: {y: 0 for y in d.keys()} for x in d.keys()}  # [true][pred]
        for class_name, slices in d.items():
            print(class_name)
            for s in slices:
                event = s['event']
                row_start, row_stop = get_row_bounds(EVENT_ROW_TIMES[event], s['start'], s['stop'])
                times = EVENT_ROW_TIMES[event][row_start:row_stop]
                for _, _, cn in classify_slice(EVENT_ROWS[event][row_start:row_stop], ROW_COLUMNS, times[0], times[-1]):
                    # TODO: Need to fix for other types
                    c = CLASSES['locomotion'][cn['locomotion']]
                    print((class_name, c))
                    cm[class_name][c] += 1
            print(cm)

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
    extract_data()
