.. _our-server:

Server Setup
============

Using Our Server
----------------
* Visit https://api.picar.us/wearscript/, click "authenticate", then sign-in using your Google acccount
* Contact brandyn in #openshades on IRC freenode to be white-listed (you must authenticate before we can add you)
* After being whitelisted you can do :ref:`connecting-client-to-server`

.. _your-server:

Install Server
--------------
* Linux is highly recommended, we have not tested this on OSX or Windows (feel free to try)
* The video below gives a step by step guide
* A few "alternate" options are listed below that may be useful if you run into problems
* Tested on Ubuntu 13.04, if you want support it helps if you stick with this or a new Ubuntu if possible.
* Ubuntu packages: apt-get install golang git mercurial redis-server
* Setup the config.go file (look at config.go.example)
* Run /server/install.sh (this does basic dependencies and such)
* Start with ./server and continue with "Connecting the Client to the Server"

Server Installation Video
-------------------------

.. raw:: html

        <object width="480" height="385"><param name="movie"
        value="http://www.youtube.com/v/vdbE87oJja4&hl=en_US&fs=1&rel=0"></param><param
        name="allowFullScreen" value="true"></param><param
        name="allowscriptaccess" value="always"></param><embed
        src="http://www.youtube.com/v/vdbE87oJja4&hl=en_US&fs=1&rel=0"
        type="application/x-shockwave-flash" allowscriptaccess="always"
        allowfullscreen="true" width="480"
        height="385"></embed></object>

Alternate: Installing Go (manually)
------------------------
* wget https://go.googlecode.com/files/go1.1.1.linux-amd64.tar.gz
* tar -xzf go1.1.1.linux-amd64.tar.gz
* Put "export GOROOT=<yourpath>/go" and "export GOPATH=<yourpath>/gocode" in your .bashrc
* The "gocode" is where packages will be stored and "go" is the location of the extracted folder.

Alternate: Install Redis
------------------
* Follow instructions here http://redis.io/download (tested on 2.6.*)
