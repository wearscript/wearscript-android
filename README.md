WearScript
===========

WearScript is a scripting language for wearable computing (currently Google Glass).  Wearables are personal devices and each user is likely to find value from them in a different way.  With this project we hope to make personalization and hacking as easy as possible so you can make your device do what you want.

This has been slimmed down considerably to make it easier to install, the "rest" of the code is in "unstable" but it is unsupported.  We'll be working to gradually move some of the functionality to master.  Ping me in IRC if a certain capability would be useful to you and we'll give it a higher priority.  


Code Organization
-----------------

* Server: /server
* Webapp: /server/static/playground.html
* Server admin tools (authorize users, permissions, etc.): /admin
* Glass Client (Android app): /glass
* Glass Client Prereqs (launchy/opencv/zxing): /glass/thirdparty
* 3D models for printing and related scripts (AR mount, eye tracker, mirror holder): /hardware
* Useful tools (log data scripts, android adb helper, data visualization server): /tools/

License
-------
Apache 2.0

Client Installation Video
-------------------------
[![client install](http://img.youtube.com/vi/WIl90-86HRk/0.jpg)](http://www.youtube.com/watch?v=WIl90-86HRk)

Server Installation Video
-------------------------
[![server install](http://img.youtube.com/vi/vdbE87oJja4/0.jpg)](http://www.youtube.com/watch?v=vdbE87oJja4)


Installing Go
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
* Tested on ubuntu 12.04 LTS, if you want support it helps if you stick with this if possible
* Ubuntu packages: apt-get install mercurial
* Setup a config.go file (look at config.go.example)
* Run /server/install.sh (this does basic dependencies and such)


Using the Playground
---------------------
The playground is a webapp that connects with WearScript while it is running on Glass.  It allows you to execute scripts and visualize the sensors/images from Glass.

* Go to the playground page for the server you'd like to use (if it's your first time, you'll sign into your Google account)
* After authorizing the webapp with Google, click the QR button the top right
* Ensure that Glass has an internet connection, WiFi is highly recommended
* On Glass, open up Launchy (go to the far left, tap settings, now you are in Launchy)
* Select WearScript
* It will show a QR code reader, scan the QR code
* If successfull, the buttons on the bottom of the Playground will enable and the Javascript console will show "Connected"
* You may now send scripts, two examples are provided (you can click Wear This Scriot or Wear Script From URL)

WearScript Usage Notes
-----------------------
* If you swipe down the script will continue to run in the background, to reset to a blank script press the "Reset" button
* At this point the easiest way to turn off WearScript is to reset Glass (hold power button), we are working on this
* When calling WS.connect, if the argument passed is exactly '{{WSUrl}}' then it will be replaced with the websocket url corresponding to the server the playground is running on and the last QR code generated.
* If you use a script that doesn't make a server connection (i.e., WS.connect('{{WSUrl}}')) then you won't be able to control WearScript from the webapp
* More interesting uses of WS.connect include making a custom server for your application and then Glass will connect to it and stream data while your app can continue to control Glass.
* If you want to reconnect to the webapp, you can swipe down to exit WearScript and re-enter through Launchy (if the QR doesn't pop up do it again).  When the QR comes up you can swipe down to dismiss it and it'll reuse the last scan.
* Every time you press the QR button on the webapp you get a unique scan, while the page is open you may reuse the scan (either by rescanning or the previous downswipe trick) but if you reload the page you must rescan.
* Only the last generated QR code is valid.
* When using scripts in the Playground editor, make sure to specify http:// or https:// and NOT use refer to links like <script type="text/javascript" src="//example.com/test.js"></script>.  The script you put in the editor will be saved locally on Glass, and links of that form will not work.
* If you are connected to a server and use WS.log('Hi!'), that message will show up in the Android logs and the javascript console in the Playground.

Syntax
======

The code is under rapid development and instead of making a list of supported commands (which will be constantly out of sync), look at the Java class that implements the WS variable http://goo.gl/eYFyTO.

Troubleshooting
===============
* "adb: command not found" - Android Dev Tools need to be in your path

Admin Operations
=================
All of these should be run in the /admin folder

* List users:  python users.py list_users
  *  Each user gets for rows (userid, info, flags, uflags)
  *  You'll need userid for the other commands
* Add a user (only needed if config.go has allowAllUsers = false): python users.py {{userid}} set_flag flags user

Contact/Info
============

* Brandyn White (bwhite dappervision com)
* IRC freenode #openshades (if you want to collaborate or chat that's the place to be, we give regularly updates as we work here)
* G+ Community: https://plus.google.com/communities/101102785351379725742 (we post pictures/videos as we go here)
* Website: http://wearscript.com (overall project info, video links)
* Youtube: https://www.youtube.com/channel/UCGy1Zo81X2cRRQ5GQYz8eEQ (all videos)


OpenShades
==========
OpenShades (the new OpenGlass) is our community name (join us at #openshades on freenode) that we use when hacking together, WearScript is this project specifically.  For demos see http://openshades.com.  Dapper Vision, Inc. (by Brandyn and Andrew) is the sponsor of this project and unless otherwise specified is the copyright owner of the files listed.

Hacking
=======

Travis-CI
---------
The current test setup just builds the server after each commit.

[![Build Status](https://travis-ci.org/bwhite/wearscript.png?branch=master)](https://travis-ci.org/bwhite/wearscript)

Resources
---------
These are helpful for development

* https://code.google.com/p/google-api-go-client/source/browse/mirror/v1/mirror-gen.go
* http://golang.org/doc/effective_go.html
* https://developers.google.com/glass/playground


Clock deskew and latency estimation
-----------------------------------
* Glass sends data to server (potentially big) and includes a timestamp (Tg0)
* Server sends ack to glass with its own timestamp (Ts0) and the previous timestamp (Tg0)
* Glass computes new timestamp (Tg1) and sends back (Tg0, Tg1, Ts0, Tg1)
* Server computes k = Tg - Ts (skew), D = D1 = D2  (delay, assuming last two equal), and data delay D0.
* D = .5 * (Ts1 - Ts0), k = Tg1 - Ts1 + D, and D0 = Ts0 + k - tg0

```
Glass        Server
Tg0  - D0 -> Ts0
Tg1 <- D1 -  Ts0
Tg1 -  D2 -> Ts1
```

Timeline Item Styling
---------------------

For glassware the timeline items are styled using HTML/CSS.  The dev playground helps a lot (link above).


Contributors
------------
See [contributors](https://github.com/bwhite/wearscript/graphs/contributors) for details.

* Brandyn White
* Andrew Miller
* Scott Greenwald
* Kurtis Nelson
