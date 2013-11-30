.. _vm-setup:

Virtual Machine
===============
By using the VM you will get a full development environment and server.  This makes it easier to assist with any problems you run into since we can replicate the environment and fixes only need to be applied once to the VM.  If you intend to run this on your personal computer use Vagrant and for servers we recommend EC2.

0a. Install WearScript VM using Vagrant
--------------------------------------
* with one click: `Click to Download ZIP <https://github.com/OpenShades/wearscript/archive/master.zip>`_ or using git: git clone https://github.com/OpenShades/wearscript.git
* https://www.virtualbox.org/wiki/Downloads
* Get/install Vagrant (go here http://downloads.vagrantup.com/ get the newest version for your platform)
* In a terminal run: vagrant box add saucy64 http://cloud-images.ubuntu.com/vagrant/saucy/current/saucy-server-cloudimg-amd64-vagrant-disk1.box
* Enter the wearscript/vagrant directory, and run "vagrant up" (takes about 17 minutes on a Macbook Pro)

0b. Install WearScript VM on EC2
---------------------------------

* Use `this EC2 image <https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LaunchInstanceWizard:ami=ami-4b143122>`_ with any compatible instance you'd like (c1.medium and m1.medium work well)
* Login with ssh ubuntu@<hostname>
* Run the following command

.. code-block:: bash

  sudo apt-get install -y puppet && curl https://raw.github.com/OpenShades/wearscript/master/vagrant/manifests/init.pp > init.pp && sudo puppet apply init.pp


1: Using the Box
-----------------
* You now have: Ubuntu 13.10, Android Studio, all client/server dependencies, and a fresh copy of WearScript inside your home directory
* Vagrant: Use "vagrant ssh" to enter the VM (if you launch a graphical program such as Android Studio it will start in your native window environment)
* Client: Follow "Install Client (source)" above (starting with importing "wearscript/glass" as a new project)
* Server: Follow the "Install Server" above (starting from setting up config.go)
