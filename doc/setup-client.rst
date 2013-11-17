.. _client-setup:

Client Setup
============

0: Get WearScript Source
------------------------
* with one click: `Click to Download ZIP <https://github.com/OpenShades/wearscript/archive/master.zip>`_
* using git: git clone https://github.com/OpenShades/wearscript.git

1: Setup Your Device
--------------------
* Put the device in debug mode (see "Turning on debug mode" here https://developers.google.com/glass/gdk)
* Connect your Glass to your computer with a USB cable

2: Get Android Studio
---------------------
* Download/unpack the canary version of Android Studio with Android SDK bundle http://tools.android.com/download/studio/canary/0-3-2 note that this is the latest version WITH the sdk bundled, you can update once it is installed but this simplifies the install
* NOTE: If it can't find the SDK then follow these steps

    * If you need a new version of the SDK get the ADT Bundle here http://developer.android.com/sdk/index.html
    * Open Android Studio, click on Configure->Project Defaults->Project Structure and under Project SDK click New...->Android SDK and select the "sdk" folder inside of the ADT Bundle
    * If you have changed your SDK path you may need to remove wearscript/glass/local.properties (it retains the path to use for the project, it'll be reset to default on import)
* Locate the "sdk/platform-tools" directory and add it to your system path (this lets you use the "adb" command)

.. _client-setup-binary:

3a: Install Client (Binary)
----------------------------
* In the WearScript source go to glass/thirdparty and run the command "bash install_with_binary_wearscript.sh"

.. _client-setup-source:

3b: Install Client (Source)
----------------------------
* In the WearScript source go to glass/thirdparty and run the command "bash install.sh"
* Start Android Studio (Linux: bash android-studio/bin/studio.sh)
* Click "Import Project" and select wearscript/glass  (NOTE: make sure you use the "wearscript/glass" directory, if you select "wearscript" it won't work)
* Select "Import project from external model" and use Gradle
* Select "Use default gradle wrapper" (it is the default), after this it will say Building 'glass' and take some time
* Build using Run->Run 'WearScript'
* After it is built, Select your device and install.
* Keep the screen on while it is installing or it will be started in the background.

4: Starting the Client
-----------------------
* If you install the "thirdparty" tools as recommended, you can use Launchy (go to the far left where settings is, tap, select WearScript (start))
* To start with adb use "adb shell am start -n com.dappervision.wearscript/.MainActivity"
* To start with Android Studio after the project has been imported (see Install Client (Source)) select Run->Run 'WearScript'. 

5: Connecting the Client to the Server
--------------------------------------
* Go to the server in Chrome (please use Chrome, it is easier for us to support)
* Click "authenticate", then sign-in using your Google acccount
* Click QR, then either

  * Paste the adb command while Glass is plugged connected to USB
  * Select WearScript (setup) and scan the QR code

* Open WearScript (start) using Launchy while you have the webapp open, you should see the cube/table pop up and buttons enable on the bottom.


Client Installation Video
-------------------------
This assumes Android Studio and SDK are installed (see above)
-------------------------------------------------------------
.. raw:: html

        <object width="480" height="385"><param name="movie"
        value="http://www.youtube.com/v/lUCiqhWnRjg&hl=en_US&fs=1&rel=0"></param><param
        name="allowFullScreen" value="true"></param><param
        name="allowscriptaccess" value="always"></param><embed
        src="http://www.youtube.com/v/lUCiqhWnRjg&hl=en_US&fs=1&rel=0"
        type="application/x-shockwave-flash" allowscriptaccess="always"
        allowfullscreen="true" width="480"
        height="385"></embed></object>
