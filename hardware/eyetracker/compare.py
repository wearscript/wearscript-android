import msgpack
import glob
import json
import numpy as np

dump = 'dump_persuits_1'
eye = np.array(json.load(open(dump + '/eye.js')))
persuits = np.array(json.load(open(dump + '/persuits.js')))
print(eye.shape)
print(persuits.shape)
