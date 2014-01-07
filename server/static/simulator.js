jQuery.cachedScript = function( url, options ) {
        // Allow user to set any option except for dataType, cache, and url
        options = $.extend( options || {}, {
                dataType: "script",
                cache: true,
                url: url
        });

        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return jQuery.ajax( options );
};

function start(WSUrl) {
        log("starting");
        console.log(" ---INSTRUCTIONS--- ");
        console.log("call methods inside the simulator by calling on the `simulation` variable");
        glass = new SimulatedGlass(WSUrl);
        glass.connect();
}

function pack(data) {
        var data_enc = msgpack.pack(data);
        var data_out = new Uint8Array(data_enc.length);
        var i;
        for (i = 0; i < data_enc.length; i++) {
                data_out[i] = data_enc[i];
        }
        return data_out;
}

function unpack(blob) {
        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function() {
                arrayBuffer = this.result;
                uint8Array  = new Uint8Array(arrayBuffer);
                msg = msgpack.unpack(uint8Array);
                if(msg[0] == "shutdown") {
                        glass.disconnect();
                }else if(msg[0] == "startScript"){
                        log("startScript");
                        runScript(msg[1]);
                }else if(msg[0] == "startScriptUrl"){
                        log("startScriptUrl");
                        $.ajax({
                                url: msg[1],
                                dataType: 'html', // Notice! JSONP <-- P (lowercase)
                                success:function(json){
                                        runScript(json);
                                },
                                error:function(){
                                        alert("Bad things happened");
                                },
                        }); 
                }else{
                        log("Unhandled command: " + msg);
                }
        };
        fileReader.readAsArrayBuffer(blob);
}

function log(msg) {
        console.log("SIMULATOR: "+msg);
}

function runScript(script) {
        var newDoc = document.open("text/html", "replace");
        newDoc.write(msg[1]);
        newDoc.close();
}

function loadLibraries() {
        $.cachedScript("msgpack.js");
        $.cachedScript("reconnecting-websocket.min.js");
        $.cachedScript("mespeak.js").done(function(a,b) {
                if (!meSpeak.isConfigLoaded()){
                        meSpeak.loadConfig("mespeak_config.json");
                }
                if (!meSpeak.isVoiceLoaded('en-us')) {
                        meSpeak.loadVoice('en-us.json');
                }
        });
}

function say(msg) {
        meSpeak.speak(msg);
}

function SimulatedGlass(WSUrl) {
        this.wsurl = WSUrl;
        this.websocket = null;

        this.connect = function () {
                this.websocket = new ReconnectingWebSocket(this.wsurl);
                this.websocket.onopen = function(evt) { onOpen(evt) };
                this.websocket.onclose = function(evt) { onClose(evt) };
                this.websocket.onmessage = function(evt) { onMessage(evt) };
                this.websocket.onerror = function(evt) { onError(evt) };
        }

        this.disconnect = function () {
                this.websocket.close();
                this.websocket = null;
        }

        function onOpen(evt) {
                log("connected");
                setStatus("connected");
                say("WearScript connected");
        }

        function onClose(evt) {
                log("disconnected");
                say("WearScript disconnected");
                $.ajax({
                        url: "simulator.html",
                        success:function(data){
                                var newDoc = document.open("text/html", "replace");
                                newDoc.write(data);
                                newDoc.close();
                        },
                        dataType: "html"
                });
        }

        function onMessage(evt) {
                unpack(evt.data);
        }

        function onError(evt) {
                log("Websocket Error: "+evt.data);
        }

        this.send = send;
        function send(msg) {
                this.websocket.send(msg);
        }

        function setStatus(msg) {
                $('#status').text(msg);
        }
}

