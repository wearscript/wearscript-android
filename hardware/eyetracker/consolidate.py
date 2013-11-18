import msgpack
import glob
import json

pts = []
dump = 'dump_persuits_1'
for x in glob.glob(dump + '/*.msgpack'):
    msg = msgpack.load(open(x))
    if msg[0] == 'sensors':
        print(msg)
        for x in msg[3].get('Persuits', []):
            pts.append([x[1], x[0][0], x[0][1]])
open(dump + '/persuits.js', 'w').write(json.dumps(pts))
        
