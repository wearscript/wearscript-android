#!/usr/bin/env python
import sys
import termios
import contextlib
import subprocess, threading
from subprocess import call

startMessage = \
"""
GlassKeyoard: control your Glass with key events from Python
=========================================================

exit with ^C or ^D

Enabled Keys
------------

key          command
------------ ------------
h            home
enter        tap
right arrow  swipe right
left arrow   swipe left
down arrow   swipe down

Known Limitations
-----------------

* GlassKeyboard uses keyevents to imitate touchpad events, but support for
  this is not uniform in the Glass UI. For example, in Launchy, 
  keyevents do not scroll through options. 

* Performance is a little slow. This is a limitation of the technique 
  of using adb to send keyevents, as far as I can tell.

* I don't know if the representation of keys is platform independent.
  This works on Mac OS X right now.

Notes on implementation
-----------------------

* GlassKeyboard uses threads with timeouts because adb doesn't reliably
  return, particularly over wireless. The device will continue to
  accept new commands even if the previous one hasn't returned. 

Todo
----

* Enable lots more keys

License
-------

GlassKeyboard is part of WearScript, see the license of WearScript.
WearScript is a project of OpenShades.

"""

class Command(object):
    def __init__(self, cmd):
        self.cmd = cmd
        self.process = None

    def run(self, timeout):
        def target():
            print 'Thread started'
            self.process = subprocess.Popen(self.cmd, shell=True)
            self.process.communicate()
            print 'Thread finished'

        thread = threading.Thread(target=target)
        thread.start()

        thread.join(timeout)
        if thread.is_alive():
            print 'Terminating process'
            self.process.terminate()
            thread.join()
        print self.process.returncode

@contextlib.contextmanager
def raw_mode(file):
    old_attrs = termios.tcgetattr(file.fileno())
    new_attrs = old_attrs[:]
    new_attrs[3] = new_attrs[3] & ~(termios.ECHO | termios.ICANON)
    try:
        termios.tcsetattr(file.fileno(), termios.TCSADRAIN, new_attrs)
        yield
    finally:
        termios.tcsetattr(file.fileno(), termios.TCSADRAIN, old_attrs)


def main():
    #print 'exit with ^C or ^D'
    print startMessage
    with raw_mode(sys.stdin):
        try:
            multiByte = []
            chHex = '0a'
            cmd = "adb shell input keyevent "
            while True:
                
                chPrev = chHex
                ch = sys.stdin.read(1)
                chHex = '%02x' % ord(ch)
                if ch == 'h':
                    print "Sending 'home' over adb"
                    command = Command(cmd + "3")
                    command.run(timeout=3)
                elif chHex == '0a':
                    print "Sending 'enter' over adb"
                    command = Command("adb shell input keyevent 66")
                    command.run(timeout=3)
                if multiByte == [] and chHex == '1b':
                    multiByte += ['1b']
                elif multiByte == ['1b'] and chHex == '5b':
                    multiByte += ['5b']
                    print "Got an arrow key"
                elif multiByte == ['1b','5b']:
                    print "Arrow key " + chHex
                    if chHex == '43': # RIGHT
                        command = Command(cmd + "22")
                        command.run(timeout=3)
                    elif chHex == '44': # LEFT
                        command = Command(cmd + "21")
                        command.run(timeout=3)
                    # elif chHex == '41': # UP
                    elif chHex == '42': # DOWN
                        command = Command(cmd + "4")
                        command.run(timeout=3)
                    else:
                        print "Unrecognized arrow key"
                    multiByte = []
                else:
                    multiByte = []
                if not ch or ch == chr(4):
                    break
        except (KeyboardInterrupt, EOFError):
            pass

if __name__ == '__main__':
    main()

