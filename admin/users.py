import redis
import argparse


def _check_id(db, args):
    if not db.exists(args.user_id):
        raise ValueError('User not found')


def _set_flag(db, args):
    _check_id(db, args)
    db.sadd(args.user_id + ':' + args.name, args.flag)


def _unset_flag(db, args):
    _check_id(db, args)
    db.srem(args.user_id + ':' + args.name, args.flag)


def _list_users(db, args):
    for user_id in db.keys():
        if user_id.find(':') == -1:
            print(user_id)
            print(db.hget(user_id, 'user_info'))
            for x in ['flags', 'uflags']:
                skey = user_id + ':' + x
                print((x, db.smembers(skey)))
            print('')


def main():
    parser = argparse.ArgumentParser(description='Picarus user operations')
    parser.add_argument('--redis_host', help='Redis Host', default='localhost')
    parser.add_argument('--redis_port', type=int, help='Redis Port', default=6383)
    subparsers = parser.add_subparsers(help='Commands')

    subparser = subparsers.add_parser('set_flag', help='Set a flag')
    subparser.add_argument('user_id')
    subparser.add_argument('name', choices=['flags', 'uflags'])
    subparser.add_argument('flag')
    subparser.set_defaults(func=_set_flag)

    subparser = subparsers.add_parser('list_users', help='List users')
    subparser.set_defaults(func=_list_users)

    subparser = subparsers.add_parser('unset_flag', help='Unset a flag')
    subparser.add_argument('user_id')
    subparser.add_argument('name', choices=['flags', 'uflags'])
    subparser.add_argument('flag')
    subparser.set_defaults(func=_unset_flag)
    
    args = parser.parse_args()
    db = redis.StrictRedis(args.redis_host, port=args.redis_port)
    args.func(db, args)

if __name__ == '__main__':
    main()
