#!/usr/bin/env python
import sys
import termios
import contextlib

startMessage = \
"""
exit with ^C or ^D

Tool to print out hex codes for keys. Helpful in order to add support
for additional keys in GlassKeyboard.

Thanks to
http://stackoverflow.com/questions/11918999/key-listeners-in-python
"""

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
    print startMessage
    with raw_mode(sys.stdin):
        try:
            while True:
                ch = sys.stdin.read(1)
                if not ch or ch == chr(4):
                    break
                print '%02x' % ord(ch),
        except (KeyboardInterrupt, EOFError):
            pass


if __name__ == '__main__':
    main()
