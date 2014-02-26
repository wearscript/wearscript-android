function Cards(cards) {
    this.cards = cards || [];
    this.add = function (text, info, children) {
        if (children)
            children = children.cards;
        else
            children = [];
        var card = {card: {type: "card", text: text, info: info}, children: children};
        this.cards.push(card);
        return this;
    }
}
function WearScript() {
    this.callbacks = {};
    this.cbCount = 0;
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
            var funcName = 'WSCB' + this.cbCount;
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