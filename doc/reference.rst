API Reference
==============

WearScript Syntax
-----------------
In the JavaScript environment there is a WS object that has the following method calls

* WS.scriptVersion(int version):
* WS.sensor(String name) -> sensor int: Used to convert from sensor names to the underlying int types
* WS.sensors() -> JSON Object with keys as sensor names and values as int types
* WS.sensorOn(int type, double period): Turn on the sensor and produce data no faster than the specific period.  Best used with WS.sensor like WS.sensorOn(WS.sensor('light'), .5).
* WS.sensorOn(int type, double period, String callback): 
* WS.sensorOff(int type)
* WS.say(String message): Uses Text-to-Speach to read text
* WS.log(String message): Log a message to the Android log and the JavaScript console of the webapp (if connected to a server).
* WS.displayWebView(): Display the WebView activity (this is the default, reserved for future use when we may have alternate views).
* WS.shutdown(): Shuts down wearscript
* WS.data(int type, String name, String valuesJSON): Log "fake" sensor data made inside the script, will be logged based on the WS.dataLog settings.
* WS.cameraOn(double period): Camera frames are output based on the WS.cameraCallback and WS.dataLog options.
* WS.cameraPhoto(): Take a picture and save to the SD card.
* WS.cameraVideo(): Record a video and save to the SD card.
* WS.cameraCallback(int type, String callback): Type 0=local camera, 1=remote camera (subject to change).
* WS.cameraOff()
* WS.activityCreate(): Creates a new activity in the foreground and replaces any existing activity (useful for bringing window to the foreground)
* WS.activityDestroy(): Destroys the current activity.
* WS.wifiOn(): Turn on wifi scanning
* WS.wifiOn(String callback): Previous but provide a callback to get results
* WS.wifiScan(): Request a wifi scan.
* WS.wifiOff()
* WS.serverConnect(String server, String callback): Connects to the WearScript server, if given '{{WSUrl}}' as the server it will substitute the user configured server.  Some commands require a server connection.
* WS.serverTimeline(timelineItemJSON): If connected to a server, has that server insert the timeline item (exact mirror timeline item syntax serialized to JSON)
* WS.dataLog(boolean local, boolean server, double sensorPeriod): Log data local and/or remote, buffering sensor packets according to sensorPeriod.

Sensor Types
------------
Sensors have unique names and integer types that are used internally and can be used as WS.sensor('light') which returns 5.  The standard Android sensor types are positive and custom types are given negative numbers.

* pupil: -2
* gps: -1
* accelerometer: 1
* magneticField: 2
* orientation: 3
* gyroscope: 4
* light: 5
* gravity: 9
* linearAcceleration: 10
* rotationVector: 11
