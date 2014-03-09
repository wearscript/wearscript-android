.. _wire:

Websocket Wire Format
=====================

All encoding is done using `msgpack <http://msgpack.org>`_ with lists as the base structure that have a string type as the first element.  Websockets with a binary message payload a
re used.  Message delivery follows a pub/sub pattern.


Motivation and Goals
--------------------

* Keep local data local if possible (e.g., glass -> phone shouldn't need to go through a server if they are connected)
* Pub/Sub over Point-to-Point: Focusing on channels which represent data types naturally handles 0-to-many devices reacting to it.
* Minimize data transfer, if nothing is listening on a channel then sending to it is a null-op
* Support a directed-acyclic-graph topology, where local devices can act as hubs (e.g., a phone is a hub for a watch, Glass, and arduino) and connect to other hubs (e.g., a remote s
erver)
* Instead of having strict guarantees about delivery, provide a set of constraints that can be met given the fickle nature of mobile connectivity to eliminate edge cases

Protocol Rules
--------------

* Messages are delivered with "best effort" but not guaranteed: devices can pop in and out of existance and buffers are not infinite
* If a sender's messages are delivered they are in order
* A message SHOULD only be sent to a client that is subscribed to it or is connected to clients that are
* A message sent to a client that neither it or its clients are subscribed to MUST ignore it
* The "subscriptions" channel is special in that it MUST be sent to all connected clients
* When a client connects to a server it MUST be send the subscriptions for itself and all other clients
* If multiple channels match for a client the most specific MUST be called and no others
* When a client subscribes to a channel a single callback MUST be provided

The following table gives examples for when data will be sent given that there is a listener for the specified channel.

+------+------+------+
|  sub | send | sent |
+------+------+------+
| ""   |  a   | false|
+------+------+------+
| ""   |   "" | true |
+------+------+------+
|  a   |   a  | true |
+------+------+------+
|  a   |  a:b | true |
+------+------+------+
|  b   |  a:b | false|
+------+------+------+
| a:   | a    | false|
+------+------+------+
| a:   |  a:b | false|
+------+------+------+
|  a:  |  a::b| true |
+------+------+------+
|  a:b |  a   |false |
+------+------+------+
|  a:b |  a:b | true |
+------+------+------+
|  a:b |  a:bc| false|
+------+------+------+
|  a:b |a:b:c | true |
+------+------+------+
