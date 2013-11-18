import numpy as np
import matplotlib.pyplot as mp
import msgpack
import glob
import argparse

def main(path):
    sensor_time_values = {'Pupil Eyetracker': {}, 'LTR-506ALS Light sensor': {}}
    for fn in glob.glob(path + '/*.msgpack'):
        s = msgpack.load(open(fn))
        for k, vs in s[3].items():
            for v in vs:
                if k == 'Pupil Eyetracker':
                    sensor_time_values[k][v[1]] = v[0][2]
                elif k == 'LTR-506ALS Light sensor':
                    sensor_time_values[k][v[1]] = v[0][0]
    mp.ion()
    mp.show()
    for k, vs in sensor_time_values.items():
        if k == 'Pupil Eyetracker':
            c = [0, 1, 0]
        elif k == 'LTR-506ALS Light sensor':
            c = [1, 0, 0]
        va = np.array(vs.values())
        M = np.max(va)
        m = np.min(va)
        s = 1. / (M - m)
        prev_x = 0
        xs = []
        ys = []
        for x, y in sorted(vs.items()):
            if x - prev_x < .25:
                continue
            xs.append(x)
            ys.append(y)
            prev_x = x
        mp.plot(np.array(xs) - xs[0], (np.array(ys) - m) * s, c=c, label=k)
    mp.title('Pupil Radius and Ambient Light over Time')
    mp.legend()
    mp.draw()
    mp.savefig('pupil_light_plot.png')

if __name__ == '__main__':
    main('server_out11')
