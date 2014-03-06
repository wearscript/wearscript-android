Tips/Tricks
============

* If you swipe down the script will continue to run in the background
* To turn off WearScript start it and select "Stop" (swipe one option to the right)
* When calling WS.serverConnect, if the argument passed is exactly '{{WSUrl}}' then it will be replaced with the websocket url corresponding to the server the playground is running on and the last QR code generated.
* Unless you use a script that makes a server connection (i.e., WS.serverConnect('{{WSUrl}}'), 'callback') you will not be able to control WearScript from the webapp
* More interesting uses of WS.serverConnect include making a custom server for your application and then Glass will connect to it and stream data while your app can continue to control Glass.
* Every time you press the QR button on the webapp you get a unique auth key which replaces the previous.
* Multiple Glass devices can use the same QR code
* You only need to auth your Glass once and then again anytime you want to change servers (using the adb command provided when you press the QR button).
* When using scripts in the Playground editor, make sure to specify http:// or https:// and NOT use refer to links like <script type="text/javascript" src="//example.com/test.js"></script>.  The script you put in the editor will be saved locally on Glass, and links of that form will not work.
* If you are connected to a server and use WS.log('Hi!'), that message will show up in the Android logs and the javascript console in the Playground.
