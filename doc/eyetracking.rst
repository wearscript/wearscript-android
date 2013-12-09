Eye Tracking
============

We developed a custom eye tracker for Glass so that we can experiment with using it as an input device.  It is for research and development purposes, there is a lot of potential for this sub-project but it is still early so bare with us.  To make it easier to support you, please follow :ref:`vm-setup`.  See the video below for details of this project.

.. raw:: html

  <div style="position: relative;margin-bottom: 30px;padding-bottom: 56.25%;padding-top: 30px; height: 0; overflow: hidden;">
    <iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="http://www.youtube.com/embed/QSn6s3DPTSg" frameborder="0"></iframe>
  </div>


.. raw:: html

  <script src="https://embed.github.com/view/3d/OpenShades/wearscript/master/hardware/eyetracker/eye_tracker2.stl"></script>

Getting Started
---------------

* Install the VM (:ref:`vm-setup`)
* Acquire/build an eye tracker (best to contact brandyn in IRC)
* Attach the webcam to the vm (see below)
* In hardware/eyetracker/ run python track.py debug, that will show you the eye camera and it should show a ring around your pupil
* We have several things you can do with it after this, but we are tidying things up (more info will be posted here after)


Building an Eye Tracker
------------------------

* http://www.amazon.com/Microsoft-LifeCam-HD-6000-Webcam-Notebooks/dp/B00372567A
* 2 LEDs (recommend you get 4+ as you may break/lose some while soldering): http://www.digikey.com/product-detail/en/SFH%204050-Z/475-2864-1-ND/2207282 (shipping was $2.50 and each LED is ~$.75-$1 depending on amount)
* Access to a 3d printer (print the .stl file, currently #2 is the best design)
* Skills: Need to teardown a camera (requires patience), surface mount (de)solder LEDs (is doable with normal soldering equipment), need to take off/break the IR filter on the optics (requires the care)
* Tools (see build video): Side cutter, thin phillips screwdriver, spudger/x-acto knife (remove IR filter), soldering iron, solder, prybar, wrench (for cracking open case)

.. raw:: html

  <div style="position: relative;margin-bottom: 30px;padding-bottom: 56.25%;padding-top: 30px; height: 0; overflow: hidden;">
    <iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="http://www.youtube.com/embed/K4k8SOrJM0c" frameborder="0"></iframe>
  </div>


Attach the Webcam to the VM
---------------------------

* From a terminal on the host OS
  
  * VBoxManage list webcams
  * VBoxManage list vms
  * VBoxManage controlvm <yourvm name> webcam attach <your webcam id>

* From the Virtual Box gui (when vb.gui = true in Vagrantfile)

  * Devices -> Webcams -> Microsoft LifeCam HD-6000 for Notebooks
  * If it isn't listed or otherwise isn't working try rebooting the box or using a different usb port with the camera

Tips
-----

* The webcam must be manually focused, if it appears blurry twist the lens until the image is in focus.  It may help to take the webcam out of the plastic mount and hold it roughly where it would be while doing this.
* When using the VM, we want virtual box to use the webcam as a webcam.  Virtualbox uses the host to capture from the webcam and has a good driver on the guest side.  Specifically we don't want it to expose it through usb directly.
* The 'Vagrantfile' has a line that specifies vb.gui, if this is set to true then the virtual box gui is presented (useful for more easily connecting/disconnecting the webcam).  If it is false then we can only use vagrant ssh to connect (though X11 connections are still tunneled).  If you change it use "vagrant reload" to restart the vm and parse that file.

