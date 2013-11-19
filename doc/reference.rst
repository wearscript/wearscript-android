API Reference
==============

WearScript Syntax
-----------------
In the JavaScript environment there is a WS object that has the following method calls

* WS.scriptVersion(int version):
* WS.sensor(String name) -> sensor int: Used to convert from sensor names to the underlying int types
* WS.sensors() -> JSON Object with keys as sensor names and values as int types
* WS.sensorOn(int type, double period): Turn on the sensor and produce data no faster than the specific period.  Best used with WS.sensor like WS.sensorOn(WS.sensor('light'), .5).
* WS.sensorOn(int type, double period, String callback): 
* WS.sensorOff(int type)
* WS.say(String message): Uses Text-to-Speach to read text
* WS.log(String message): Log a message to the Android log and the JavaScript console of the webapp (if connected to a server).
* WS.displayWebView(): Display the WebView activity (this is the default, reserved for future use when we may have alternate views).
* WS.shutdown(): Shuts down wearscript
* WS.data(int type, String name, String valuesJSON): Log "fake" sensor data made inside the script, will be logged based on the WS.dataLog settings.
* WS.cameraOn(double period): Camera frames are output based on the WS.cameraCallback and WS.dataLog options.
* WS.cameraPhoto(): Take a picture and save to the SD card.
* WS.cameraVideo(): Record a video and save to the SD card.
* WS.cameraCallback(int type, String callback): Type 0=local camera, 1=remote camera (subject to change).
* WS.cameraOff()
* WS.activityCreate(): Creates a new activity in the foreground and replaces any existing activity (useful for bringing window to the foreground)
* WS.activityDestroy(): Destroys the current activity.
* WS.wifiOn(): Turn on wifi scanning
* WS.wifiOn(String callback): Previous but provide a callback to get results
* WS.wifiScan(): Request a wifi scan.
* WS.wifiOff()
* WS.serverConnect(String server, String callback): Connects to the WearScript server, if given '{{WSUrl}}' as the server it will substitute the user configured server.  Some commands require a server connection.
* WS.serverTimeline(timelineItemJSON): If connected to a server, has that server insert the timeline item (exact mirror timeline item syntax serialized to JSON)
* WS.dataLog(boolean local, boolean server, double sensorPeriod): Log data local and/or remote, buffering sensor packets according to sensorPeriod.
* WS.wake(): Wake the screen if it is off, shows whatever was there before (good in combination with WS.activityCreate() to bring it forward).
* WS.blobSend(String name, String blob): Send a text blob (may be binary) to the server.
* WS.blobCallback(String name, String callback): Get text blobs from the server with the matching "name", the callback is given one value which is the base64 encoded blob data (this can be decoded using btoa(blobb64)), this is for security reasons.

WearScript Syntax (GDK features)
---------------------------------
* WS.gestureCallback(String event, String callback): Register to get gesture events using the string of one of the events below (following GDK names).
* WS.speechRecognize(String prompt, String callback): Displays the prompt and calls your callback with the recognized speech as a string
* WS.liveCardCreate(boolean nonSilent, double period): Creates a live card of your activity, if nonSilent is true then the live card is given focus.  Live cards are updated by polling the current activity, creating a rendering, and drawing on the card.  The poll rate is set by the period.  Live cards can be clicked to open a menu that allows for opening the activity or closing it.
* WS.liveCardDestroy(): Destroys the live card.
* WS.cardFactory(String text, String info): Creates a cardJSON that can be given to the card insert/modify functions, the "text" is the body and the "info" is the footer.
* WS.cardInsert(int position, String cardJSON): Insert a card at the selected position index.
* WS.cardDelete(int position): Delete a card at the selected position index.
* WS.cardModify(int position, String cardJSON): Modify (replaces) a card at the selected position index.
* WS.cardCallback(String event, String callback): Register to get card callback events using hte string of one of the events below (following GDK names).
* WS.displayCardScroll(): Displays the card scroll view instead of the webview.

Gesture Callbacks (GDK)
-----------------------

* onGesture(String gesture): The gestures that can be returned are: TAP, LONG_PRESS, SWIPE_UP, SWIPE_LEFT, SWIPE_RIGHT, SWIPE_DOWN, TWO_LONG_PRESS, TWO_TAP, THREE_TAP (possibly incomplete)
* onFingerCountChanged(int i, int i2): 
* onScroll(float v, float v2, float v3):
* onTwoFingerScroll(float v, float v2, float v3):
* onVerticalScroll(float v, float v2, float v3):

Card Scroll View Callbacks (GDK)
--------------------------------

* onItemClick(int position, int id): Called when a card is clicked
* onItemSelected (int position, int id): Called when a card is displayed
* onNothingSelected(): Called when not on a card (e.g., scrolling between cards or when there are no cards).

Sensor Types
------------
Sensors have unique names and integer types that are used internally and can be used as WS.sensor('light') which returns 5.  The standard Android sensor types are positive and custom types are given negative numbers.

* pupil: -2
* gps: -1
* accelerometer: 1
* magneticField: 2
* orientation: 3
* gyroscope: 4
* light: 5
* gravity: 9
* linearAcceleration: 10
* rotationVector: 11
