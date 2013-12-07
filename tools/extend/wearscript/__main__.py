import wearscript
import argparse

if __name__ == '__main__':
    def callback(ws, **kw):
        print('Got args[%r]' % (kw,))
        print('Demo callback, prints all inputs and sends nothing')
        while 1:
            print(ws.receive())
    wearscript.parse(callback, argparse.ArgumentParser())
