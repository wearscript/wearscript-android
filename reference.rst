API Reference
==============

WearScript Syntax
-----------------
In the JavaScript environment there is a WS object that has the following method calls

* WS.scriptVersion(int version):
* WS.sensor(String name) -> sensor int: Used to convert from sensor names to the underlying int types

  * For the Android built in sensors (anything that WS.sensor(name) is > 0 for) see the Android docs for their values, custom values are...
  * battery: Values [battery_percentage] (same as displayed in the Glass settings)
  * pupil: Values [pupil_y, pupil_x, radius]
  * gps: Values [lat, lon]

* WS.sensors() -> JSON Object with keys as sensor names and values as int types
* WS.sensorOn(int type, double period): Turn on the sensor and produce data no faster than the specific period.  Best used with WS.sensor like WS.sensorOn(WS.sensor('light'), .5).
* WS.sensorOn(int type, double period, String callback): Above but with callback name that is called at most once per period.

  * Callback has parameters of the form function callback(data) {} with "data" being an object of the form property(value type) of...
  * name(string): Unique sensor name (uses Android name if one exists)
  * type(int): Unique sensor type (uses Android type if one exists), convert between them using WS.sensor(name) -> type
  * timestamp(double): Epoch seconds from when we get the sensor sample (use this instead of Raw unless you know better)
  * timestampRaw(long): Potentially differs per sensor (we use what they give us if available), but currently all but the light sensor are nanosec from device uptime
  * values(double[]): Array of float values (see WS.sensor docs for description)

* WS.sensorOff(int type)
* WS.say(String message): Uses Text-to-Speach to read text
* WS.qr(String callback): Open a QR scanner, return scan results via a callback from zxing

  * Callback has parameters of the form function callback(data, format)
  * data(string): The scanned data (e.g., http://wearscript.com)
  * format(string): The format of the data (e.g., QR_CODE)


* WS.log(String message): Log a message to the Android log and the JavaScript console of the webapp (if connected to a server).
* WS.displayWebView(): Display the WebView activity (this is the default, reserved for future use when we may have alternate views).
* WS.shutdown(): Shuts down wearscript
* WS.data(int type, String name, String valuesJSON): Log "fake" sensor data made inside the script, will be logged based on the WS.dataLog settings.
* WS.audioOn(): Logs noise level to server
* WS.audioOff(): Stops noise callbacks
* WS.cameraOn(double period): Camera frames are output based on the WS.cameraCallback and WS.dataLog options.
* WS.cameraPhoto(): Take a picture and save to the SD card.
* WS.cameraVideo(): Record a video and save to the SD card.
* WS.cameraCallback(int type, String callback): Type 0=local camera, 1=remote camera (subject to change).

  * Callback has parameters of the form function callback(imageb64)
  * imageb64(string): The image represented as a jpeg base64 encoded

* WS.cameraOff()
* WS.activityCreate(): Creates a new activity in the foreground and replaces any existing activity (useful for bringing window to the foreground)
* WS.activityDestroy(): Destroys the current activity.
* WS.wifiOn(): Turn on wifi scanning
* WS.wifiOn(String callback): Previous but provide a callback to get results

  * Callback has parameters of the form function callback(results) where results is an array of objects each of the form following `ScanResult <http://developer.android.com/reference/android/net/wifi/ScanResult.html>`_ except for the timestamp...
  * timestamp(double): Epoch seconds from when we get the wifi scan
  * capabilities(string):  Authentication, key management, and encryption schemes supported by the access point
  * SSID(string): network name
  * BSSID(string):  address of the access point
  * level(int): detected signal level in dBm (may have a different interpretation on Glass)
  * frequency(int):  frequency in MHz of the channel over which the client is communicating with the access point

* WS.wifiScan(): Request a wifi scan.
* WS.wifiOff()
* WS.serverConnect(String server, String callback): Connects to the WearScript server, if given '{{WSUrl}}' as the server it will substitute the user configured server.  Some commands require a server connection.

  * Callback takes no parameters and is called when a connection is made, if there is a reconnection it will be called again.

* WS.serverTimeline(timelineItemJSON): If connected to a server, has that server insert the timeline item (exact mirror timeline item syntax serialized to JSON)
* WS.dataLog(boolean local, boolean server, double sensorPeriod): Log data local and/or remote, buffering sensor packets according to sensorPeriod.
* WS.wake(): Wake the screen if it is off, shows whatever was there before (good in combination with WS.activityCreate() to bring it forward).
* WS.blobSend(String name, String blob): Send a text blob (may be binary) to the server.
* WS.blobCallback(String name, String callback): Get text blobs from the server with the matching "name"

  * Callback has parameters of the form function callback(data)
  * data(string): base64 encoded blob data (this can be decoded using btoa(blobb64)), this is for security reasons.

WearScript Syntax (GDK features)
---------------------------------
* WS.gestureCallback(String event, String callback): Register to get gesture events using the string of one of the events below (following GDK names, see below).

  * Each of these follows the `parameters provided by the GDK <https://developers.google.com/glass/develop/gdk/reference/com/google/android/glass/touchpad/GestureDetector>`_
  * onGesture(String gesture): The gestures that can be returned are `listed here <https://developers.google.com/glass/develop/gdk/reference/com/google/android/glass/touchpad/Gesture>`_: LONG_PRESS, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT, TAP, THREE_LONG_PRESS, THREE_TAP, TWO_LONG_PRESS, TWO_SWIPE_RIGHT, TWO_SWIPE_UP, TWO_TAP
  * onFingerCountChanged(int previousCount, int currentCount): 
  * onScroll(float displacement, float delta, float velocity):
  * onTwoFingerScroll(float displacement, float delta, float velocity):

* WS.speechRecognize(String prompt, String callback): Displays the prompt and calls your callback with the recognized speech as a string

  * Callback has parameters of the form function callback(text)
  * text(string): Recognized text

* WS.liveCardCreate(boolean nonSilent, double period): Creates a live card of your activity, if nonSilent is true then the live card is given focus.  Live cards are updated by polling the current activity, creating a rendering, and drawing on the card.  The poll rate is set by the period.  Live cards can be clicked to open a menu that allows for opening the activity or closing it.
* WS.liveCardDestroy(): Destroys the live card.
* WS.cardFactory(String text, String info): Creates a cardJSON that can be given to the card insert/modify functions, the "text" is the body and the "info" is the footer.
* WS.cardInsert(int position, String cardJSON): Insert a card at the selected position index.
* WS.cardDelete(int position): Delete a card at the selected position index.
* WS.cardModify(int position, String cardJSON): Modify (replaces) a card at the selected position index.
* WS.cardCallback(String event, String callback): Register to get card callback events using hte string of one of the events below (following GDK names, see below).

  * Each of these follows the `callbacks of the same name <https://developers.google.com/glass/develop/gdk/reference/com/google/android/glass/widget/CardScrollView>`_ in the GDK
  * onItemClick(int position, int id): Called when a card is clicked
  * onItemSelected (int position, int id): Called when a card is displayed
  * onNothingSelected(): Called when not on a card (e.g., scrolling between cards or when there are no cards).

* WS.displayCardScroll(): Displays the card scroll view instead of the webview.


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
