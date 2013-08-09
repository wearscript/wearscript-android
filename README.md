OpenGlass
=========

It's a work in progress but we wanted to get it out as early as possible.  For demos of this code see openglass.us (this readme would be out of data in terms of capabilities).  It is not expected that you will be able to run this yourself easily, it is primarily to share ideas and collaborate.

License
-------
Apache 2.0

Go Install
----------
* wget https://go.googlecode.com/files/go1.1.1.linux-amd64.tar.gz
* tar -xzf go1.1.1.linux-amd64.tar.gz
* Put "export GOROOT=<yourpath>/go" and "export GOPATH=<yourpath>/gocode" in your .bashrc
* The "gocode" is where packages will be stored and "go" is the location of the extracted folder.

Install
-------
If you want access to our demo server contact us, if you want to run this yourself definitely contact us (it requires a http://picar.us cluster with a classification model trained).

* Setup a config.go file (look at config.go.example)
* go get -u code.google.com/p/go.net/websocket
* go get -u code.google.com/p/goauth2/oauth
* go get -u code.google.com/p/google-api-go-client/mirror/v1
* go get -u code.google.com/p/google-api-go-client/oauth2/v2
* go get -u github.com/bwhite/picarus/go
* go get -u github.com/bwhite/picarus_takeout/go
* go get -u github.com/garyburd/redigo/redis
* go get -u github.com/gorilla/pat
* go get -u github.com/gorilla/sessions
* go get -u github.com/ugorji/go-msgpack
* go get -u github.com/ugorji/go/codec
* go build main.go

Resources
---------
These are helpful for development

* https://code.google.com/p/google-api-go-client/source/browse/mirror/v1/mirror-gen.go

Contact
-------
Brandyn White (bwhite dappervision com)
