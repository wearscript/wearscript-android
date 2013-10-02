OpenGlass
=========

For demos of this code see openglass.us (this readme would be out of data in terms of capabilities).  This has been slimmed down considerably to make it easier to install, the "rest" of the code is in "unstable" but it is unsupported.  We'll be working to gradually move some of the functionality to master.  Ping me in IRC if a certain capability would be useful to you and we'll give it a higher priority.

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
* Run install.sh (this does basic dependencies and such)

Hacking
-------
See the HACKING.md file for help.

Contact
-------
* Brandyn White (bwhite dappervision com)
* IRC freenode #openglass (if you want to collaborate or chat that's the place to be)