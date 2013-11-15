#! /usr/bin/env python
import websocket
import argparse
import msgpack
import json
import irc.bot
import irc.strings


class WSIRCRelayBot(irc.bot.SingleServerIRCBot):
    def __init__(self, channel, nickname, server, endpoint, port):
        irc.bot.SingleServerIRCBot.__init__(self, [(server, port)], nickname, nickname)
        self.ws = websocket.create_connection(endpoint)
        self.channel = channel

    def on_nicknameinuse(self, c, e):
        c.nick(c.get_nickname() + "_")

    def on_welcome(self, c, e):
        c.join(self.channel)

    def on_pubmsg(self, c, e):
        self.ws.send(msgpack.dumps(['blob', 'irc', json.dumps({'msg': e.arguments[0], 'channel': e.target, 'source': e.source})]), opcode=2)


def main():
    parser = argparse.ArgumentParser(description='WearScript IRC Bot')
    parser.add_argument('endpoint')
    parser.add_argument('server')
    parser.add_argument('channel')
    parser.add_argument('nickname')
    parser.add_argument('--port', default=6667, type=int)
    bot = WSIRCRelayBot(**vars(parser.parse_args()))
    bot.start()

if __name__ == "__main__":
    main()
