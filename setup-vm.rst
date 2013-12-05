.. _vm-setup:

Virtual Machine
===============
By using the VM you will get a full development environment and server.  This makes it easier to assist with any problems you run into since we can replicate the environment and fixes only need to be applied once to the VM.  If you intend to run this on your personal computer use Vagrant and for servers we recommend EC2.

0a. Install WearScript VM using Vagrant
--------------------------------------
* with one click: `Click to Download ZIP <https://github.com/OpenShades/wearscript/archive/master.zip>`_ or using git: git clone https://github.com/OpenShades/wearscript.git
* Install virtual box and the "Oracle VM VirtualBox Extension Pack" (needed for usb) from https://www.virtualbox.org/wiki/Downloads
* Get/install Vagrant (go here http://downloads.vagrantup.com/ get the newest version for your platform)
* OSX: You need XQuarts to enable X11 support (to open Android Studio, etc.)  http://xquartz.macosforge.org/landing/
* Download this box http://goo.gl/CLuK6P
* In a terminal run: vagrant box add saucy64 ubuntusaucy64-gui.box
* Enter the wearscript/vagrant directory, and run "vagrant up" (takes about 17 minutes on a Macbook Pro)
* The setup is complete after puppet finishes, before then it is possible to use the VM but it's best to let it complete.
* Manual step for sudo adb: Run "sudo visudo" and comment out the line with "secure_path" by prefixing with #
* Note: Install requires a solid internet connection, if puppet stops silently it is likely because the internet timed out

0b. Install WearScript VM on EC2
---------------------------------

* Use `this EC2 image <https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LaunchInstanceWizard:ami=ami-4b143122>`_ with any compatible instance you'd like (c1.medium and m1.medium work well)
* Login with ssh ubuntu@<public hostname>
* Run the following command (takes about 5 minutes on a c1.medium)

.. code-block:: bash

  sudo apt-get install -y puppet && curl https://raw.github.com/OpenShades/wearscript/master/vagrant/manifests/init.pp > init.pp && sudo puppet apply init.pp

* You will need to log out and back in for the environment to update

1: Using the Box
-----------------
* You now have: Ubuntu 13.10, Android Studio, all client/server dependencies, and a fresh copy of WearScript inside your home directory
* Vagrant

  * vagrant up: Start VM (the first time you do this it runs Puppet, etc. if things don't work you need to do "vagrant destroy", fix the problem, and try again). The VM is running in the background (use vagrant halt to stop it) or if vb.gui = true a terminal will pop up.
  * vagrant destroy: Destroys the working VM (the box is still there but all changes you made are discarded)
  * vagrant ssh: to enter the VM (if you launch a graphical program such as Android Studio it will start in your native window environment).  If your router has tricky dhcp settings it may break your localhost connect and cause hard to diagnose problems, keep this in mind if you get strange ssh errors/timeouts.
  * vagrant reload: Restarts your VM and parses the Vagrant file (doesn't re-run puppet just changes ports, etc in Vagrantfile)
  * vagrant halt: Shuts down the VM.

* Client: Follow "Install Client (source)" above (starting with importing "wearscript/glass" as a new project)
* Server: Follow the "Install Server" above (starting from setting up config.go)
