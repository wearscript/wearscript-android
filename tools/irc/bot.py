#! /usr/bin/env python
import wearscript
import gevent
import argparse
import json
import irc.bot
import irc.strings


def callback(ws, **kw):
    WSIRCRelayBot(ws=ws, **kw).start()


class WSIRCRelayBot(irc.bot.SingleServerIRCBot):
    def __init__(self, channel, nickname, server, port, ws):
        irc.bot.SingleServerIRCBot.__init__(self, [(server, port)], nickname, nickname)
        self.ws = ws
        self.channel = channel
        gevent.spawn(self.listener)

    def listener(self):
        while True:
            print('Listening')
            try:
                msg = self.ws.receive()
            except wearscript.WebSocketException:
                print('Connection closed')
                break
            print(msg)
            if msg[0] == 'blob' and msg[1] == 'irc':
                self.connection.privmsg(self.channel, msg[2])

    def on_nicknameinuse(self, c, e):
        c.nick(c.get_nickname() + "_")

    def on_welcome(self, c, e):
        c.join(self.channel)

    def on_pubmsg(self, c, e):
        self.ws.send('blob', 'irc', json.dumps({'msg': e.arguments[0], 'channel': e.target, 'source': e.source}))


def main():
    parser = argparse.ArgumentParser(description='WearScript IRC Bot')
    parser.add_argument('server')
    parser.add_argument('channel')
    parser.add_argument('nickname')
    parser.add_argument('--port', default=6667, type=int)
    wearscript.parse(callback, parser)

if __name__ == "__main__":
    main()
