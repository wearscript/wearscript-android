#!/usr/bin/env python
import subprocess
import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', action='store_true',
                        help="Don't minify the source")
    args = parser.parse_args()
    includes = ['jquery.min.js', 'reconnecting-websocket.min.js', 'msgpack.js', 'bootstrap.min.js',
                'codemirror.js', 'bootstrap-switch.min.js', 'd3.v3.min.js',
                'rickshaw.min.js', 'playground.js', 'matchbrackets.js', 'active-line.js',
                'css.js', 'javascript.js', 'xml.js', 'htmlmixed.js', 'underscore-min.js',
                'mustache.min.js', 'wearscript-client.js']
    includes = ['js/' + x for x in includes]
    css = ['codemirror.css', 'bootstrap.min.css',
           'bootstrap-switch.css', 'cube.css', 'rickshaw.min.css']
    open('static/style.css', 'w').write('\n'.join([open('css/' + x).read() for x in css]))
    if args.debug:
        open('static/compressed.js', 'wb').write(';\n'.join([open(x, 'rb').read() for x in includes]))
    else:
        a= ' '.join(['--js %s' % x for x in includes])
        cmd = 'java -jar compiler.jar %s --js_output_file static/compressed.js' % a
        subprocess.call(cmd.split(' '))


if __name__ == '__main__':
    main()
