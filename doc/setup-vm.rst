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
