WearScript
===========

WearScript is a library that allows you to execute Javascript on Glass that can interact with the underlying device (e.g., control/sample sensors/camera, send timeline items, draw on the screen).  We have gone through many iterations to develop a streamlined user experience to write code and execute it on Glass, and I think we are very close.   This is much simpler than Android development, but more powerful than the built-in browser.  The features we are releasing today are sufficient to make a wide range of applications, but if you've seen our previous videos you can be sure there is more to come.   With your help we can build an open ecosystem around Glass.  Watch the short Intro Video to see what it can do.

This has been slimmed down considerably to make it easier to install, the "rest" of the code is in "old" but it is unsupported.  We'll be working to gradually move some of the functionality to master.  Ping me in IRC if a certain capability would be useful to you and we'll give it a higher priority.  

Intro Video
-------------------------
[![intro video](http://img.youtube.com/vi/tOUgybfQp4A/0.jpg)](http://www.youtube.com/watch?v=tOUgybfQp4A)

Client Installation Video
-------------------------
This assumes Android Studio and the SDK are installed (see below)
[![client install](http://img.youtube.com/vi/lUCiqhWnRjg/0.jpg)](http://www.youtube.com/watch?v=lUCiqhWnRjg)

Server Installation Video
-------------------------
[![server install](http://img.youtube.com/vi/vdbE87oJja4/0.jpg)](http://www.youtube.com/watch?v=vdbE87oJja4)

Getting Started
----------------
* To use our server
  * Visit https://api.picar.us/wearscript/, auth using your google acccount
  * Contact brandyn in #openshades on IRC freenode to be white listed (please introduce yourself)
  * You can perform all the steps in the Client Installation Video (below) except for the one that requires the auth code (in the terminal using adb)
  * After being whitelisted you can go to the server, click QR, and paste the adb command to auth your device
  * Open WearScript using Launchy while you have the webapp open, you should see the cube/table pop up and buttons enable on the bottom.
* To use your own server (recommended if you can)
  * Follow the server installation video
  * Follow the above instructions but for your server

Install Android Studio
------------------------
* Download the latest canary with SDK bundled http://tools.android.com/download/studio/canary/latest/

Installing Go (manually)
-----------------------------
* wget https://go.googlecode.com/files/go1.1.1.linux-amd64.tar.gz
* tar -xzf go1.1.1.linux-amd64.tar.gz
* Put "export GOROOT=<yourpath>/go" and "export GOPATH=<yourpath>/gocode" in your .bashrc
* The "gocode" is where packages will be stored and "go" is the location of the extracted folder.

Install Redis
------------------
* Follow instructions here http://redis.io/download (tested on 2.6.*)

Install Server
--------------
* The video above gives a step by step guide
* Tested on Ubuntu 13.04, if you want support it helps if you stick with this or a new Ubuntu if possible
* Ubuntu packages: apt-get install golang git mercurial redis-server
* Setup a config.go file (look at config.go.example)
* Run /server/install.sh (this does basic dependencies and such)

Using the Playground
---------------------
The playground is a webapp that connects with WearScript while it is running on Glass.  It allows you to execute scripts and visualize the sensors/images from Glass.

* Go to the playground page for the server you'd like to use (if it's your first time, you'll sign into your Google account)
* After authorizing the webapp with Google, click the QR button the top right
* Ensure that Glass has an internet connection, WiFi is highly recommended
* There are two options to authenticate your glass
    * An ADB command will be shown, paste that into our console (it adds the server/auth key you need)
    * Use the WearScript (Setup) activity to scan the QR code
* On Glass, open up Launchy (go to the far left, tap settings, now you are in Launchy)
* Select WearScript (Start)
* If successfull, the buttons on the bottom of the Playground will enable.
* You may now send scripts, two examples are provided (you can click Wear This Script or Wear Script From URL)

WearScript Usage Notes
-----------------------
* If you swipe down the script will continue to run in the background
* To turn off WearScript open the webapp and press shutdown.
* When calling WS.serverConnect, if the argument passed is exactly '{{WSUrl}}' then it will be replaced with the websocket url corresponding to the server the playground is running on and the last QR code generated.
* If you use a script that doesn't make a server connection (i.e., WS.serverConnect('{{WSUrl}}'), 'callback') then you won't be able to control WearScript from the webapp
* More interesting uses of WS.serverConnect include making a custom server for your application and then Glass will connect to it and stream data while your app can continue to control Glass.
* Every time you press the QR button on the webapp you get a unique auth key which replaces the previous.
* You only need to auth your Glass once and then again anytime you want to change servers (using the adb command provided when you press the QR button).
* When using scripts in the Playground editor, make sure to specify http:// or https:// and NOT use refer to links like <script type="text/javascript" src="//example.com/test.js"></script>.  The script you put in the editor will be saved locally on Glass, and links of that form will not work.
* If you are connected to a server and use WS.log('Hi!'), that message will show up in the Android logs and the javascript console in the Playground.

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

Troubleshooting
----------------
* "adb: command not found" - Android Dev Tools need to be in your path
* Android Studio on OSX (0.2.13) doesn't include the SDK.  After Studio is install download the SDK (http://developer.android.com/sdk/index.html, sdk tools should be sufficient), move the "sdk" folder from there to /Applications/Android\ Studio.app.
* When doing bash install.sh for the server if you get something like below, you need go version 1.1 (you may have 1.0)
    * # github.com/ugorji/go/codec
    * /usr/lib/go/src/pkg/github.com/ugorji/go/codec/encode.go:107: undefined: io.ByteWriter
    * # github.com/ugorji/go/codec
    * /usr/lib/go/src/pkg/github.com/ugorji/go/codec/encode.go:107: undefined: io.ByteWriter

Admin Operations
----------------
All of these should be run in the /admin folder

* List users:  python users.py list_users
  *  Each user gets for rows (userid, info, flags, uflags)
  *  You'll need userid for the other commands
* Add a user (only needed if config.go has allowAllUsers = false): python users.py {{userid}} set_flag flags user

Contact/Info
============
OpenShades (the new OpenGlass) is our community name (join us at #openshades on freenode) that we use when hacking together, WearScript is this project specifically.  For demos see http://openshades.com.  Dapper Vision, Inc. (by Brandyn and Andrew) is the sponsor of this project and unless otherwise specified is the copyright owner of the files listed.

* Brandyn White (bwhite dappervision com)
* IRC freenode #openshades (if you want to collaborate or chat that's the place to be, we give regularly updates as we work here)
* G+ Community: https://plus.google.com/communities/101102785351379725742 (we post pictures/videos as we go here)
* Website: http://wearscript.com (overall project info, video links)
* Youtube: https://www.youtube.com/channel/UCGy1Zo81X2cRRQ5GQYz8eEQ (all videos)



Hacking
=======

Code Organization
-----------------

* Server: /server
* Webapp: /server/static/playground.html
* Server admin tools (authorize users, permissions, etc.): /admin
* Glass Client (Android app): /glass
* Glass Client Prereqs (launchy/opencv/zxing): /glass/thirdparty
* 3D models for printing and related scripts (AR mount, eye tracker, mirror holder): /hardware
* Useful tools (log data scripts, android adb helper, data visualization server): /tools/

Travis-CI
---------
The current test setup just builds the server after each commit.

[![Build Status](https://travis-ci.org/bwhite/wearscript.png?branch=master)](https://travis-ci.org/bwhite/wearscript)

Resources
---------
These are helpful for development

* https://developers.google.com/glass/policies
* https://code.google.com/p/google-api-go-client/source/browse/mirror/v1/mirror-gen.go
* http://golang.org/doc/effective_go.html
* https://developers.google.com/glass/playground


License
-------
Apache 2.0

Contributors
------------
See [contributors](https://github.com/bwhite/wearscript/graphs/contributors) for details.

* [Brandyn White](https://plus.google.com/109113122718379096525?rel=author)
* Andrew Miller
* Scott Greenwald
* Kurtis Nelson
