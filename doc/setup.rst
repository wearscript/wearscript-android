Setup
=====

What do you want to do?
-----------------------
* Get WearScript Source...

  * with one click: Click Download ZIP on the right side of the page
  * using git: Clone the repo using the url on the right side of the page

* Put WearScript on Glass...

  * as easy as possible:  See Install Client (Binary)
  * and be able to hack the Java code: See Install Client (Source)
  * and be able to hack the Java code (using our virtual machine): Install WearScript VM

* Use our WearScript server: See Using Our Server
* Run your own WearScript server...

  * on an existing machine:  See Install Server
  * in our virtual machine: Install WearScript VM

* Install the WearScript VM Image (Vagrant, Ubuntu, Android Studio, WearScript Server): See Install WearScript VM (Client + Server)

Setup Your Device
-----------------
* Put the device in debug mode (see "Turning on debug mode" here https://developers.google.com/glass/gdk)
* Connect your Glass to your computer with a USB cable

Get Android Studio
------------------
* Download/unpack the lastest canary version of Android Studio with Android SDK bundle http://tools.android.com/download/studio/canary/latest/
* Locate the "sdk/platform-tools" directory and add it to your system path

Install Client (Binary)
-----------------------
* Download the WearScript source, Setup Your Device, and Get Android Studio (see above)
* In the WearScript source go to glass/thirdparty and run the command "bash install_with_binary_wearscript.sh"

Install Client (Source)
-----------------------
* Download the WearScript source, Setup Your Device, and Get Android Studio (see above)
* Start Android Studio (Linux: bash android-studio/bin/studio.sh)
* Click "Import Project" and select wearscript/glass  (NOTE: make sure you use the "glass" directory)
* Select "Import project from external model" and use Gradle
* Select "Use default gradle wrapper" (it is the default), after this it will say Building 'glass' and take some time
* Build using Run->Run 'WearScript'
* After it is built, Select your device and install.
* Keep the screen on while it is installing or it will be started in the background.

Starting the Client
-------------------
* If you install the "thirdparty" tools as recommended, you can use Launchy (go to the far left where settings is, tap, select WearScript (start))
* To start with adb use "adb shell am start -n com.dappervision.wearscript/.MainActivity"
* To start with Android Studio after the project has been imported (see Install Client (Source)) select Run->Run 'WearScript'. 

Client Installation Video
-------------------------
This assumes Android Studio and SDK are installed (see above)
.. raw:: html

        <object width="480" height="385"><param name="movie"
        value="http://www.youtube.com/v/lUCiqhWnRjg&hl=en_US&fs=1&rel=0"></param><param
        name="allowFullScreen" value="true"></param><param
        name="allowscriptaccess" value="always"></param><embed
        src="http://www.youtube.com/v/lUCiqhWnRjg&hl=en_US&fs=1&rel=0"
        type="application/x-shockwave-flash" allowscriptaccess="always"
        allowfullscreen="true" width="480"
        height="385"></embed></object>

Using Our Server
----------------
* Visit https://api.picar.us/wearscript/, click "authenticate", then sign-in using your Google acccount
* Contact brandyn in #openshades on IRC freenode to be white-listed (you must authenticate before we can add you)
* After being whitelisted you can continue "Connecting the Client to the Server"

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

Install WearScript VM (Client + Server)
---------------------------------------
* Get the WearScript source (see above)
* Get/install Vagrant (go here http://downloads.vagrantup.com/ get the newest version for your platform)
* In a terminal run: vagrant box add saucy64 http://cloud-images.ubuntu.com/vagrant/saucy/current/saucy-server-cloudimg-amd64-vagrant-disk1.box
* Enter the wearscript/vagrant directory, and run "vagrant up" (takes about 10 minutes)
* You now have: Ubuntu 13.10, Android Studio, all client/server dependencies, and a fresh copy of WearScript inside.
* Use "vagrant ssh" to enter the VM (if you launch a graphical program such as Android Studio it will start in your native window environment)
* Client: Follow "Install Client (source)" above (starting with importing "wearscript/glass" as a new project)
* Server: Follow the "Install Server" above (starting from setting up config.go)

Connecting the Client to the Server
-----------------------------------
* Go to the server in Chrome (please use Chrome, it is easier for us to support)
* Click "authenticate", then sign-in using your Google acccount
* Click QR, then either
  * Paste the adb command while Glass is plugged connected to USB
  * Select WearScript (setup) and scan the QR code
* Open WearScript (start) using Launchy while you have the webapp open, you should see the cube/table pop up and buttons enable on the bottom.
