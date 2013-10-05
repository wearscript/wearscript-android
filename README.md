WearScript
===========

WearScript is a scripting language for wearable computing (currently Google Glass).  Wearables are personal devices and each user is likely to find value from them in a different way.  With this project we hope to make personalization and hacking as easy as possible so you can make your device do what you want and get on with your life.  We have a long ways to go but with your help we can get there and have some fun in the process.

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

* Tested on ubuntu 12.04 LTS, if you want support it helps if you stick with this if possible
* Ubuntu packages: apt-get install mercurial
* Setup a config.go file (look at config.go.example)
* Run /server/install.sh (this does basic dependencies and such)


Troubleshooting
===============
* "adb: command not found" - Android Dev Tools need to be in your path

Admin Operations
=================
All of these should be run in the /admin folder

* List users:  python users.py list_users
  *  Each user gets for rows (userid, info, flags, uflags)
  *  You'll need userid for the other commands
* Add a user (only needed if config.go has allowAllUsers = false): python users.py <userid> set_flag flags user

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

