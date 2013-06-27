OpenGlass
=========

First public preview, it's a work in progress (needs to be cleaned up, was written on the bus ride to NYC from DC when we got glass) but we wanted to get it out as early as possible.

Right now it has two modes

1. If it is sent an image without text it runs an indoor classifier on it with the result being sent as a timeline item.  See demo http://youtu.be/hhWBvoqop2o
2. If it is sent an image with text it is used as a question for human annotation with the results being sent as timeline items.  See demo http://youtu.be/7DVFbWQ1di8

It is not expected that you will be able to run this yourself easily, it is primarily to share ideas and collaborate.

License
-------
Apache 2.0

Install
-------
If you want access to our demo server contact us, if you want to run this yourself definitely contact us (it requires a http://picar.us cluster with a classification model trained).

* go get code.google.com/p/goauth2/oauth
* go get code.google.com/p/google-api-go-client/googleapi
* go get code.google.com/p/google-api-go-client/mirror/v1
* go build main.go

Contact
-------
Brandyn White <bwhite dappervision com>
