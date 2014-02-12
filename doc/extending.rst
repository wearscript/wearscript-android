Custom Client/Server/Widget
===========================

WearScript was made with flexibility in mind and a common situation is that you'd like to run your own code on a computer and have it interact with Glass.

* Offline Config: Glass (simply don't connect to a server)

  * Ideal if you don't need internet, better reliability and safer when doing demos

* Playground: Glass (1+) <-> WS Server <-> Playground WebApp (1+ Computer/Phone)

  * Playground is a WebApp that allows you to program on Glass on the fly (see http://api.picar.us/wearscript/)
  * Messages sent from Glass to the server are forwarded to the webapp(s) and vice versa
  * If multiple webapps are open then the data is streamed to all of them
  * If multiple glasses are connected for a single user (e.g., they scan the same QR code) then their data will have separate rows in the playground
  * Sensor and image data streamed from Glass is displayed here
  * Glass can be shutdown from here

* Custom Widget: Glass (1+) <-> WS Server <-> Playground WebApp (1+ Computer/Phone) <-> Widget IFrame

  * A widget is run inside an iframe in the playground which isolates it from the environment
  * Can provide custom UI (e.g., buttons, graphs) that work in concert with the script in Glass
  * A widget has access to the same messages the webapp gets
  * The blob methods come in handy to send custom data from a script to the widget

* Custom Client: Glass (1+) <-> WS Server <-> Custom Client (1+) + Playground WebApp (1+ Computer/Phone)

  * The client(s) connect to the server and are treated exactly the same as the playground webapp
  * The client can be anything that follows :ref:`wire`
  * To get an endpoint url click "Client endpoint" in the Playground
  * Pro: Easy to setup (no changes on Glass), Playground can be used, can use multiple different ones
  * Con: Latency is slightly higher than a custom server (especially if your custom server is on the same network since we can bypass the WearScript server)

* Custom Server: Glass (1+) <-> Custom Server

  * Glass connects to your custom server the same as the WearScript server
  * The server can be anything that follows :ref:`wire`
  * You can use WS.serverConnect to dynamically change server (e.g., start using the WearScript server, run a script from playground, the script changes the server)
  * You can make a QR code with the custom websocket url to connect to or you can use adb (press "QR" in the playground and see the adb command)
  * See Custom Client for pros/cons of each


Example use cases for a custom client/server
--------------------------------------------

* Exotic hardware (e.g., arduino + servos, eye tracker) that you want to be connected to your computer
* CPU heavy software (e.g., computer vision, prototype augmented reality)
* Long running servers (e.g., IRC, web servers) that continue running while Glass may have a flaky connection
* Multi-Glass communication (e.g., Wearionette)


Python Client/Server Sample
---------------------------
In "tools/extend" there is a Python package that makes making custom a client/server easy.  Here is an example that prints each message received.

* To install the package use sudo python setup.py install
* This is designed to abstract the differences between the client/server libraries
* To run as a server use: python script.py server <port>
* To run as a client use: python script.py client <client_endpoint>
* Send data example: ws.send('blob', 'url', 'wearscript.com')
* Receive data example: data = ws.receive()


.. code-block:: python

    import wearscript
    import argparse

    if __name__ == '__main__':
	def callback(ws, **kw):
	    print('Got args[%r]' % (kw,))
	    print('Demo callback, prints all inputs and sends nothing')
	    while 1:
		print(ws.receive())
	wearscript.parse(callback, argparse.ArgumentParser())


Widget Sample
-------------

Widgets allow you to have a complementary webapp component to your scripts, below is an example of sending/receiving data and controlling the height in the playground.  A widget is added to the playground by appending &widget=<widget_url> to the playground url.  Note however that the widget must be served over https due to iframe security restrictions in browsers.

.. code-block:: html


    <html>
    <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>
    <script src="https://api.picar.us/wearscriptdev/static/msgpack.js"></script>
    </head>
    <body>
    <script>
    function enc(data) {
        var data_enc = msgpack.pack(data);
	var data_out = new Uint8Array(data_enc.length);
	var i;
        for (i = 0; i < data_enc.length; i++) {
            data_out[i] = data_enc[i];
        }
        return data_out;
    }
    window.addEventListener('message',function(e) {
    // Sends a message to the webapp
    // widgetHeight allows you to control the height in the playground
    parent.postMessage(enc(['widgetHeight', 50]), 'https://api.picar.us');
    parent.postMessage(enc(['shutdown']), 'https://api.picar.us');
    // Gets a message from the webapp
    $('#d').html(JSON.stringify(msgpack.unpack(e.data)));
    },false);
    </script>
    <div id="d">I'm an iframe!</div>
    </body>
    </html>
