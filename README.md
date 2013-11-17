WearScript
===========
WearScript combines the power of Android development on Glass with the learning curve of a website.  Go from concept to demo in a fraction of the time. For an overview check out the intro video and sample script below.  Visit http://www.wearscript.com for documentation and more information.

[![intro video](http://img.youtube.com/vi/tOUgybfQp4A/0.jpg)](http://www.youtube.com/watch?v=tOUgybfQp4A)

```HTML
// Sample WearScript
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
```

About
-----

* Full documentation at http://www.wearscript.com
* [OpenShades](http://openshades.com) (the new OpenGlass) is our community
* IRC freenode #openshades (if you want to collaborate or chat that's the place to be)
* Project Lead: Brandyn White (bwhite dappervision com)
* [G+ Community](https://plus.google.com/communities/101102785351379725742) (we post work in progress here)
* [Youtube](https://www.youtube.com/channel/UCGy1Zo81X2cRRQ5GQYz8eEQ) (all OpenShades videos)
* [Dapper Vision, Inc.](http://www.dappervision.com) (by Brandyn and Andrew) is the sponsor of this project
* Code is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) unless otherwise specified

Contributors
------------
See [contributors](https://github.com/OpenShades/wearscript/graphs/contributors) for details.  Name (irc nick)

* [Brandyn White (brandyn)](https://plus.google.com/109113122718379096525?rel=author)
* Andrew Miller (amiller)
* Scott Greenwald (swgreen_mit)
* Kurtis Nelson (kurtisnelson)
* Conner Brooks (connerb)
* Justin Chase (jujuman)
* Alexander Conroy (geilt)
