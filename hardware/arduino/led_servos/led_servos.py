import serial
usbport = '/dev/ttyACM0'

def data(device, data):
    assert 0 <= device < 256
    assert 0 <= data < 256
    s = serial.Serial(usbport, 9600, timeout=1)
    s.write(chr(255))
    s.write(chr(device))
    s.write(chr(data))

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('device', type=int)
    parser.add_argument('data', type=int)
    data(**vars(parser.parse_args()))
    
