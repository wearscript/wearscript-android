import argparse
import picarus
import cPickle as pickle


def detect_events(client, start_row, stop_row, max_event_delay=10., min_event_rows=30, max_event_rows=500):
    prev_time = 0
    time_column = 'meta:time'
    sensor_column = 'meta:sensors'
    event_boundaries = []
    event_rows = {}
    row_columns = {}
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
    print('Cache Bytes[%d]' % cache_bytes)
    event_rows = {k: v for k, v in event_rows.items() if len(v) > min_event_rows}
    print(event_boundaries)
    # Split events that are too big
    event_rows_split = {}
    for e in event_rows:
        cur_rows = event_rows[e]
        split_count = 0
        while cur_rows:
            esplit = '%s-%.3d' % (e, split_count)
            event_rows_split[esplit] = cur_rows[:max_event_rows]
            cur_rows = cur_rows[max_event_rows:]
            split_count += 1
    return event_rows_split, row_columns


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('model')
    parser.add_argument('email')
    parser.add_argument('api_key')
    parser.add_argument('prefix')
    ARGS = parser.parse_args()
    CLIENT = picarus.PicarusClient(email=ARGS.email, api_key=ARGS.api_key)
    ARGS.start_row = ARGS.prefix
    ARGS.stop_row = ARGS.prefix[:-1] + chr(ord(ARGS.prefix[-1]) + 1)
    EVENT_ROWS, ROW_COLUMNS = detect_events(CLIENT, ARGS.start_row, ARGS.stop_row)
    pickle.dump(('picarus', EVENT_ROWS, ROW_COLUMNS), open(ARGS.model, 'w'), -1)
