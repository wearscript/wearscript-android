import msgpack
import glob
import json
import numpy as np
import numpy.linalg


def consolidate(dump):
    pts = {}
    for x in glob.glob(dump + '/*.msgpack'):
        msg = msgpack.load(open(x))
        if msg[0] == 'sensors':
            print(msg)
            for x in msg[3].get('Pupil Point', []):
                if int(x[0][0]) == -1:
                    continue
                pts.setdefault(int(x[0][0]), []).append([x[0][2], x[0][1], x[0][4], x[0][3]])
    params = []
    for k, vs in sorted(pts.items()):
        p = np.array(vs)[:, 2:]
        print(p)
        params.append([np.mean(p, 0).tolist(), np.cov(p.T).tolist(), p.tolist()])
        print(params[-1][0])
        print(params[-1][1])
    open('calib.js', 'w').write(json.dumps(params))

if __name__ == '__main__':
    consolidate('dump_square11')
