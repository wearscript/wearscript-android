import argparse
import requests
import json


def _send_list(args):
    d = ['<li>%s</li>' % x for x in args.items]
    speak = ' '.join(args.items)
    pages = []
    while d:
        pages.append("<article><section><ul class=\"text-x-small\">%s</ul></section><footer><p>List (%d)</p></footer></article>" % (''.join(d[:5]), len(pages)))
        d = d[5:]
    out = {'speakableText': speak, 'key': args.key}
    if pages:
        out['html'] = pages[0]
    if len(pages) > 1:
        out['htmlPages'] = pages[1:]
    requests.post(args.endpoint, data=json.dumps(out))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('key')

    subparsers = parser.add_subparsers()
    subparser = subparsers.add_parser('list')

    subparser.add_argument('items', nargs='+')
    subparser.set_defaults(func=_send_list)

    parser.add_argument('--endpoint', default='https://api.picar.us/wearscript/notify/')
    parser.add_argument('--priority', action='store_true')
    args = parser.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()
