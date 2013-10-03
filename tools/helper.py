import base64
import json
import glob
import os
import argparse
import shutil
import subprocess


def load_images(input_dir, **kw):
    for fn in glob.glob(input_dir + '/*.js'):
        try:
            try:
                image = base64.b64decode(json.load(open(fn))['imageb64'])
            except KeyError:
                continue
            open(input_dir + '/' + os.path.basename(fn) + '.jpg', 'w').write(image)
        except:
            print('Error[%s]: Skipping' % fn)


def adb_pull(output_dir, **kw):
    c = 'adb pull sdcard/wearscript/data/ %s' % output_dir
    subprocess.call(c.split())


def adb_rmr(**kw):
    c = 'adb shell rm -r sdcard/wearscript/data/'
    subprocess.call(c.split())


def adb_ls(**kw):
    c = 'adb shell ls -l sdcard/wearscript/data/'
    subprocess.call(c.split())


def update_sensor_count(sensors, total_counts):
    counts = {}
    for s in sensors:
        try:
            counts[s['type']] += 1
        except KeyError:
            counts[s['type']] = 1
    for t, c in counts.items():
        total_type_c = total_counts.setdefault(t, {})
        try:
            total_type_c[c] += 1
        except KeyError:
            total_type_c[c] = 1


def picarus_store(email, api_key, prefix, **kw):
    import picarus
    client = picarus.PicarusClient(email=email, api_key=api_key)
    for row, columns in load_dir(**kw):
        client.patch_row('images', prefix + row, columns)


def local_store(output_dir, **kw):
    try:
        os.makedirs(output_dir)
    except OSError:
        pass
    for row, columns in load_dir(**kw):
        row_dir = os.path.join(output_dir, base64.urlsafe_b64encode(row))
        try:
            os.makedirs(row_dir)
        except OSError:
            pass
        for k, v in columns.items():
            open(os.path.join(row_dir, base64.urlsafe_b64encode(k)), 'wb').write(v)


def load_dir(input_dir, max_sensor_radius=2, **kw):
    sensors = []
    sensor_sample_hist = {}  # [type][count]
    for fn in sorted(glob.glob(input_dir + '/*.js')):
        print(fn)
        try:
            data = json.load(open(fn))
        except ValueError:
            print('Could not parse [%s]' % fn)
            continue
        sensors += data['sensors']
        if 'imageb64' in data:
            update_sensor_count(sensors, sensor_sample_hist)
            print(sensor_sample_hist)
            for s in sensors:
                sensor_time = data['Tsave'] - s['timestamp']
                if sensor_time > max_sensor_radius:
                    continue
            print('NumSensors[%d]' % len(sensors))
            yield str(data['Tsave'] * 1000), {'data:image': base64.b64decode(data['imageb64']),
                                              'meta:filename': os.path.basename(fn),
                                              'meta:sensors': json.dumps(sensors),
                                              'meta:time': json.dumps(data['Tsave'])}
            sensors = []
    print('NumSensors At End[%d]' % len(sensors))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

    subparser = subparsers.add_parser('images')
    subparser.add_argument('input_dir')
    subparser.set_defaults(func=load_images)

    subparser = subparsers.add_parser('adb_pull')
    subparser.add_argument('output_dir')
    subparser.set_defaults(func=adb_pull)

    subparser = subparsers.add_parser('adb_ls')
    subparser.set_defaults(func=adb_ls)

    subparser = subparsers.add_parser('adb_rmr')
    subparser.set_defaults(func=adb_rmr)

    subparser = subparsers.add_parser('picarus_store')
    subparser.add_argument('input_dir')
    subparser.add_argument('email')
    subparser.add_argument('api_key')
    subparser.add_argument('prefix')
    subparser.set_defaults(func=picarus_store)

    subparser = subparsers.add_parser('local_store')
    subparser.add_argument('input_dir')
    subparser.add_argument('output_dir')
    subparser.set_defaults(func=local_store)

    args = parser.parse_args()
    args.func(**vars(args))
