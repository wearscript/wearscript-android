Websocket Wire Format
=====================

All encoding is done using `msgpack <http://msgpack.org>`_ with lists as the base structure that have a string type as the first element.  Websockets with a binary message payload are used.

* ('startScript', script)
* ('saveScript', script, name)
* ('signScript', script)
* ('startScriptUrl', url)
* ('log', message)
* ('raven', ravenDSN)
* ('pingStatus')
* ('version', version), where version is an integer
* ('pongStatus', glassID)
* ('sensors', glassID, types, sensors)

  * types: map from name (string) -> type (int)
  * sensors: map from name (string) -> samples (list of sensor)
  * sensor: (values, timestamp, timestampRaw)
  * Explanation: This is done for a few
  * Factor out redundancy (e.g., name and type)
  * Use strings (name in this case instead of type) for map keys (so that they can be used in javascript)
  * The sensors are in oldest/newest order (simple append on Glass)
  * By keeping them stored together, it makes many operations easier to do when working with them.

* ('image', glassID, timestamp, image)
* ('shutdown')
* ('connections', numGlass, numClient)
* ('timeline', timelineJS)
* ('blob', name, blob)
* ('widgetHeight', height): Used by widgets to tell the parent window how tall they should be
