WearScript: JS with Batteries Included for Glass
================================================
WearScript is the power of Android on Glass with the learning curve of a website.  Go from concept to demo in a fraction of the time. For an overview check out the intro video and sample script below.  Visit https://github.com/OpenShades/wearscript for the goods.

.. raw:: html

        <object><param name="movie"
        value="http://www.youtube.com/v/tOUgybfQp4A&hl=en_US&fs=1&rel=0"></param><param
        name="allowFullScreen" value="true"></param><param
        name="allowscriptaccess" value="always"></param><embed
        src="http://www.youtube.com/v/tOUgybfQp4A&hl=en_US&fs=1&rel=0"
        type="application/x-shockwave-flash" allowscriptaccess="always"
        allowfullscreen="true"></embed></object>

.. code-block:: html

  <html style="width:100%; height:100%; overflow:hidden">
  <body style="width:100%; height:100%; overflow:hidden; margin:0">
  <canvas id="canvas" width="640" height="360" style="display:block"></canvas>
  <script>
  function cb(data) {  // Changes canvas color depending on head rotation
      if (data['type'] == WS.sensor('orientation')) {
          ctx.fillStyle = 'hsl(' + data['values'][0] + ', 90%, 50%)'
          ctx.fillRect(0, 0, 640, 360);
      }
  }
  function server() {
      WS.log('Welcome to WearScript');  // Write to Android Log and Playground console
      WS.say('Welcome to WearScript');  // Text-to-speech
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


..  toctree::
    :hidden:
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

Contact/Info
============
OpenShades (the new OpenGlass) is our community name that we use when hacking together (join us at #openshades on freenode IRC), WearScript is this project specifically.  For demos see http://openshades.com.  Dapper Vision, Inc. (by Brandyn and Andrew) is the sponsor of this project and unless otherwise specified is the copyright owner of the files listed.

* Project Lead: Brandyn White (bwhite dappervision com)
* IRC freenode #openshades (if you want to collaborate or chat that's the place to be, we give regularly updates as we work here)
* G+ Community: https://plus.google.com/communities/101102785351379725742 (we post pictures/videos as we go here)
* Website: http://wearscript.com (overall project info, video links)
* Youtube: https://www.youtube.com/channel/UCGy1Zo81X2cRRQ5GQYz8eEQ (all videos)

License
-------
Apache 2.0

Contributors
------------
See `contributors <https://github.com/bwhite/wearscript/graphs/contributors>`_ for details.  Name (irc nick) below

* `Brandyn White (brandyn) <https://plus.google.com/109113122718379096525?rel=author>`_
* Andrew Miller (amiller)
* Scott Greenwald (swgreen_mit)
* Kurtis Nelson (kurtisnelson)
* Conner Brooks (connerb)
* Justin Chase (jujuman)
* Alexander Conroy (geilt)
