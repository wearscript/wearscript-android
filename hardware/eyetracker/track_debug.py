from track import PARAMS, pupil_iter, debug_iter
import argparse

def debug(**kw):
    run = [None]
    print(PARAMS)
    kw.update(PARAMS)
    while run[0] != 'QUIT':
        run = [None]
        for data in pupil_iter(debug=True, **kw):
            run[0] = debug_iter(*data)
            if run[0]:
                break

if __name__ == '__main__':    
    parser = argparse.ArgumentParser()
    parser.add_argument('--dump')
    parser.add_argument('--load')
    parser.add_argument('--calib')
    parser.add_argument('--plot', action='store_true')
    args = parser.parse_args()
    vargs = vars(args)    
    debug(**vargs)

