function WearScript() {
    this._randstr = function (sz) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for(var i=0; i < sz; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    this._cbPrefix = 'WS' + this._randstr(4);
    this.callbacks = {};
    this.cbCount = 0;
    this.Cards = function (cards) {
         this.cards = cards || [];
         this.add = function (text, info) {
             var isFunc = function (x) {return typeof x === 'function'};
             var isObj = function (x) {return typeof x === 'object'};
             var isUndef = function (x) {return typeof x === 'undefined'};
             var isStr = function (x) {return typeof x === 'string'};
             var click, select, children, menu;
             var card = {card: {type: "card", text: text, info: info}};

             var extras = Array.prototype.slice.call(arguments).slice(2);
             if (extras.length > 0 && isFunc(extras[0]) || isUndef(extras[0])) { // Selected
                 if (isFunc(extras[0]))
                     card.selected = WS._funcwrap(extras[0]);
                 extras = extras.slice(1);
             }
             if (extras.length > 0 && isFunc(extras[0]) || isUndef(extras[0])) { // Click
                 if (isFunc(extras[0]))
                     card.click = WS._funcwrap(extras[0]);
                 extras = extras.slice(1);
             }
             if (extras.length > 0 && isObj(extras[0])) { // Children
                 card.children = extras[0];
                 extras = extras.slice(1);
             } else if (extras.length > 0 && extras.length % 2 == 0) { // Menu
                 card.menu = [];
                 for (var i = 0; i < extras.length; i += 2) {
                     if (!isStr(extras[i]) || (!isFunc(extras[i + 1]) && !isUndef(extras[i + 1])))
                         break;
                     card.menu.push({'label':  extras[i], 'callback': WS._funcwrap(extras[i + 1])});
                 }
             }
             this.cards.push(card);
             return this;
         }
    }
    this.scriptVersion = function (num) {
        WSRAW.scriptVersion(num);
    }
    this.shutdown = function () {
        WSRAW.shutdown();
    }
    this.sensor = function (x) {
        return WSRAW.sensor(x);
    }
    this.sensors = function () {
        return JSON.parse(WSRAW.sensors());
    }
    this._funcwrap = function (func) {
        var getType = {};
        var isFunction = func && getType.toString.call(func) === '[object Function]';
        if (isFunction) {
            var funcName = this._cbPrefix + this.cbCount;
            this.cbCount += 1;
            window[funcName] = func;
            return funcName;
        }
        return func;
    }
    this.sensorOn = function(type, period, callback) {
        WSRAW.sensorOn(type, period, this._funcwrap(callback));
    }
    this.sensorOff = function(type) {
        WSRAW.sensorOff(type);
    }
    this.dataLog = function (remote, local, period) {
        WSRAW.dataLog(remote, local, period);
    }
    this.say = function (msg) {
        WSRAW.say(msg);
    }
    this.qr = function (callback) {
        WSRAW.qr(this._funcwrap(callback));
    }
    this.log = function (msg) {
        WSRAW.log(msg);
    }
    this.displayWebView = function () {
        WSRAW.displayWebView();
    }
    this.displayCardTree = function () {
        WSRAW.displayCardTree();
    }
    this.cardTree = function (tree) {
        WSRAW.cardTree(JSON.stringify(tree.cards))
    }
    this.cameraOn = function (period) {
        WSRAW.cameraOn(period);
    }
    this.cameraPhoto = function () {
        WSRAW.cameraPhoto();
    }
    this.cameraVideo = function () {
        WSRAW.cameraVideo();
    }
    this.cameraOff = function () {
        WSRAW.cameraOff();
    }
    this.activityCreate = function () {
        WSRAW.activityCreate();
    }
    this.activityDestroy = function () {
        WSRAW.activityDestroy();
    }
    this.wifiOn = function (callback) {
        // TODO: Handle no callback case
        WSRAW.wifiOn(this._funcwrap(callback));
    }
    this.wifiOff = function () {
        WSRAW.wifiOff();
    }
    this.wifiScan = function () {
        WSRAW.wifiScan();
    }
    this.serverConnect = function (server, callback) {
        WSRAW.serverConnect(server, this._funcwrap(callback));
    }
    this.wake = function () {
        WSRAW.wake();
    }
    this.sound = function (sound) {
        WSRAW.sound(sound);
    }
    this.gestureCallback = function (event, callback) {
        WSRAW.gestureCallback(event, this._funcwrap(callback));
    }
    this.speechRecognize = function (prompt, callback) {
        WSRAW.speechRecognize(prompt, this._funcwrap(callback));
    }
    this.liveCardCreate = function (nonSilent, period) {
        WSRAW.liveCardCreate(nonSilent, period);
    }
    this.liveCardDestroy = function () {
        WSRAW.liveCardDestroy();
    }
}
WS = new WearScript();