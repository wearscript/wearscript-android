import base64
import json
import glob
import os
import sys
import shutil
din = sys.argv[1]
dout = sys.argv[2]
for fn in glob.glob(din + '/*.jpg'):
    row = 'glassborg:' + os.urandom(10)
    rowub64 = base64.urlsafe_b64encode(row)
    row_dir = dout + '/' + rowub64
    os.makedirs(row_dir)
    shutil.copy(fn, row_dir + '/' + base64.urlsafe_b64encode('data:image'))
    open(row_dir + '/' + base64.urlsafe_b64encode('meta:filename'), 'w').write(os.path.basename(fn))
