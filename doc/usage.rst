Using WearScript
================

Using the Playground
---------------------
The playground is a webapp that connects with WearScript while it is running on Glass.  It allows you to execute scripts and visualize the sensors/images from Glass.

* Go to the playground page for the server you'd like to use (if it's your first time, you'll sign into your Google account)
* After authorizing the webapp with Google, click the QR button the top right
* Ensure that Glass has an internet connection, WiFi is highly recommended
* There are two options to authenticate your glass
    * An ADB command will be shown, paste that into our console (it adds the server/auth key you need)
    * Use the WearScript (Setup) activity to scan the QR code
* On Glass, open up Launchy (go to the far left, tap settings, now you are in Launchy)
* Select WearScript (Start)
* If successfull, the buttons on the bottom of the Playground will enable.
* You may now send scripts, two examples are provided (you can click Wear This Script or Wear Script From URL)

WearScript Usage Notes
-----------------------
* If you swipe down the script will continue to run in the background
* To turn off WearScript open the webapp and press shutdown.
* When calling WS.serverConnect, if the argument passed is exactly '{{WSUrl}}' then it will be replaced with the websocket url corresponding to the server the playground is running on and the last QR code generated.
* If you use a script that doesn't make a server connection (i.e., WS.serverConnect('{{WSUrl}}'), 'callback') then you won't be able to control WearScript from the webapp
* More interesting uses of WS.serverConnect include making a custom server for your application and then Glass will connect to it and stream data while your app can continue to control Glass.
* Every time you press the QR button on the webapp you get a unique auth key which replaces the previous.
* You only need to auth your Glass once and then again anytime you want to change servers (using the adb command provided when you press the QR button).
* When using scripts in the Playground editor, make sure to specify http:// or https:// and NOT use refer to links like <script type="text/javascript" src="//example.com/test.js"></script>.  The script you put in the editor will be saved locally on Glass, and links of that form will not work.
* If you are connected to a server and use WS.log('Hi!'), that message will show up in the Android logs and the javascript console in the Playground.
