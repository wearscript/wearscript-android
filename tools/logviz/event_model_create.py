import argparse
import msgpack
import cPickle as pickle
from picarus_local import PicarusClientLocal


def detect_events(client, start_row, stop_row, max_event_delay=10., min_event_rows=30, max_event_rows=None):
    """Take in a contiguous rowspace and segment events, producing the events and a cache of their column data
    
    Returns:
        (event_rows, row_columns)
        event_rows: Dict of events with keys as their first row and value as a list of all rows (sorted)
        row_columns: Dict with the row as the key and dict of columns/values
    """
    prev_time = 0
    time_column = 'meta:time'
    event_boundaries = []
    event_rows = {}
    row_columns = {}
    cache_bytes = 0
    for row, columns in client.scanner('images', start_row=start_row, stop_row=stop_row, columns=[time_column, 'meta:sensor_samples', 'meta:sensor_types']):
        cache_bytes += sum([len(x) for x in columns.values()])
        cur_time = msgpack.loads(columns[time_column])
        row_columns[row] = columns
        diff = cur_time - prev_time
        if diff > max_event_delay or not event_boundaries:
            event_boundaries.append(row)
        prev_time = cur_time
        event_rows.setdefault(event_boundaries[-1], []).append(row)
    print('Cache Bytes[%d]' % cache_bytes)
    event_rows = {k: v for k, v in event_rows.items() if len(v) >= min_event_rows}
    # Split events that are too big
    if max_event_rows is not None:
        event_rows_split = {}
        for e in event_rows:
            cur_rows = event_rows[e]
            split_count = 0
            while cur_rows:
                esplit = '%s-%.3d' % (e, split_count)
                event_rows_split[esplit] = cur_rows[:max_event_rows]
                cur_rows = cur_rows[max_event_rows:]
                split_count += 1
        event_rows = event_rows_split
    return event_rows, row_columns


def _picarus_data(email, api_key, **kw):
    import picarus
    return picarus.PicarusClient(email=email, api_key=api_key)


def _local_data(input_dir, **kw):
    return PicarusClientLocal(table_dirs={'images': input_dir})

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()
    subparser = subparsers.add_parser('picarus')
    subparser.add_argument('model')
    subparser.add_argument('email')
    subparser.add_argument('api_key')
    subparser.add_argument('prefix')
    subparser.set_defaults(func=_picarus_data)

    subparser = subparsers.add_parser('local')
    subparser.add_argument('model')
    subparser.add_argument('input_dir')
    subparser.add_argument('--prefix')
    subparser.set_defaults(func=_local_data)
    
    ARGS = parser.parse_args()
    if ARGS.prefix:
        ARGS.start_row = ARGS.prefix
        ARGS.stop_row = ARGS.prefix[:-1] + chr(ord(ARGS.prefix[-1]) + 1)
    else:
        ARGS.start_row = None
        ARGS.stop_row = None
    CLIENT = ARGS.func(**vars(ARGS))
    EVENT_ROWS, ROW_COLUMNS = detect_events(CLIENT, ARGS.start_row, ARGS.stop_row)
    pickle.dump(('picarus', EVENT_ROWS, ROW_COLUMNS), open(ARGS.model, 'w'), -1)
