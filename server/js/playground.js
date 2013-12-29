function buildChart(chart, seriesData) {
    // data: Lists of sensor data (each list is a list of values)
    var colors = ['red', 'green', 'blue'];
    var graph = new Rickshaw.Graph({
        element: chart[0],
        renderer: 'line',
        width: $(window).width() - 69,
        height: 200,
        series: seriesData
    });
    graph.render();
    var hoverDetail = new Rickshaw.Graph.HoverDetail({graph: graph});
    return graph;
}
function sensorLatest(sensors, type) {
    return _.last(_.filter(sensors, function (x) {
        return x.type == type;
    }));
}

function biosScriptUrl(x) {
    return document.URL + 'playground/' + x;
}

function createQR(WSUrl) {
    createKey("ws", function (x) {glassSecret = x; $('#qr').html(Mustache.render('<div class="col-md-9"><pre>adb shell \"mkdir -p /sdcard/wearscript && echo \'{{url}}\' > /sdcard/wearscript/qr.txt\"</pre></div><img src="https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl={{url}}&chld=H|4&choe=UTF-8"\>', {url: WSUrl + '/ws/glass/' + x}))}, function () {alert("Could not get ws.  Are you whitelisted on this server?  See the docs for details.")});
}

function pingStatus() {
    var allTimedOut = _.every(_.map($('.pingLabel'), function (x) {
        if ((new Date).getTime() - Number($(x).attr('updateTime')) > 4000) {
            $(x).removeClass('label-success').addClass('label-danger');
            return true;
        }
        return false;
    }));
    _.delay(pingStatus, 500);
}

function enc(data) {
    var data_enc = msgpack.pack(data);
    var data_out = new Uint8Array(data_enc.length);
    var i;
    for (i = 0; i < data_enc.length; i++) {
        data_out[i] = data_enc[i];
    }
    return data_out;
}

