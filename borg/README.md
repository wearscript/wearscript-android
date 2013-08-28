* Download/Unpack Android SDK (ADT Bundle): http://developer.android.com/sdk/index.html
* Setup the ADT paths (e.g., the "adb" command should be in the path).  This can be accomplished with something like this in your .bashrc (replace ADB_BUNDLE_PATH) "export PATH=$PATH:ADB_BUNDLE_PATH/sdk/tools".
* Put Glass in debug mode (Settings -> Device Info -> Turn on debug)
* Installed third party apk's: cd openglass/borg/thirdparty  then bash install.sh (read it first to see what it is doing)
* Download/Unpack OpenCV: http://sourceforge.net/projects/opencvlibrary/files/opencv-android/2.4.6/OpenCV-2.4.6-android-sdk-r2.zip/download
* Open ADT eclipse, New->Project->Android Project From Existing Code (do this for <OpenCV dir>/sdk and openglass/borg)
* In ADT, Right click on OpenGlass Borg -> Properties -> Android under Library click "Add", then select the OpenCV Library.  Alternatively, you can manually set the path in openglass/borg/project.properties at "android.library.reference.1=".
* Now you should be able to build the apk