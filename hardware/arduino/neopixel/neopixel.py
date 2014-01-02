import serial

SERIAL = None
def command(serialport, *args):
    global SERIAL
    if SERIAL is None:
        SERIAL = serial.Serial(serialport, 9600, timeout=1)
    for arg in args:
        SERIAL.write(chr(arg))

if __name__ == '__main__':
    import argparse
    import json
    import wearscript
    def callback(ws, **kw):
        print('Listening...')
        while 1:
            data = ws.receive()
            if data[0] == 'blob' and data[1] == 'arduino':
                print(data)
                command(kw['serialport'], *json.loads(data[2]))
    parser = argparse.ArgumentParser()
    parser.add_argument('--serialport', default='/dev/ttyACM0')
    wearscript.parse(callback, parser)
