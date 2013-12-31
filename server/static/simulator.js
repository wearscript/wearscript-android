function start(WSUrl) {
  console.log("starting simulator for "+WSUrl);
  glass = new SimulatedGlass(WSUrl);
  glass.connect(function() {
  });
}

function SimulatedGlass(WSUrl) {
  this.wsurl = WSUrl;
  this.websocket = null;

  this.connect = function (postConnect) {
    this.websocket = new ReconnectingWebSocket(this.wsurl);
    this.websocket.onopen = function(evt) { onOpen(evt); postConnect(); };
    this.websocket.onclose = function(evt) { onClose(evt) };
    this.websocket.onmessage = function(evt) { onMessage(evt) };
  }

  function onOpen(evt, post) {
    console.log("simulator ws connected");
    setStatus("connected");
    say("WearScript connected");
  }

  function onClose(evt) {
    console.log("simulator ws disconnected");
    say("WearScript disconnected");
    setStatus("disconnected");
  }

  function onMessage(evt) {
    obj = msgpack.unpack(evt.data);
    console.log("event msgpack: "+JSON.stringify(obj));
    console.log("event raw: "+JSON.stringify(evt.data));
  }

  this.send = send;
  function send(msg) {
          this.websocket.send(msg);
  }

  this.say = say;
  function say(data) {
    var audio = new Audio("http://translate.google.com/translate_tts?tl=en&q="+encodeURIComponent(data));
    audio.play();
  };

  function setStatus(msg) {
    $('#status').text(msg);
  }
}

function WearScriptSimulator(type) {
    this.activityCreate = function () {
      console.log('Simulator warning: WS.activityCreate is not implemented');
    };
    this.activityDestroy = function () {
      console.log('Simulator warning: WS.activityDestroy is not implemented');
    };
    this.audioOff = function () {
      console.log('Simulator warning: WS.audioOff is not implemented');
    };
    this.audioOn = function () {
      console.log('Simulator warning: WS.audioOn is not implemented');
    };
    this.blobCallback = function () {
      console.log('Simulator warning: WS.blobCallback is not implemented');
    };
    this.blobSend = function () {
      console.log('Simulator warning: WS.blobSend is not implemented');
    };
    this.cameraCallback = function () {
      console.log('Simulator warning: WS.cameraCallback is not implemented');
    };
    this.cameraOff = function () {
      console.log('Simulator warning: WS.cameraOff is not implemented');
    };
    this.cameraOn = function () {
      console.log('Simulator warning: WS.cameraOn is not implemented');
    };
    this.cameraPhoto = function () {
      console.log('Simulator warning: WS.cameraPhoto is not implemented');
    };
    this.cameraVideo = function () {
      console.log('Simulator warning: WS.cameraVideo is not implemented');
    };
    this.cardCallback = function () {
      console.log('Simulator warning: WS.cardCallback is not implemented');
    };
    this.cardDelete = function () {
      console.log('Simulator warning: WS.cardDelete is not implemented');
    };
    this.cardFactory = function () {
      console.log('Simulator warning: WS.cardFactory is not implemented');
    };
    this.cardInsert = function () {
      console.log('Simulator warning: WS.cardInsert is not implemented');
    };
    this.cardModify = function () {
      console.log('Simulator warning: WS.cardModify is not implemented');
    };
    this.data = function () {
      console.log('Simulator warning: WS.data is not implemented');
    };
    this.dataLog = function () {
      console.log('Simulator warning: WS.dataLog is not implemented');
    };
    this.displayCardScroll = function () {
      console.log('Simulator warning: WS.displayCardScroll is not implemented');
    };
    this.liveCardCreate = function () {
      console.log('Simulator warning: WS.liveCardCreate is not implemented');
    };
    this.liveCardDestroy = function () {
      console.log('Simulator warning: WS.liveCardDestroy is not implemented');
    };
    this.qr = function () {
      console.log('Simulator warning: WS.qr is not implemented');
    };
    this.sensorOff = function () {
      console.log('Simulator warning: WS.sensorOff is not implemented');
    };
    this.sensors = function () {
      console.log('Simulator warning: WS.sensors is not implemented');
    };
    this.serverTimeline = function () {
      console.log('Simulator warning: WS.serverTimeline is not implemented');
    };
    this.shutdown = function () {
      console.log('Simulator warning: WS.shutdown is not implemented');
    };
    this.speechRecognize = function () {
      console.log('Simulator warning: WS.speechRecognize is not implemented');
    };
    this.wake = function () {
      console.log('Simulator warning: WS.wake is not implemented');
    };
    this.wifiOff = function () {
      console.log('Simulator warning: WS.wifiOff is not implemented');
    };
    this.wifiOn = function () {
      console.log('Simulator warning: WS.wifiOn is not implemented');
    };
    this.wifiScan = function () {
      console.log('Simulator warning: WS.wifiScan is not implemented');
    };
    this.scriptVersion = function(version) { return version != 0; };
    this.log = function (x) {console.log(x)};
    this.displayWebView = function () {};
    this.serverConnect = function (server, cb) {window[cb]()};
    this.sensorCallback = function (cb) {this._scb = cb};
    this._sensors = [];
    this.sensor = function (x) {
      var sensorValues = {pupil: -2,gps: -1,accelerometer: 1,magneticField: 2,orientation: 3,gyroscope: 4,light: 5,gravity: 9,linearAcceleration: 10,rotationVector: 11};
      return sensorValues[x];
    };
    this._sensorDelay = 100;
    this.sensorOn = function (s) {this._sensors.push(s)};
    this._sensorLoop = _.bind(function () {
        if (!_.has(this, '_scb') || !_.has(window, this._scb))
            return;
        _.each(this._sensors, _.bind(function (x) {
            window[this._scb]({type: x, values: [Math.random(), Math.random(), Math.random()], timestamp: (new Date).getTime() / 1000});
        }, this));
        _.delay(this._sensorLoop, this._sensorDelay);
    }, this);
    _.delay(this._sensorLoop, this._sensorDelay);
  this.gestureCallbacks = {};
  this.gestureCallback = function (event, callback) {
    this.gestureCallbacks[event] = callback;
  };
  this.getGestureCallbacks = function () {
    return this.gestureCallbacks;
  };
  this.say = function(data) {
    var audio = new Audio("http://translate.google.com/translate_tts?tl=en&q="+encodeURIComponent(data));
    audio.play();
  };
}
var WS = new WearScriptSimulator();
