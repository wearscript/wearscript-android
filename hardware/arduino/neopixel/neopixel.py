import serial
import time

SERIAL = None
def command(serialport, *args):
    global SERIAL
    if SERIAL is None:
        SERIAL = serial.Serial(serialport, 9600, timeout=1)
    print(args)
    for a in args:
        assert 0 <= a < 256
        SERIAL.write(chr(a))

if __name__ == '__main__':
    import argparse
    import msgpack
    import base64
    import wearscript
    if 0:
        #payload = [255, 0, 0, 0, 0, 0,  255, 0, 0, 255, 255, 0, 255, 2, 0, 255, 255, 0];
        kw = {'serialport': '/dev/ttyACM0'}
        for i in range(len(payload) / 6):
            command(kw['serialport'], *payload[i * 6: (i + 1) * 6])
            time.sleep(.5)
        time.sleep(10)
        quit()
    def callback(ws, **kw):
        print('Listening...')
        while 1:
            data = ws.receive()
            if data[0] == 'blob' and data[1] == 'arduino':
                print(data)
                payload = msgpack.loads(base64.b64decode(data[2]))
                print(payload)
                for i in range(len(payload) / 6):
                    command(kw['serialport'], *payload[i * 6: (i + 1) * 6])
    parser = argparse.ArgumentParser()
    parser.add_argument('--serialport', default='/dev/ttyACM0')
    wearscript.parse(callback, parser)