function connectWebsocket(WSUrl) {
    var url = WSUrl + "/ws/client";
    console.log(url);
    var ws = new ReconnectingWebSocket(url);
    ws.onopen = function () {
        pingStatus();
        function receiveMessage(event) {
            // TODO(brandyn): Check source! (security hazard)
            console.log(event.data);
            var eventData = msgpack.unpack(event.data);
            if (eventData[0] === 'widgetHeight') {
                $('#iframe').attr('height', Number(eventData[1]) + 'px')
            } else {
                ws.send(event.data);
            }
        }
        window.addEventListener("message", receiveMessage, false);
    }
    ws.onclose = function () {
    }
    ws.onmessage = function (event) {
        //var response = JSON.parse(event.data);
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            debug_data = reader.result;
            if (_.has(window, 'iframeWindow')) {
                iframeWindow.postMessage(reader.result, iframeHost);
            }
            var response = msgpack.unpack(reader.result);
            debug_response = response;
            var action = response[0];
            if (action == "version") {
                var version = 0;
                if (response[1] != version) {
                    alert('Incompatible server version: ' + response[1] + ' Expected: ' + version + '.  Bad things may happen...');
                }
            } else if (action == "log") {
                console.log(response[1]);
            } else if (action == 'connections') {
                if (response[1] == 0)
                    $(".scriptel").prop('disabled', true);
                else
                    $(".scriptel").prop('disabled', false);
            } else if (action == 'signScript') {
                var data = JSON.stringify({"public": false, "files": {"wearscript.html": {"content": response[1]}}});
                $.post('https://api.github.com/gists', data, function (result) {console.log(result);$('#script-url').val(result.files['wearscript.html'].raw_url)});
            } else if (action == 'blob') {
                if (_.has(blobHandlers, response[1]))
                    blobHandlers[response[1]](response[2]);
            } else if (action == "sensors" || action == "image" || action == "pongStatus") {
                var glassID = response[1];
                if (!_.has(glassIdToNum, glassID)) {
                    var glassNum = _.uniqueId('glass-');
                    var cubet = '<div class="ccontainer"><div class="cube"><figure class="front">1</figure><figure class="back">2</figure><figure class="right">3</figure><figure class="left">4</figure><figure class="top">5</figure><figure class="bottom">6</figure></div>'

                    $('#glasses').append(Mustache.render('<div id="{{glassID}}"><img class="image" \><div class="times"></div><div class="charts"></div><span class="pingLabel label label-success" updateTime="{{time}}">Status</span><div class="panel panel-default"><div class="panel-heading">Sensor Values</div><table class="table"><thead><tr><th>#</th><th>Name</th><th>Time</th><th>Values</th><th>Actions</th></tr></thead><tbody class="sensor-data"></tbody></table></div>{{{cube}}}</div>', {glassID: glassNum, cube: cubet, time: (new Date).getTime()}));
                    glassIdToNum[glassID] = glassNum;
	                graphs[glassID] = {};
                }
                var $glass = $('#' + glassIdToNum[glassID]);
                $glass.find('.pingLabel').removeClass('label-danger').addClass('label-success').attr('updateTime', (new Date).getTime());

                if (action == "image") {
                    $glass.find('.image').attr('src', 'data:image/jpeg;base64,' + btoa(response[3]));
                }
                if (action == "sensors") {
                    response_sensor = response;
                    _.each(response[3], function (sensorSamples, sensorName) {
                        var sensorType = response[2][sensorName];
                        var sensorLast = _.last(sensorSamples);
                        if (sensorType == 11) {
                            rotate_cuber($glass.find('.cube'), remap_coordinate_system(getRotationMatrixFromVector(sensorLast[0]), 1, 3));
                        }
                        _.each(sensorSamples, function (x) {
                            addGraphValues(glassID, $glass.find('.chart-' + sensorType), sensorType, x[0], x[1]);
                        });
                        if (!$glass.find('.sensor-' + sensorType).length) {
	                        var $sensorData = $glass.find('.sensor-data');
                            $sensorData.append($('<tr>').attr('class', 'sensor-' + sensorType));
                            $sensorData.html($sensorData.children().sort(function (x, y) {return Number(x.className.split('-')[1]) -Number(y.className.split('-')[1])}));
                        }
                        var $sensor = $glass.find('.sensor-' + sensorType);
                        $sensor.html(Mustache.render('<td>{{type}}</td><td>{{name}}</td><td>{{timestamp}}</td><td>{{valuesStr}}</td><td><button type="button" class="btn btn-primary btn-xs sensor-graph-button" glass="{{glassID}}" name="{{type}}">Graph</button></td>', {valuesStr: sensorLast[0].join(', '), name: sensorName, type: sensorType, glassID: glassID, timestamp: sensorLast[1]}));
                        $sensor.find('.sensor-graph-button').click(sensor_graph_click);
                    });
                }
            }
        })
        reader.readAsBinaryString(event.data);
    }
    return ws;
}
function addGraphValues(glassID, chart, type, ys, timestamp) {
    if (!chart.length)
        return;
    var domains = {'-2': [-1, 1], 1: [-10, 10], 2: [-60, 60], 3: [-180, 360], 4: [-3, 3], 5: [0, 2000], 9: [-10, 10], 10: [-12, 12], 11: [-1, 1]};
    var colors = ['red', 'green', 'blue'];
    var domain = domains[type];
    if (!_.has(graphs[glassID], type) || seriesDatas[type]['0'].data.length > 1000) {
        // Sensor graph
        chart.html('');
        if (_.isUndefined(domain))
            seriesDatas[type] = _.map(ys, function (y, z) {return {data: [{x: timestamp, y: y}], color: colors[z], name: String(z)}});
        else
            seriesDatas[type] = _.map(ys, function (y, z) {return {data: [{x: timestamp, y: y}], color: colors[z], name: String(z), scale: d3.scale.linear().domain(domains[type]).nice()}});
        graphs[glassID][type] = buildChart(chart, seriesDatas[type]);
    } else {
        _.each(ys, function (y, z) {
            seriesDatas[type][z].data.push({x: timestamp, y: y});
        });
        graphs[glassID][type].update();
    }
}

