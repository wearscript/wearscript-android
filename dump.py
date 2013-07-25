import redis
from pprint import pprint as pp
a = redis.StrictRedis(port=6383)


keys_touched = set()

user_ids = []
for x in a.keys():
    if x.find(':') == -1:
        user_ids.append(x)

lists = ['locations', 'images']
sets = ['flags', 'uflags']

for user_id in user_ids:
    print('User[%s]' % user_id)
    keys_touched.add(user_id)
    pp(a.hgetall(user_id))
    print('User lists (capped at 10)')
    for x in lists:
        lkey = user_id + ':' + x
        keys_touched.add(lkey)
        l = a.lrange(lkey, 0, -1)
        print('List[%s][%d]' % (x, len(l)))
        pp(l[:10])
    print('User sets (capped at 25)')
    for x in sets:
        skey = user_id + ':' + x
        keys_touched.add(skey)
        l = list(a.smembers(skey))
        print('Set[%s][%d]' % (x, len(l)))
        pp(l[:25])
    print('')

print('Unaccounted for keys')
pp(set(a.keys()) - keys_touched)
