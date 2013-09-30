function Pupil(rows, columns, delay, height, width, canvas) {
    this.rows = rows;
    this.columns = columns;
    this.delay = delay;
    this.canvas = canvas;
    this.height = height;
    this.width = width;
    this.xStep = this.width / (rows - 1);
    this.yStep = this.height / (columns - 1);
    this.calibrated = false;
    this.safe = false;
    this.centers = [];
    this.calibrate = function () {
        this.calibrated = false;
        this.safe = false;
        this.centers = [];
        this.calibrateStep();
    }

    this.circle = function (num) {
        var ctx = this.canvas.getContext("2d");
        var column =  num % this.columns;
        var row = Math.floor(num / this.columns);
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.beginPath();
        ctx.arc(column * this.xStep, row * this.yStep, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle="#FF0000";
        ctx.fill();
    }

    this.calibrateStep = function () {
        // Draw a dot then wait, after the delay allow a sample to be taken
        this.safe = false;
        if (this.centers.length < this.rows * this.columns) {
            this.circle(this.centers.length);
            _.delay(_.bind(function () {this.safe = true}, this), this.delay);
        } else {
            this.calibrated = true;
            GG.log(JSON.stringify(this.centers));
        }
    }

    this.sensorCallback = function (data) {
        if (data.type != -2)
            return;
        if (this.calibrated) {
            var minInd = 0;
            var minDist = 100000;
            _.each(this.centers, function (x, y) {
                var d = (data.values[0] - x[0]) * (data.values[0] - x[0]) + (data.values[1] - x[1]) * (data.values[1] - x[1]);
                if (d < minDist) {
                    minDist = d;
                    minInd = y;
                }
            });
            this.circle(minInd);
        }
        if (this.safe) {
            this.centers.push(data.values);
            this.calibrateStep();
        }
    }
}

function GlassGapSimulator() {
    this.log = function (x) {console.log(x)};
    this.displayWebView = function () {};
    this.serverConnect = function (server, cb) {window[cb]()};
    this.sensorCallback = function (cb) {this._scb = cb};
    this._sensors = [];
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
}