function getRotationMatrixFromVector(rotationVector) {
    var q0;
    var q1 = rotationVector[0];
    var q2 = rotationVector[1];
    var q3 = rotationVector[2];

    R = new Array(16);

    if (rotationVector.length == 4) {
        q0 = rotationVector[3];
    } else {
        q0 = 1 - q1*q1 - q2*q2 - q3*q3;
        q0 = (q0 > 0) ? Math.sqrt(q0) : 0;
    }

    var sq_q1 = 2 * q1 * q1;
    var sq_q2 = 2 * q2 * q2;
    var sq_q3 = 2 * q3 * q3;
    var q1_q2 = 2 * q1 * q2;
    var q3_q0 = 2 * q3 * q0;
    var q1_q3 = 2 * q1 * q3;
    var q2_q0 = 2 * q2 * q0;
    var q2_q3 = 2 * q2 * q3;
    var q1_q0 = 2 * q1 * q0;

    R[0] = 1 - sq_q2 - sq_q3;
    R[1] = q1_q2 - q3_q0;
    R[2] = q1_q3 + q2_q0;
    R[3] = 0.0;
    
    R[4] = q1_q2 + q3_q0;
    R[5] = 1 - sq_q1 - sq_q3;
    R[6] = q2_q3 - q1_q0;
    R[7] = 0.0;
    
    R[8] = q1_q3 - q2_q0;
    R[9] = q2_q3 + q1_q0;
    R[10] = 1 - sq_q1 - sq_q2;
    R[11] = 0.0;
    
    R[12] = R[13] = R[14] = 0.0;
    R[15] = 1.0;

    return R;
}
function remap_coordinate_system(inR, X, Y) {
    // AXIS_X=1, AXIS_Y=2, AXIS_Z=3
    /*
     * X and Y define a rotation matrix 'r':
     *
     *  (X==1)?((X&0x80)?-1:1):0    (X==2)?((X&0x80)?-1:1):0    (X==3)?((X&0x80)?-1:1):0
     *  (Y==1)?((Y&0x80)?-1:1):0    (Y==2)?((Y&0x80)?-1:1):0    (Y==3)?((X&0x80)?-1:1):0
     *                              r[0] ^ r[1]
     *
     * where the 3rd line is the vector product of the first 2 lines
     *
     */
    outR = _.range(16);

    var length = outR.length;
    if (inR.length != length)
        return;   // invalid parameter
    if ((X & 0x7C)!=0 || (Y & 0x7C)!=0)
        return;   // invalid parameter
    if (((X & 0x3)==0) || ((Y & 0x3)==0))
        return;   // no axis specified
    if ((X & 0x3) == (Y & 0x3))
        return;   // same axis specified

    // Z is "the other" axis, its sign is either +/- sign(X)*sign(Y)
    // this can be calculated by exclusive-or'ing X and Y; except for
    // the sign inversion (+/-) which is calculated below.
    var Z = X ^ Y;

    // extract the axis (remove the sign), offset in the range 0 to 2.
    var x = (X & 0x3)-1;
    var y = (Y & 0x3)-1;
    var z = (Z & 0x3)-1;

    // compute the sign of Z (whether it needs to be inverted)
    var axis_y = (z+1)%3;
    var axis_z = (z+2)%3;
    if (((x^axis_y)|(y^axis_z)) != 0)
        Z ^= 0x80;

    var sx = (X>=0x80);
    var sy = (Y>=0x80);
    var sz = (Z>=0x80);

    // Perform R * r, in avoiding actual muls and adds.
    var rowLength = ((length==16)?4:3);
    _.each(_.range(3), function(j){
        var offset = j*rowLength;
        _.each(_.range(3), function(i){
            if (x==i)   outR[offset+i] = sx ? -inR[offset+0] : inR[offset+0];
            if (y==i)   outR[offset+i] = sy ? -inR[offset+1] : inR[offset+1];
            if (z==i)   outR[offset+i] = sz ? -inR[offset+2] : inR[offset+2];
        })
            })

        if (length == 16) {
            outR[3] = outR[7] = outR[11] = outR[12] = outR[13] = outR[14] = 0;
            outR[15] = 1;
        }
    return outR;
}

function transpose_matrix(mat) {
    mat_trans = [];
    _.each(_.range(4), function (i) {
        _.each(_.range(4), function (j) {
            mat_trans.push(mat[j * 4 + i]);
        });
    });
    return mat_trans;
}

function rotate_cuber($cube, mat) {
    var mat_trans = transpose_matrix(mat);
    mat_trans = remap_coordinate_system(mat_trans, 3, 1);
    $cube.css({
        transform: 'matrix3d(' + mat_trans.join(',') + ')',
        "transition-duration": '0s'
    });
}
function sensor_graph_click() {
    var $this = $(this);
    var $glass = $('#' + glassIdToNum[$this.attr('glass')]);
    var type = $this.attr('name');
    if (!$glass.find('.chart-' + type).length) {
        $glass.find('.charts').append($('<div>').attr('class', 'chart-' + type).attr('name', type).attr('title', 'Sensor #' + type));
        $glass.find('.charts').html($glass.find('.charts').children().sort(function (x, y) {return Number($(x).attr('name')) - Number($(y).attr('name'))}));
    }
}
function sendTimelineImage(image) {
    var out = ['sendTimelineImage', image];
    ws.send(enc(out));
}

function createKey(type, success, error) {
    var xhr = $.ajax({url: 'user/key/' + type, type: 'POST', success: success});
    if (!_.isUndefined(error)) {
        xhr.error(error);
    }
}