function SimulatedWS(type) {
        this.activityCreate = function () {
                log('WS.activityCreate is not implemented');
        };
        this.activityDestroy = function () {
                log('WS.activityDestroy is not implemented');
        }
        this.audioOff = function () {
                log('WS.audioOff is not implemented');
        };
        this.audioOn = function () {
                log('WS.audioOn is not implemented');
        };
        this.blobCallback = function () {
                log('WS.blobCallback is not implemented');
        };
        this.blobSend = function () {
                log('WS.blobSend is not implemented');
        };
        this.cameraCallback = function () {
                log('WS.cameraCallback is not implemented');
        }
        this.cameraOff = function () {
                log('WS.cameraOff is not implemented');
        };
        this.cameraOn = function () {
                log('WS.cameraOn is not implemented');
        };
        this.cameraPhoto = function () {
                log('WS.cameraPhoto is not implemented');
        };
        this.cameraVideo = function () {
                log('WS.cameraVideo is not implemented');
        };
        this.cardCallback = function () {
                log('WS.cardCallback is not implemented');
        };
        this.cardDelete = function () {
                log('WS.cardDelete is not implemented');
        };
        this.cardFactory = function () {
                log('WS.cardFactory is not implemented');
        };
        this.cardInsert = function () {
                log('WS.cardInsert is not implemented');
        };
        this.cardModify = function () {
                log('WS.cardModify is not implemented');
        };
        this.data = function () {
                log('WS.data is not implemented');
        };
        this.dataLog = function () {
                log('WS.dataLog is not implemented');
        };
        this.displayCardScroll = function () {
                log('WS.displayCardScroll is not implemented');
        };
        this.liveCardCreate = function () {
                log('WS.liveCardCreate is not implemented');
        };
        this.liveCardDestroy = function () {
                log('WS.liveCardDestroy is not implemented');
        };
        this.qr = function () {
                log('WS.qr is not implemented');
        };
        this.sensorOff = function () {
                log('WS.sensorOff is not implemented');
        };
        this.sensors = function () {
                log('WS.sensors is not implemented');
        };
        this.serverTimeline = function () {
                log('WS.serverTimeline is not implemented');
        };
        this.shutdown = function () {
                glass.disconnect();
        };
        this.sound = function() {
                log("WS.sound is not implemented");
        }
        this.speechRecognize = function (prompt, callback) {
                $('body').prepend('<link href="http://fonts.googleapis.com/css?family=Roboto:100,300" rel="stylesheet" type="text/css"><div id="voice_recognition_prompt" style="background:#000; width:560px; height:280px; position: absolute; left: 0; top: 0; padding:40px; z-index: 1; font:40px Roboto; color:#FFF; font-weight:100;">'+prompt+'</div>');
                parent.speechRecognition(callback);
                log('WS.speechRecognize called');
        };
        this.wake = function () {
                log('WS.wake is not implemented');
        };
        this.wifiOff = function () {
                log('WS.wifiOff is not implemented');
        };
        this.wifiOn = function () {
                log('WS.wifiOn is not implemented');
        };
        this.wifiScan = function () {
                log('WS.wifiScan is not implemented');
        };
        this.scriptVersion = function(version) { return version != 0; };
        this.log = function (x) {
                console.log("SIMULATOR LOG: " +x);
                glass.send(pack(['log', x]));
        };
        this.displayWebView = function () {};
        this.serverConnect = function (server, cb) {window[cb]()};
        this.sensorCallback = function (cb) {this._scb = cb};
        this._sensors = [];
        this.sensor = function (x) {
                var sensorValues = {pupil: -2,gps: -1,accelerometer: 1,magneticField: 2,orientation: 3,gyroscope: 4,light: 5,gravity: 9,linearAcceleration: 10,rotationVector: 11};
                return sensorValues[x];
        };
        this._sensorDelay = 100;
        this.sensorOn = function (s, delay, cb) {
                this._sensors[s] = [delay, cb]
                        return true;
        };
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
                say(data);
        };
}

var WS;
$(function() {
        loadLibraries();
        WS = new SimulatedWS();
});
