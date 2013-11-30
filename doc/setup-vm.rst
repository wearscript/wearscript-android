.. _vm-setup:

Install WearScript VM using Vagrant
===================================

0: Get WearScript Source
------------------------
* with one click: `Click to Download ZIP <https://github.com/OpenShades/wearscript/archive/master.zip>`_
* using git: git clone https://github.com/OpenShades/wearscript.git

1: Install Virtual Box
-----------------------
* https://www.virtualbox.org/wiki/Downloads

2: Install Vagrant
------------------------
* Get/install Vagrant (go here http://downloads.vagrantup.com/ get the newest version for your platform)
* In a terminal run: vagrant box add saucy64 http://cloud-images.ubuntu.com/vagrant/saucy/current/saucy-server-cloudimg-amd64-vagrant-disk1.box
* Enter the wearscript/vagrant directory, and run "vagrant up" (takes about 17 minutes on a Macbook Pro)

3: Using the Box
------------------------
* You now have: Ubuntu 13.10, Android Studio, all client/server dependencies, and a fresh copy of WearScript inside.
* Use "vagrant ssh" to enter the VM (if you launch a graphical program such as Android Studio it will start in your native window environment)
* Client: Follow "Install Client (source)" above (starting with importing "wearscript/glass" as a new project)
* Server: Follow the "Install Server" above (starting from setting up config.go)



Install WearScript VM on EC2
=============================

0: Acquire an EC2 Instance
------------------------------
* Use `this EC2 image <https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LaunchInstanceWizard:ami=ami-4b143122>`_ with any compatible instance you'd like (c1.medium and m1.medium work well)
* Login with ssh ubuntu@<hostname>
* Run the following command

.. code-block:: bash

  sudo apt-get install puppet && curl https://raw.github.com/OpenShades/wearscript/master/vagrant/manifests/init.pp > init.pp && sudo puppet apply init.pp


Connecting the Client to the Server
-----------------------------------
* Go to the server in Chrome (please use Chrome, it is easier for us to support)
* Click "authenticate", then sign-in using your Google acccount
* Click QR, then either
  * Paste the adb command while Glass is plugged connected to USB
  * Select WearScript (setup) and scan the QR code
* Open WearScript (start) using Launchy while you have the webapp open, you should see the cube/table pop up and buttons enable on the bottom.
