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


def b64dir(input_dir, output_dir, **kw):
    for fn in glob.glob(input_dir + '/*.jpg'):
        row = 'glassborg:' + os.urandom(10)
        rowub64 = base64.urlsafe_b64encode(row)
        row_dir = output_dir + '/' + rowub64
        os.makedirs(row_dir)
        shutil.copy(fn, row_dir + '/' + base64.urlsafe_b64encode('data:image'))
        open(row_dir + '/' + base64.urlsafe_b64encode('meta:filename'), 'w').write(os.path.basename(fn))


def adb_pull(output_dir, **kw):
    c = 'adb pull sdcard/borg/data/ %s' % output_dir
    subprocess.call(c.split())


def adb_rmr(**kw):
    c = 'adb shell rm -r sdcard/borg/data/'
    subprocess.call(c.split())


def adb_ls(**kw):
    c = 'adb shell ls -l sdcard/borg/data/'
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


def picarusdir(input_dir, email, api_key, prefix, max_sensor_radius=2, **kw):
    sensors = []
    max_sensor_time = 0
    sensor_sample_hist = {}  # [type][count]
    total_images = 0
    import picarus
    client = picarus.PicarusClient(email=email, api_key=api_key)
    for fn in sorted(glob.glob(input_dir + '/*.js')):
        print(fn)
        try:
            data = json.load(open(fn))
        except ValueError:
            print('Could not parse [%s]' % fn)
            continue
        sensors += data['sensors']
        if 'imageb64' in data:
            total_images += 1
            update_sensor_count(sensors, sensor_sample_hist)
            print(sensor_sample_hist)
            for s in sensors:
                sensor_time = data['Tsave'] - s['timestamp']
                if sensor_time > max_sensor_radius:
                    continue
                max_sensor_time = max(max_sensor_time, sensor_time)
            print('NumSensors[%d]' % len(sensors))
            client.patch_row('images', '%s%d' % (prefix, data['Tsave'] * 1000), {'data:image': base64.b64decode(data['imageb64']),
                                                                                 'meta:filename': os.path.basename(fn),
                                                                                 'meta:sensors': json.dumps(sensors),
                                                                                 'meta:time': json.dumps(data['Tsave'])})
            sensors = []
    print('NumSensors At End[%d]' % len(sensors))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

    subparser = subparsers.add_parser('images')
    subparser.add_argument('input_dir')
    subparser.set_defaults(func=load_images)

    subparser = subparsers.add_parser('b64dir')
    subparser.add_argument('input_dir')
    subparser.add_argument('output_dir')
    subparser.set_defaults(func=b64dir)

    subparser = subparsers.add_parser('adb_pull')
    subparser.add_argument('output_dir')
    subparser.set_defaults(func=adb_pull)

    subparser = subparsers.add_parser('adb_ls')
    subparser.set_defaults(func=adb_ls)

    subparser = subparsers.add_parser('adb_rmr')
    subparser.set_defaults(func=adb_rmr)

    subparser = subparsers.add_parser('picarusdir')
    subparser.add_argument('input_dir')
    subparser.add_argument('email')
    subparser.add_argument('api_key')
    subparser.add_argument('prefix')
    subparser.set_defaults(func=picarusdir)

    args = parser.parse_args()
    args.func(**vars(args))
