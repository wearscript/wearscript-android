Preliminary Setup (ADT/Glass Debug)
===================================
* Download/Unpack Android SDK (ADT Bundle): http://developer.android.com/sdk/index.html
* Setup the ADT paths (e.g., the "adb" command should be in the path).  This can be accomplished with something like this in your .bashrc (replace $ADT with the path) "export PATH=$PATH:$ADT/sdk/tools:$ADT/sdk/platform-tools".
* Put Glass in debug mode (Settings -> Device Info -> Turn on debug)
* Installed third party apk's: cd openglass/android/thirdparty  then bash install.sh

Binary Install (not-recommended)
================================
* In openglass/android/bin run "adb install OpenGlass.apk"

Source Install (recommended)
===============================
* Download/Unpack OpenCV: http://sourceforge.net/projects/opencvlibrary/files/opencv-android/2.4.6/OpenCV-2.4.6-android-sdk-r2.zip/download
* Open ADT eclipse, New->Project->Android Project From Existing Code (do this for <OpenCV dir>/sdk and openglass/android)
* In ADT, Right click on OpenGlass -> Properties -> Android under Library click "Add", then select the OpenCV Library.  Alternatively, you can manually set the path in openglass/android/project.properties at "android.library.reference.1=".
* Install to the device by selecting, Run -> Run As... -> Android Application

Post Install
============
* Under Launchy (on Glass go to Settings, it replaces it) run OpenGlass (should display a QR code scanner)
* In the OpenGlass web app, click OpenGlass and scan the QR code
* You can now use the OpenGlass web app to control OpenGlass (it's mobile friendly!)
* If you want to skip the QR scan, swipe down once and the previous URL/user/auth are used and the last config is recycled until the server gives an update (happens immediately if there is a connection).  This allows for using the app even if there is no internet connection which is useful for data collection.
