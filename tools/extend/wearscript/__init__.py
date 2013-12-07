try:
    import gevent.monkey
    gevent.monkey.patch_all()
    import msgpack
    import websocket
    import logging
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
except ImportError:
    print('Need to install imports, on Ubuntu try...\nsudo apt-get install libevent-dev python-pip python-dev\nsudo pip install gevent gevent-websocket msgpack-python websocket-client\n')
    raise


class WebSocketServerConnection(object):

    def __init__(self, ws):
        self.ws = ws

    def send(self, *args):
        self.ws.send(msgpack.dumps(list(args)), binary=True)

    def receive(self):
        return msgpack.loads(self.ws.receive())


class WebSocketClientConnection(object):

    def __init__(self, ws):
        self.ws = ws

    def send(self, *args):
        self.ws.send(msgpack.dumps(list(args)), opcode=2)

    def receive(self):
        return msgpack.loads(self.ws.recv())


def websocket_server(callback, port, **kw):

    def websocket_app(environ, start_response):
        logging.info('Glass connected')
        if environ["PATH_INFO"] == '/':
            ws = environ["wsgi.websocket"]
            callback(WebSocketServerConnection(ws), **kw)
            wsgi_server.stop()
    wsgi_server = pywsgi.WSGIServer(("", port), websocket_app,
                                    handler_class=WebSocketHandler)
    wsgi_server.serve_forever()


def websocket_client_factory(callback, url, **kw):
    callback(WebSocketClientConnection(websocket.create_connection(url)), **kw)


def parse(callback, parser):
    subparsers = parser.add_subparsers()
    subparser = subparsers.add_parser('server')
    subparser.add_argument('port', type=int)
    subparser.set_defaults(func=websocket_server)
    subparser = subparsers.add_parser('client')
    subparser.add_argument('endpoint')
    subparser.set_defaults(func=websocket_client_factory)
    args = parser.parse_args()
    vargs = dict(vars(args))
    del vargs['func']
    args.func(callback, **vargs)
