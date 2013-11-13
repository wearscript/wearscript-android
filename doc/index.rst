WearScript: JS with Batteries Included for Glass
================================================

..  toctree::
    :maxdepth: 1

    setup
    tutorial    
    tips
    hacking
    reference
    Reference <http://wearscript.com/reference/index.html>
    admin
    contributing
    troubleshooting

Visit https://github.com/OpenShades/wearscript for the source.

WearScript
===========

WearScript is a library that allows you to execute Javascript on Glass that can interact with the underlying device (e.g., control/sample sensors/camera, send timeline items, draw on the screen).  We have gone through many iterations to develop a streamlined user experience to write code and execute it on Glass, and I think we are very close.   This is much simpler than Android development, but more powerful than the built-in browser.  The features we are releasing today are sufficient to make a wide range of applications, but if you've seen our previous videos you can be sure there is more to come.   With your help we can build an open ecosystem around Glass.  Watch the short Intro Video to see what it can do.

.. code-block:: javascript

  <html style="width:100%; height:100%; overflow:hidden">
  <body style="width:100%; height:100%; overflow:hidden; margin:0">
  <canvas id="canvas" width="640" height="360" style="display:block"></canvas>
  <script>
  function cb(data) {
      // Changes canvas color with head rotation
      if (data['type'] == WS.sensor('orientation')) {
          ctx.fillStyle = 'hsl(' + data['values'][0] + ', 90%, 50%)'
          ctx.fillRect(0, 0, 640, 360);
      }
  }
  function server() {
      WS.log('Welcome to WearScript');
      WS.say('Welcome to WearScript');
      // Stream camera images and all sensors to the WearScript Playground Webapp
      var sensors = ['gps', 'accelerometer', 'magneticField', 'orientation', 'gyroscope',
                     'light', 'gravity', 'linearAcceleration', 'rotationVector'];
      for (var i = 0; i < sensors.length; i++)
          WS.sensorOn(WS.sensor(sensors[i]), .15, 'cb');
      WS.cameraOn(2);
      WS.dataLog(false, true, .15);
  }
  function main() {
      if (WS.scriptVersion(0)) return;
      ctx = document.getElementById('canvas').getContext("2d");
      WS.serverConnect('{{WSUrl}}', 'server');
  }
  window.onload = main;
  </script></body></html>


Intro Video
-------------------------
.. raw:: html

        <object width="480" height="385"><param name="movie"
        value="http://www.youtube.com/v/tOUgybfQp4A&hl=en_US&fs=1&rel=0"></param><param
        name="allowFullScreen" value="true"></param><param
        name="allowscriptaccess" value="always"></param><embed
        src="http://www.youtube.com/v/tOUgybfQp4A&hl=en_US&fs=1&rel=0"
        type="application/x-shockwave-flash" allowscriptaccess="always"
        allowfullscreen="true" width="480"
        height="385"></embed></object>

Contact/Info
============
OpenShades (the new OpenGlass) is our community name (join us at #openshades on freenode) that we use when hacking together, WearScript is this project specifically.  For demos see http://openshades.com.  Dapper Vision, Inc. (by Brandyn and Andrew) is the sponsor of this project and unless otherwise specified is the copyright owner of the files listed.

* Brandyn White (bwhite dappervision com)
* IRC freenode #openshades (if you want to collaborate or chat that's the place to be, we give regularly updates as we work here)
* G+ Community: https://plus.google.com/communities/101102785351379725742 (we post pictures/videos as we go here)
* Website: http://wearscript.com (overall project info, video links)
* Youtube: https://www.youtube.com/channel/UCGy1Zo81X2cRRQ5GQYz8eEQ (all videos)

License
-------
Apache 2.0

Contributors
------------
See `contributors <https://github.com/bwhite/wearscript/graphs/contributors>`_ for details.

* `Brandyn White <https://plus.google.com/109113122718379096525?rel=author>`_
* Andrew Miller
* Scott Greenwald
* Kurtis Nelson
