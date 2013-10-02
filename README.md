OpenGlass
=========

For demos of this code see openglass.us (this readme would be out of data in terms of capabilities).  This has been slimmed down considerably to make it easier to install, the "rest" of the code is in "unstable" but it is unsupported.  We'll be working to gradually move some of the functionality to master.  Ping me in IRC if a certain capability would be useful to you and we'll give it a higher priority.

Code Organization
-----------------

* Server: /server
* Server admin tools (authorize users, permissions, etc.): /admin
* Webapps: /static/{app.html, playground.html}
* GlassGap (Android app): /glassgap
* 3D models for printing and related scripts (AR mount, eye tracker, mirror holder): /hardware
* GlassGap Prereqs (launchy/opencv/zxing): /glassgap/thirdparty
* Useful tools (log data scripts, android adb helper, data visualization server): /tools/

License
-------
Apache 2.0

Installing Go
-----------------------------
* wget https://go.googlecode.com/files/go1.1.1.linux-amd64.tar.gz
* tar -xzf go1.1.1.linux-amd64.tar.gz
* Put "export GOROOT=<yourpath>/go" and "export GOPATH=<yourpath>/gocode" in your .bashrc
* The "gocode" is where packages will be stored and "go" is the location of the extracted folder.

Install Redis
------------------
* Follow instructions here http://redis.io/download (tested on 2.6.*)

Install OpenGlass
------------------

* Tested on ubuntu 12.04 LTS, if you want support it helps if you stick with this if possible
* Ubuntu packages: apt-get install mercurial
* Setup a config.go file (look at config.go.example)
* Run /server/install.sh (this does basic dependencies and such)

Contact/Info
============

* Brandyn White (bwhite dappervision com)
* IRC freenode #openglass (if you want to collaborate or chat that's the place to be, we give regularly updates as we work here)
* G+ Community: https://plus.google.com/communities/101102785351379725742 (we post pictures/videos as we go here)
* Website: http://openglass.us (overall project info, video links)
* Youtube: https://www.youtube.com/channel/UCGy1Zo81X2cRRQ5GQYz8eEQ (all videos)

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