function urlToHost(url) {
    var pathArray = url.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    return protocol + '//' + host;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function main(WSUrl) {
    glassIdToNum = {};
    graphs = {};
    seriesDatas = {};
    scriptRowDisabled = true;
    blobHandlers = {};
    if ($('#iframe').attr('src').length) {
        iframeWindow = $('#iframe')[0].contentWindow;
        iframeHost = urlToHost($('#iframe').attr('src'));
        $('#iframeRow').css('display', '');
    }

    $(".scriptel").prop('disabled', true);
    $('#qrButton').click(function () {createQR(WSUrl)});
    $('#scriptButton').click(function () {
        ws.send(enc(['startScript', editor.getValue()]));
    });
    $('#scriptSaveButton').click(function () {
        ws.send(enc(['saveScript', editor.getValue(), $('#script-name').val()]));
    });
    $('#scriptUrlButton').click(function () {
        ws.send(enc(['startScriptUrl', $('#script-url').val()]));
    });
    $('#resetButton').click(function () {
        ws.send(enc(['startScript', "<script>function s() {WS.log('Connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script>"]));
    });
    $('#gistButton').click(function () {
        ws.send(enc(['signScript', editor.getValue()]));
    });
    $('#shutdownButton').click(function () {
        ws.send(enc(['shutdown']));
    });
    $('#buttonAuth').click(function () {
        window.location.replace('auth');
    });
    $('#buttonSignout').click(function () {
        $.post('signout', {success: function () {location.reload()}});
    });

    $('#buttonSetup').click(function () {
        $.post('setup').error(function () {alert("Could not setup")});
    });

    $('#buttonClient').click(function () {
        createKey("client", function (x) {$('#secret-client').html(_.escape(WSUrl + "/ws/client/" + x))}, function () {alert("Could not get client endpoint")})
    });
    
    $('#simulateButton').click(function () {
        $('#simulator').show();
        console.log('simulate button is clicked');
        console.log(editor.getValue());
        //$('#simulation').contents().find('html').html(editor.getValue());
        // I set src so that the styling of body is obeyed 
        var WSScript = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js\"></script><script>" +
        "function WearScriptSimulator(type) {" +
        "    this.activityCreate = function () {" +
        "      console.log('Simulator warning: WS.activityCreate is not implemented');" +
        "    };" +
        "    this.activityDestroy = function () {" +
        "      console.log('Simulator warning: WS.activityDestroy is not implemented');" +
        "    };" +
        "    this.audioOff = function () {" +
        "      console.log('Simulator warning: WS.audioOff is not implemented');" +
        "    };" +
        "    this.audioOn = function () {" +
        "      console.log('Simulator warning: WS.audioOn is not implemented');" +
        "    };" +
        "    this.blobCallback = function () {" +
        "      console.log('Simulator warning: WS.blobCallback is not implemented');" +
        "    };" +
        "    this.blobSend = function () {" +
        "      console.log('Simulator warning: WS.blobSend is not implemented');" +
        "    };" +
        "    this.cameraCallback = function () {" +
        "      console.log('Simulator warning: WS.cameraCallback is not implemented');" +
        "    };" +
        "    this.cameraOff = function () {" +
        "      console.log('Simulator warning: WS.cameraOff is not implemented');" +
        "    };" +
        "    this.cameraOn = function () {" +
        "      console.log('Simulator warning: WS.cameraOn is not implemented');" +
        "    };" +
        "    this.cameraPhoto = function () {" +
        "      console.log('Simulator warning: WS.cameraPhoto is not implemented');" +
        "    };" +
        "    this.cameraVideo = function () {" +
        "      console.log('Simulator warning: WS.cameraVideo is not implemented');" +
        "    };" +
        "    this.cardCallback = function () {" +
        "      console.log('Simulator warning: WS.cardCallback is not implemented');" +
        "    };" +
        "    this.cardDelete = function () {" +
        "      console.log('Simulator warning: WS.cardDelete is not implemented');" +
        "    };" +
        "    this.cardFactory = function () {" +
        "      console.log('Simulator warning: WS.cardFactory is not implemented');" +
        "    };" +
        "    this.cardInsert = function () {" +
        "      console.log('Simulator warning: WS.cardInsert is not implemented');" +
        "    };" +
        "    this.cardModify = function () {" +
        "      console.log('Simulator warning: WS.cardModify is not implemented');" +
        "    };" +
        "    this.data = function () {" +
        "      console.log('Simulator warning: WS.data is not implemented');" +
        "    };" +
        "    this.dataLog = function () {" +
        "      console.log('Simulator warning: WS.dataLog is not implemented');" +
        "    };" +
        "    this.displayCardScroll = function () {" +
        "      console.log('Simulator warning: WS.displayCardScroll is not implemented');" +
        "    };" +
        "    this.liveCardCreate = function () {" +
        "      console.log('Simulator warning: WS.liveCardCreate is not implemented');" +
        "    };" +
        "    this.liveCardDestroy = function () {" +
        "      console.log('Simulator warning: WS.liveCardDestroy is not implemented');" +
        "    };" +
        "    this.qr = function () {" +
        "      console.log('Simulator warning: WS.qr is not implemented');" +
        "    };" +
        "    this.sensorOff = function () {" +
        "      console.log('Simulator warning: WS.sensorOff is not implemented');" +
        "    };" +
        "    this.sensors = function () {" +
        "      console.log('Simulator warning: WS.sensors is not implemented');" +
        "    };" +
        "    this.serverTimeline = function () {" +
        "      console.log('Simulator warning: WS.serverTimeline is not implemented');" +
        "    };" +
        "    this.shutdown = function () {" +
        "      console.log('Simulator warning: WS.shutdown is not implemented');" +
        "    };" +
        "    this.speechRecognize = function () {" +
        "      console.log('Simulator warning: WS.speechRecognize is not implemented');" +
        "    };" +
        "    this.wake = function () {" +
        "      console.log('Simulator warning: WS.wake is not implemented');" +
        "    };" +
        "    this.wifiOff = function () {" +
        "      console.log('Simulator warning: WS.wifiOff is not implemented');" +
        "    };" +
        "    this.wifiOn = function () {" +
        "      console.log('Simulator warning: WS.wifiOn is not implemented');" +
        "    };" +
        "    this.wifiScan = function () {" +
        "      console.log('Simulator warning: WS.wifiScan is not implemented');" +
        "    };" +
        "    this.scriptVersion = function(version) { return version != 0; };" +
        "    this.log = function (x) {console.log(x)};" +
        "    this.displayWebView = function () {};" +
        "    this.serverConnect = function (server, cb) {window[cb]()};" +
        "    this.sensorCallback = function (cb) {this._scb = cb};" +
        "    this._sensors = [];" +
        "    this.sensor = function (x) {" +
        "      var sensorValues = {pupil: -2,gps: -1,accelerometer: 1,magneticField: 2,orientation: 3,gyroscope: 4,light: 5,gravity: 9,linearAcceleration: 10,rotationVector: 11};" +
        "      return sensorValues[x];" +
        "    };" +
        "    this._sensorDelay = 100;" +
        "    this.sensorOn = function (s) {this._sensors.push(s)};" +
        "    this._sensorLoop = _.bind(function () {" +
        "        if (!_.has(this, '_scb') || !_.has(window, this._scb))" +
        "            return;" +
        "        _.each(this._sensors, _.bind(function (x) {" +
        "            window[this._scb]({type: x, values: [Math.random(), Math.random(), Math.random()], timestamp: (new Date).getTime() / 1000});" +
        "        }, this));" +
        "        _.delay(this._sensorLoop, this._sensorDelay);" +
        "    }, this);" +
        "    _.delay(this._sensorLoop, this._sensorDelay);" +
        "  this.gestureCallbacks = {};" +
        "  this.gestureCallback = function (event, callback) {" +
        "    this.gestureCallbacks[event] = callback;" +
        "  };" +
        "  this.getGestureCallbacks = function () {" +
        "    return this.gestureCallbacks;" +
        "  };" +
        "  this.say = function(data) {" +
        "    var audio = new Audio(\"http://translate.google.com/translate_tts?tl=en&q=\"+encodeURIComponent(data));" +
        "    audio.play();" +
        "  };" +
        "}" +
        "var WS = new WearScriptSimulator();" +
        "</script>";
        document.getElementById('simulation').src = "data:text/html;charset=utf-8," + escape(replaceAll('raw.github', 'rawgithub', WSScript+editor.getValue()));
    });
    $('#gestureAgain').click(function() { 
      onGestureCallback = $("#simulation")[0].contentWindow.WS.getGestureCallbacks()['onGesture'];
      $("#simulation")[0].contentWindow[onGestureCallback]($('#gestures option:selected').text());
    });
    $('.gesture').click( function (e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = $(this).text();
      onGestureCallback = $("#simulation")[0].contentWindow.WS.getGestureCallbacks()['onGesture'];
      console.log('onGestureCallback '+JSON.stringify(onGestureCallback));
      $("#simulation")[0].contentWindow[onGestureCallback](valueSelected);
      console.log('gesture: '+valueSelected);
    });
    //$("#simulation")[0].contentWindow.myFunction();
    editor = CodeMirror.fromTextArea(document.getElementById("script"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        theme: 'default',
        mode: "htmlmixed",
        indentUnit: 4
    });
    //ws = connectWebsocket(WSUrl);
}
