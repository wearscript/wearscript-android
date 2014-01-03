import base64
import msgpack
import glob
import os
import argparse
import shutil
import subprocess


def adb_pull(output_dir, **kw):
    c = 'adb pull sdcard/wearscript/data/ %s' % output_dir
    subprocess.call(c.split())


def adb_rmr(**kw):
    c = 'adb shell rm sdcard/wearscript/data/*'
    subprocess.call(c.split())


def adb_ls(**kw):
    c = 'adb shell ls -l sdcard/wearscript/data/'
    subprocess.call(c.split())


def update_sensor_count(sensors, total_counts):
    for name, ss in sensors.items():
        try:
            total_counts[name] += len(ss)
        except KeyError:
            total_counts[name] = len(ss)


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

def redis_store(input_dir, name, server, port, **kw):
    import redis
    r = redis.StrictRedis(server, port)
    sensor_types = {}
    fn_to_time = lambda x: int(x.rsplit('/', 1)[-1].split('.', 1)[0])
    r.sadd('users', name)
    for fn in sorted(glob.glob(input_dir + '/*'), key=fn_to_time):
        fn_time = fn_to_time(fn) / 1000.
        if fn.endswith('.jpg'):
            r.zadd(name + ':times', fn_time, msgpack.dumps(fn_time))
            r.zadd(name + ':images', fn_time, os.path.basename(fn))
        else:
            try:
                data = msgpack.load(open(fn))
            except ValueError:
                print('Could not parse [%s]' % fn)
                continue
            for sensor_name, type_num in data[2].items():
                sensor_types[sensor_name] = msgpack.dumps(type_num)
            for sensor_name, samples in data[3].items():
                for sample in samples:
                    r.zadd(name + ':times', sample[1], msgpack.dumps(sample[1]))
                    r.zadd(name + ':sensor:' + sensor_name, sample[1], msgpack.dumps(sample))
    r.hmset(name + ':sensors', sensor_types)

def load_dir(input_dir, max_sensor_radius=2, **kw):
    sensor_samples = {}
    sensor_types = {}
    sensor_sample_hist = {}  # [name][count]
    fn_to_time = lambda x: int(x.rsplit('/', 1)[-1].split('.', 1)[0])
    for fn in sorted(glob.glob(input_dir + '/*'), key=fn_to_time):
        fn_time = fn_to_time(fn) / 1000.
        print(fn)
        if fn.endswith('.jpg'):
            print(sensor_types)
            print(sensor_samples)
            print(sensor_sample_hist)

            for name in sensor_samples.keys():
                sensor_samples[name] = [s for s in sensor_samples[name] if abs(s[1] - fn_time) < max_sensor_radius]
            update_sensor_count(sensor_samples, sensor_sample_hist)
            sensor_types = {k: v for k, v in sensor_types.items() if k in sensor_samples}
            yield str(fn_time * 1000), {'data:image': open(fn).read(),
                                        'meta:filename': os.path.basename(fn),
                                        'meta:sensor_samples': msgpack.dumps(sensor_samples),
                                        'meta:sensor_types': msgpack.dumps(sensor_types),
                                        'meta:time': msgpack.dumps(fn_time)}
            sensor_samples = {}
            sensor_types = {}
        else:
            try:
                data = msgpack.load(open(fn))
            except ValueError:
                print('Could not parse [%s]' % fn)
                continue
            print(data)
            for name, samples in data[3].items():
                sensor_samples.setdefault(name, []).extend(samples)
            for name, type_num in data[2].items():
                sensor_types[name] = type_num
        print(sensor_sample_hist)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

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

    subparser = subparsers.add_parser('redis_store')
    subparser.add_argument('input_dir')
    subparser.add_argument('name')
    subparser.add_argument('--server', default='localhost')
    subparser.add_argument('--port', type=int, default=6379)
    subparser.set_defaults(func=redis_store)

    args = parser.parse_args()
    args.func(**vars(args))
