Hacking Guide
=============

Resources
---------
These are helpful for development

* https://code.google.com/p/google-api-go-client/source/browse/mirror/v1/mirror-gen.go
* http://golang.org/doc/effective_go.html
* https://developers.google.com/glass/playground


Clock deskew and latency estimation
-----------------------------------
* Glass sends data to server (potentially big) and includes a timestamp (Tg0)
* Server sends ack to glass with its own timestamp (Ts0) and the previous timestamp (Tg0)
* Glass computes new timestamp (Tg1) and sends back (Tg0, Tg1, Ts0, Tg1)
* Server computes k = Tg - Ts (skew), D = D1 = D2  (delay, assuming last two equal), and data delay D0.
* D = .5 * (Ts1 - Ts0), k = Tg1 - Ts1 + D, and D0 = Ts0 + k - tg0

```
Glass        Server
Tg0  - D0 -> Ts0
Tg1 <- D1 -  Ts0
Tg1 -  D2 -> Ts1
```

Timeline Item Styling
---------------------

For glassware the timeline items are styled using HTML/CSS.  The dev playground helps a lot (link above).