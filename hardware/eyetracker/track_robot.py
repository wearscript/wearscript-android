import gevent.monkey
gevent.monkey.patch_all()
import cv2
import wearscript
import argparse
import numpy as np
import servo
from track import pupil_iter, debug_iter

def scale(d, m, M):
    return (min(max(d, m), M) - m) / (M - m)


def main():
    def callback(ws, **kw):
        print('Got args[%r]' % (kw,))
        print('Demo callback, prints all inputs and sends nothing')
        run = [None]
        kw.update(PARAMS)
        import servo
        def background():
            alpha = 1
            v = None
            scrollMin = 0
            scrollMax = 1200
            while True:
                data = ws.receive()
                if data[0] == 'blob' and data[1] == 'audio':
                    continue
                    m = .4
                    M = .75
                    d = float(data[2])
                    if not np.isfinite(d):
                        continue
                    d = scale(d, m, M)
                    if v is None:
                        v = d
                    v = (1 - alpha) * v + alpha  * d
                    print((d, v))
                    #servo.mouth(v)
                    #gevent.sleep(.05)
                elif data[0] == 'blob' and data[1] == 'scroll':
                    print(data)
                    #servo.mouth(scale(float(data[2]), scrollMin, scrollMax))
                elif data[0] == 'blob' and data[1] == 'finger' and data[2] == '+':
                    servo.mouth(1)
                elif data[0] == 'blob' and data[1] == 'finger' and data[2] == '-':
                    servo.mouth(0)
                elif data[0] == 'sensors':
                    continue
                    #for sample in data[3].get('MPL Orientation', []):
                    #    servo.mouth(sample[0][0] / 360)
                    print(data)
                    for sample in data[3].get('LTR-506ALS Light sensor', []):
                        d = sample[0][0]
                        d = scale(d, 5, 175)
                        print('Light: ' + str(d))
                        #servo.mouth(d)
                    #for sample in data[3].get('MPL Orientation', []):
                    #    servo.mouth(sample[0][0] / 360)
                else:
                    pass
                    #print(data)
                #gevent.sleep(.01)
        gevent.spawn(background)
        while run[0] != 'QUIT':
            for box, frame, hull, timestamp in pupil_iter(**kw):
                if kw.get('debug'):
                    run[0] = debug_iter(box, frame, hull, timestamp)
                if run[0]:
                    break
                if box is None:
                    continue
                eyex = scale(box[0][0], 170, 440)
                eyey = scale(box[0][1], 95, 278)
                servo.eye_x(eyex)
                servo.eye_y(1 - eyey)
                #ws.send('sensors', 'Pupil Eyetracker', {'Pupil Eyetracker': -2}, {'Pupil Eyetracker': [[[box[0][1], box[0][0], max(box[1][0], box[1][1])], time.time(), int(time.time() * 1000000000)]]})
    parser = argparse.ArgumentParser()
    parser.add_argument('--dump')
    parser.add_argument('--load')
    parser.add_argument('--command_thresh', type=int, default=6)
    parser.add_argument('--calib')
    parser.add_argument('--plot', action='store_true')
    parser.add_argument('--debug', action='store_true')
    wearscript.parse(callback, parser)

if __name__ == '__main__':
    main()
