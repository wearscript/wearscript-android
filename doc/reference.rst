API Reference
==============
In your Javascript environment, an object `WS` is initialized and injected for you with the following methods.


General
----------
scriptVersion(int version) : boolean
     Checks if the webview is running on a specific version.

sensor(String name) : int
     Converts from sensor names to the underlying int types.

     * For the Android built in sensors (anything that WS.sensor(name) is > 0 for) see the Android docs for their values, custom values are...
     * battery: Values [battery_percentage] (same as displayed in the Glass settings)
     * pupil: Values [pupil_y, pupil_x, radius]
     * gps: Values [lat, lon]

sensors() : JSON
     Object with keys as sensor names and values as int types

sensorOn(int type, double period, [String callback]) : void
     Turn on the sensor and produce data no faster than the specific period.  Best used with WS.sensor like WS.sensorOn(WS.sensor('light'), .5).
     Optional callback name that is called at most once per period.
     Callback has parameters of the form function callback(data) {} with "data" being an object of the form property(value type) of...

     * name(string): Unique sensor name (uses Android name if one exists)
     * type(int): Unique sensor type (uses Android type if one exists), convert between them using WS.sensor(name) -> type
     * timestamp(double): Epoch seconds from when we get the sensor sample (use this instead of Raw unless you know better)
     * timestampRaw(long): Potentially differs per sensor (we use what they give us if available), but currently all but the light sensor are nanosec from device uptime
     * values(double[]): Array of float values (see WS.sensor docs for description)

sensorOff(int type) : void
   Turns off sensor

say(String message) : void
   Uses Text-to-Speach to read text

qr(String callback) : void
   Open a QR scanner, return scan results via a callback from zxing

   * Callback has parameters of the form function callback(data, format)
   * data(string): The scanned data (e.g., http://wearscript.com) base64 encoded (e.g., aHR0cDovL3dlYXJzY3JpcHQuY29t) as a security precaution.  Decode by doing atob(data) in javascript.
   * format(string): The format of the data (e.g., QR_CODE)


log(String message) : void
  Log a message to the Android log and the JavaScript console of the webapp (if connected to a server).

displayWebView() : void
  Display the WebView activity (this is the default, reserved for future use when we may have alternate views).

shutdown() : void
  Shuts down wearscript

data(int type, String name, String valuesJSON) : void
  Log "fake" sensor data made inside the script, will be logged based on the WS.dataLog settings.

audioOn() : void
  Logs noise level to server

audioOff() : void
  Stops logging noise

cameraOn(double period) : void
  Camera frames are output based on the `cameraCallback` and `dataLog` options.

cameraPhoto() : void
  Take a picture and save to the SD card.

cameraVideo() : void
  Record a video and save to the SD card.

cameraCallback(int type, String callback) : void
  Type 0=local camera, 1=remote camera (subject to change).

  * Callback has parameters of the form function `callback(String imageb64)`
  * imageb64 being the image represented as a base64 encoded jpeg

cameraOff() : void
  Turns off camera

activityCreate() : void
  Creates a new activity in the foreground and replaces any existing activity (useful for bringing window to the foreground)

activityDestroy() : void
  Destroys the current activity.

wifiOn([String callback]) : void
  Turn on wifi scanning with optional callback

  * Callback has parameters of the form function callback(results) where results is an array of objects each of the form following `ScanResult <http://developer.android.com/reference/android/net/wifi/ScanResult.html>`_ except for the timestamp...
  * timestamp(double): Epoch seconds from when we get the wifi scan
  * capabilities(string):  Authentication, key management, and encryption schemes supported by the access point
  * SSID(string): network name
  * BSSID(string):  address of the access point
  * level(int): detected signal level in dBm (may have a different interpretation on Glass)
  * frequency(int):  frequency in MHz of the channel over which the client is communicating with the access point

wifiScan() : void
  Request a wifi scan.

wifiOff() : void
  Turn off wifi

serverConnect(String server, String callback) : void
  Connects to the WearScript server, if given '{{WSUrl}}' as the server it will substitute the user configured server.  Some commands require a server connection.

  * Callback takes no parameters and is called when a connection is made, if there is a reconnection it will be called again.

serverTimeline(JSON timelineItem) : void
  If connected to a server, has that server insert the timeline item (exact mirror timeline item syntax serialized to JSON)

dataLog(boolean local, boolean server, double sensorPeriod) : void
  Log data local and/or remote, buffering sensor packets according to sensorPeriod.

wake() : void
  Wake the screen if it is off, shows whatever was there before (good in combination with WS.activityCreate() to bring it forward).

sound(String type) : void
  Play a stock sound on Glass.  One of TAP, DISALLOWED, DISMISSED, ERROR, SELECTED, SUCCESS.

blobSend(String name, String blob) : void
  Send a text blob (may be binary) to the server.

blobCallback(String name, String callback) : void
  Get text blobs from the server with the matching "name"

  * Callback has parameters of the form function callback(data)
  * data(string): base64 encoded blob data (this can be decoded using btoa(blobb64)), this is for security reasons.

GDK-only
--------
gestureCallback(String event, String callback) : void
  Register to get gesture events using the string of one of the events below (following GDK names, see below).

  * Each of these follows the `parameters provided by the GDK <https://developers.google.com/glass/develop/gdk/reference/com/google/android/glass/touchpad/GestureDetector>`_
  * onGesture(String gesture): The gestures that can be returned are `listed here <https://developers.google.com/glass/develop/gdk/reference/com/google/android/glass/touchpad/Gesture>`_: LONG_PRESS, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT, TAP, THREE_LONG_PRESS, THREE_TAP, TWO_LONG_PRESS, TWO_SWIPE_RIGHT, TWO_SWIPE_UP, TWO_TAP
  * onFingerCountChanged(int previousCount, int currentCount):
  * onScroll(float displacement, float delta, float velocity):
  * onTwoFingerScroll(float displacement, float delta, float velocity):

speechRecognize(String prompt, String callback) : void
  Displays the prompt and calls your callback with the recognized speech as a string

  * Callback has parameters of the form function `callback(String recognizedText)`

liveCardCreate(boolean nonSilent, double period) : void
  Creates a live card of your activity, if nonSilent is true then the live card is given focus.  Live cards are updated by polling the current activity, creating a rendering, and drawing on the card.  The poll rate is set by the period.  Live cards can be clicked to open a menu that allows for opening the activity or closing it.

liveCardDestroy() : void
  Destroys the live card.

cardFactory(String text, String info) : JSON
  Creates a cardJSON that can be given to the card insert/modify functions, the "text" is the body and the "info" is the footer.

cardInsert(int position, JSON card) : void
  Insert a card at the selected position index.

cardDelete(int position) : void
  Delete a card at the selected position index.

cardModify(int position, JSON card) : void
  Modify (replaces) a card at the selected position index.

cardCallback(String event, String callback) : void
  Register to get card callback events using hte string of one of the events below (following GDK names, see below).

  * Each of these follows the `callbacks of the same name <https://developers.google.com/glass/develop/gdk/reference/com/google/android/glass/widget/CardScrollView>`_ in the GDK
  * onItemClick(int position, int id): Called when a card is clicked
  * onItemSelected (int position, int id): Called when a card is displayed
  * onNothingSelected(): Called when not on a card (e.g., scrolling between cards or when there are no cards).

displayCardScroll() : void
  Displays the card scroll view instead of the webview.


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

