import redis
from pprint import pprint as pp
a = redis.StrictRedis(port=6383)


keys_touched = set()


def get_user_ids():
    user_ids = []
    for x in a.keys():
        if x.find(':') == -1:
            user_ids.append(x)
    return user_ids

user_ids = get_user_ids()

lists = ['locations', 'images']
lists_big = ['glog_images']
sets = ['flags', 'uflags']
secrets = ['raven', 'glog']

for user_id in user_ids:
    print('User[%s]' % user_id)
    keys_touched.add(user_id)
    user_data = a.hgetall(user_id)
    pp(user_data)
    print('User lists (capped at 10)')
    for x in lists:
        lkey = user_id + ':' + x
        keys_touched.add(lkey)
        l = a.lrange(lkey, 0, -1)
        print('List[%s][%d]' % (x, len(l)))
        pp(l[:10])
    for lkey in a.keys(user_id + ':glog_sensors_*'):
        keys_touched.add(lkey)
        l = a.lrange(lkey, 0, -1)
        print('List[%s][%d]' % (x, len(l)))
        pp(l[:10])
    for x in lists_big:
        lkey = user_id + ':' + x
        keys_touched.add(lkey)
        l = a.lrange(lkey, 0, -1)
        print('List[%s][%d]' % (x, len(l)))
        
    print('User sets (capped at 25)')
    for x in sets:
        skey = user_id + ':' + x
        keys_touched.add(skey)
        l = list(a.smembers(skey))
        print('Set[%s][%d]' % (x, len(l)))
        pp(l[:25])
    for x in secrets:
        try:
            skey = 'secret:%s:%s' % (x, user_data['secret_hash_' + x])
        except KeyError:
            continue
        keys_touched.add(skey)
        print('Secret[%s] correct: %s' % (x, a.get(skey) == user_id))
    print('')

print('Unaccounted for keys')
pp(set(a.keys()) - keys_touched)
