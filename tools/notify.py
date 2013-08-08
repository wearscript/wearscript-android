import requests, json, argparse
parser = argparse.ArgumentParser()
parser.add_argument('endpoint')
parser.add_argument('application')
parser.add_argument('title')
parser.add_argument('message')
parser.add_argument('--priority', action='store_true')
args = vars(parser.parse_args())
requests.post(args['endpoint'], data=json.dumps({k: v for k, v in args.items() if k != 'endpoint'}))
