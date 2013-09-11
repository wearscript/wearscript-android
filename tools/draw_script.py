"""Basic playground for the draw script directives"""
import cv2
import numpy as np
import base64
import tempfile


#['clear', [0, 255, 0]]
#['circle', [x, y], r, [0, 255, 0]]  // colors are [b, g, r] and filled
#['rect', [x0, y0, x1, y1], r, [0, 255, 0]]  // colors are [b, g, r] and filled
w, h = 640, 360
r = 30
r2 = r * 2
d = [['clear', [0, 0, 0]],
     ['circle', [r, r], r2, [0, 0, 255]],
     ['circle', [w - r, r], r2, [0, 0, 255]],
     ['circle', [r, h - r], r2, [0, 0, 255]],
     ['circle', [w - r, h - r], r2, [0, 0, 255]]]

d = [['rectangle', [0, 0], [r, h], [0, 0, 255]],
     ['rectangle', [0, 0], [w, r], [0, 0, 255]],
     ['rectangle', [0, h], [w, h - r], [0, 0, 255]],
     ['rectangle', [w, 0], [w - r, h], [0, 0, 255]]]
#['clear', [255, 255, 255]],

def render(directives):
     image = np.ascontiguousarray(cv2.imread('input.jpg')[:360, :640, :])
     #image = np.zeros((360, 640, 3), dtype=np.uint8)
     for d in directives:
         if d[0] == 'clear':
             image[:] = np.array(d[1])
         elif d[0] == 'circle':
             cv2.circle(image, tuple(d[1]), d[2], tuple(d[3]), -1)
         elif d[0] == 'rectangle':
             cv2.rectangle(image, tuple(d[1]), tuple(d[2]), tuple(d[3]), -1)
         else:
             raise ValueError
     return image
b = np.array([0], dtype='uint8')
f = tempfile.NamedTemporaryFile(suffix='.jpg')
cv2.imwrite(f.name, render(d))
cv2.imwrite("draw_out.jpg", render(d))
print(base64.b64encode(f.read()))
