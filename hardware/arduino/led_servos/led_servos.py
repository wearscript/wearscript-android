import serial

SERIAL = None
def command(device, data, serialport):
    global SERIAL
    assert 0 <= device < 256
    assert 0 <= data < 256
    if SERIAL is None:
        SERIAL = serial.Serial(serialport, 9600, timeout=1)
    SERIAL.write(chr(255))
    SERIAL.write(chr(device))
    SERIAL.write(chr(data))


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
                command(*json.loads(data[2]), serialport=kw['serialport'])
    parser = argparse.ArgumentParser()
    parser.add_argument('--serialport', default='/dev/ttyACM0')
    wearscript.parse(callback, parser)
