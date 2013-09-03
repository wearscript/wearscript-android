import pickle
import argparse
import picarus
import numpy as np
from borg_events import get_row_bounds, get_event_sensors

DATA = {}

MOVEMENT_DATA = {'biking': [], 'walking': [], 'driving': [], 'still': []}

# Biking: Actively peddeling a bike
MOVEMENT_DATA['biking'].append({"event": "glassborg:1377458315268-000", "start": 1377458378.317, "stop": 1377458515.317})
MOVEMENT_DATA['biking'].append({"event": "glassborg:1377458315268-000", "start": 1377458550.317, "stop": 1377458607.317})
MOVEMENT_DATA['biking'].append({"event": "glassborg:1377458315268-000", "start": 1377458640.317, "stop": 1377458675.945})

# Still: Primarily looking in the same direction with no major body motion.  When using a laptop or watching TV this would be expected.
MOVEMENT_DATA['still'].append({"event": "glassborg:1377376295799-000", "start": 1377376296.911, "stop": 1377376312.911})
MOVEMENT_DATA['still'].append({"event": "glassborg:1377376406181-000", "start": 1377376539.267, "stop": 1377376611.202})
MOVEMENT_DATA['still'].append({"event": "glassborg:1377376664761-000", "start": 1377376668.767, "stop": 1377376837.767})
MOVEMENT_DATA['still'].append({"event": "glassborg:1377378367026-000", "start": 1377378524.063, "stop": 1377378930.063})

# Walking: User is actively walking
MOVEMENT_DATA['walking'].append({"event": "glassborg:1377558445074-000", "start": 1377558452.139, "stop": 1377558588.139})
MOVEMENT_DATA['walking'].append({"event": "glassborg:1377558445074-001", "start": 1377558920.165, "stop": 1377558981.165})
MOVEMENT_DATA['walking'].append({"event": "glassborg:1377641539721-000", "start": 1377641572.792, "stop": 1377641692.792})

# Driving: User is driving a car that is in motion
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-000", "start": 1377705060.283, "stop": 1377705179.283})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-000", "start": 1377704968.283, "stop": 1377705011.283})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-001", "start": 1377705298.443, "stop": 1377705399.443})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-001", "start": 1377705452.443, "stop": 1377705595.443})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-002", "start": 1377705823.315, "stop": 1377705874.315})


SCENE_DATA = {'indoors': [], 'outdoors': []}
SCENE_DATA['indoors'].append({"event": "glassborg:1377376664761-000", "start": 1377376673.767, "stop": 1377376930.767})
SCENE_DATA['indoors'].append({"event": "glassborg:1377722265384-000", "start": 1377722271.402, "stop": 1377722475.402})
SCENE_DATA['indoors'].append({"event": "glassborg:1377729730420-000", "start": 1377729731.522, "stop": 1377729764.522})
SCENE_DATA['indoors'].append({"event": "glassborg:1377641539721-000", "start": 1377641717.792, "stop": 1377641827.792})

SCENE_DATA['outdoors'].append({"event": "glassborg:1377458315268-000", "start": 1377458322.317, "stop": 1377458668.317})
SCENE_DATA['outdoors'].append({"event": "glassborg:1377559153505-000", "start": 1377559155.589, "stop": 1377559242.589})
SCENE_DATA['outdoors'].append({"event": "glassborg:1377641539721-000", "start": 1377641545.792, "stop": 1377641706.792})
SCENE_DATA['outdoors'].append({"event": "glassborg:1377637407861-000", "start": 1377637422.892, "stop": 1377637767.892})


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
    for d in [MOVEMENT_DATA]:  # SCENE_DATA,
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
