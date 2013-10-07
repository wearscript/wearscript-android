GlassKeyboard: control your Glass with key events from Python
=========================================================

exit with ^C or ^D

Enabled Keys
------------

key          command
------------ ------------
h            home
enter        tap
right arrow  swipe right
left arrow   swipe left
down arrow   swipe down
s            launch android settings
g            launch glass settings
l            launch Launchy
p            take a picture (broken)
i            show this doc

Known Limitations
-----------------

* For adb running as root, GlassKeyboard uses a system binary called
  `simulated_input` to generate touchpad events. This works well and fast,
  with the caveat that in applications where LEFT and RIGHT are mapped to
  scroll events, they generate two unit scrolls instead of one.

* When not running as root, GlassKeyboard uses keyevents to imitate touchpad
  events, but these are not mapped to scroll events, as real swipe events
  would be. For example, in Launchy, keyevents do not scroll through options.

* When not running as root, performance is a little slow. This seems to be a
  limitation of the technique of using adb to send keyevents, as far as I can
  tell. Batching `input` events in a single `adb shell` call doesn't seem to
  help much, so I'm using separate calls for each event.

* I don't know if the representation of keys is platform independent.
  This works on Mac OS X right now.

Notes on implementation
-----------------------

* GlassKeyboard uses threads with timeouts because adb doesn't reliably
  return, particularly over wireless. The device will continue to
  accept new commands even if the previous one hasn't returned. 

* Arrow keys are represented with three bytes, so there's a goofy-looking
  state machine (involving multiByte) in the single-byte-reading loop that
  combines these in order to interpret them.

Todo
----

* Enable lots more keys

License
-------

GlassKeyboard is part of WearScript, see the license of WearScript.
WearScript is a project of OpenShades.

Author
______
Scott Greenwald (swgreen on GitHub)
