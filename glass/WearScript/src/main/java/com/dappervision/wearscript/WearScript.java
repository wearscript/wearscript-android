package com.dappervision.wearscript;

import com.dappervision.wearscript.activities.MainActivity;
import com.dappervision.wearscript.dataproviders.DataPoint;
import com.dappervision.wearscript.events.LogEvent;
import com.dappervision.wearscript.events.ServerConnectEvent;
import com.dappervision.wearscript.events.ShutdownEvent;
import com.dappervision.wearscript.jsevents.ActivityEvent;
import com.dappervision.wearscript.jsevents.CallbackRegistration;
import com.dappervision.wearscript.jsevents.CameraEvents;
import com.dappervision.wearscript.jsevents.DataLogEvent;
import com.dappervision.wearscript.jsevents.LiveCardEvent;
import com.dappervision.wearscript.jsevents.PicarusEvent;
import com.dappervision.wearscript.jsevents.SayEvent;
import com.dappervision.wearscript.jsevents.ScreenEvent;
import com.dappervision.wearscript.jsevents.SensorJSEvent;
import com.dappervision.wearscript.jsevents.ServerTimelineEvent;
import com.dappervision.wearscript.jsevents.SpeechRecognizeEvent;
import com.dappervision.wearscript.jsevents.WifiEvent;
import com.dappervision.wearscript.jsevents.WifiScanEvent;
import com.dappervision.wearscript.managers.BarcodeManager;
import com.dappervision.wearscript.managers.BlobManager;
import com.dappervision.wearscript.managers.CameraManager;
import com.dappervision.wearscript.managers.GestureManager;
import com.dappervision.wearscript.managers.WifiManager;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.util.TreeMap;

import de.greenrobot.event.EventBus;

public class WearScript {
    BackgroundService bs;
    String TAG = "WearScript";
    TreeMap<String, Integer> sensors;
    String sensorsJS;


    WearScript(BackgroundService bs) {
        this.bs = bs;
        this.sensors = new TreeMap<String, Integer>();
        // Sensor Types
        this.sensors.put("pupil", -2);
        this.sensors.put("gps", -1);
        this.sensors.put("accelerometer", 1);
        this.sensors.put("magneticField", 2);
        this.sensors.put("orientation", 3);
        this.sensors.put("gyroscope", 4);
        this.sensors.put("light", 5);
        this.sensors.put("gravity", 9);
        this.sensors.put("linearAcceleration", 10);
        this.sensors.put("rotationVector", 11);
        this.sensorsJS = (new JSONObject(this.sensors)).toJSONString();
    }

    public int sensor(String name) {
        return this.sensors.get(name);
    }

    public void shutdown() {
        //Global event
        Utils.getEventBus().post(new ShutdownEvent());
    }

    public String sensors() {
        return this.sensorsJS;
    }

    public void say(String text) {
        Utils.eventBusPost(new SayEvent(text));
        Log.i(TAG, "say: " + text);
    }

    public void serverTimeline(String ti) {
        Log.i(TAG, "timeline");
        Utils.eventBusPost(new ServerTimelineEvent(ti));
    }

    public void sensorOn(int type, double sampleTime) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type));
        Utils.eventBusPost(new SensorJSEvent(type, true, sampleTime, null));
    }

    public void sensorOn(int type, double sampleTime, String callback) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type) + " callback: " + callback);
        Utils.eventBusPost(new SensorJSEvent(type, true, sampleTime, callback));
    }

    public void log(String msg) {
        //Global event
        Utils.eventBusPost(new LogEvent(msg));
    }

    public void sensorOff(int type) {
        Log.i(TAG, "sensorOff: " + Integer.toString(type));
        Utils.eventBusPost(new SensorJSEvent(type, false));
    }

    public void serverConnect(String server, String callback) {
        Log.i(TAG, "serverConnect: " + server);
        //Global event
        Utils.eventBusPost(new ServerConnectEvent(server, callback));
    }

    public void displayWebView() {
        Log.i(TAG, "displayWebView");
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.WEBVIEW));
    }

    public void data(int type, String name, String values) {
        Log.i(TAG, "data");
        DataPoint dp = new DataPoint(name, type, System.currentTimeMillis() / 1000., System.nanoTime());
        JSONArray valuesArray = (JSONArray) JSONValue.parse(values);
        for (Object j : valuesArray) {
            try {
                dp.addValue((Double) j);
            } catch (ClassCastException e) {
                dp.addValue(((Long) j).doubleValue());
            }
        }
        Utils.eventBusPost(dp);
    }

    public void cameraOff() {
        Utils.eventBusPost(new CameraEvents.Start(0));
    }

    public void cameraPhoto() {
        cameraPhoto(null);
    }

    public void cameraPhoto(String callback) {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(CameraManager.PHOTO);
        Utils.eventBusPost(cr);
    }

    public void cameraVideo() {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, null);
        cr.setEvent(CameraManager.VIDEO);
        Utils.eventBusPost(cr);
    }

    public void cameraOn(double imagePeriod) {
        Utils.eventBusPost(new CameraEvents.Start(imagePeriod));
    }

    public void cameraCallback(int type, String callback) {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(type);
        Utils.eventBusPost(cr);
    }

    public void activityCreate() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.CREATE));
    }

    public void activityDestroy() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.DESTROY));
    }

    public void wifiOff() {
        Utils.eventBusPost(new WifiEvent(false));
    }

    public void wifiOn() {
        Utils.eventBusPost(new WifiEvent(true));
    }

    public void wifiOn(String callback) {
        Utils.eventBusPost(new CallbackRegistration(WifiManager.class, callback));
        Utils.eventBusPost(new WifiEvent(true));
    }

    public void wifiScan() {
        Utils.eventBusPost(new WifiScanEvent());
    }

    public void dataLog(boolean local, boolean server, double sensorDelay) {
        Utils.eventBusPost(new DataLogEvent(local, server, sensorDelay));
    }

    public boolean scriptVersion(int version) {
        if (version == 0) {
            return false;
        } else {
            Utils.eventBusPost(new SayEvent("Script version incompatible with client"));
            return true;
        }
    }

    public void wake() {
        Log.i(TAG, "wake");
        Utils.eventBusPost(new ScreenEvent(true));
    }

    public void qr(String cb) {
        Log.i(TAG, "QR");
        Utils.eventBusPost(new CallbackRegistration(BarcodeManager.class, cb).setEvent("QR_CODE"));
    }

    public void blobCallback(String name, String cb) {
        Log.i(TAG, "blobCallback");
        Utils.eventBusPost(new CallbackRegistration(BlobManager.class, cb).setEvent(name));
    }

    public void blobSend(String name, String payload) {
        Log.i(TAG, "blobSend");
        Blob blob = new Blob(name, payload).outgoing();
        Utils.eventBusPost(blob);
    }

    public void gestureCallback(String event, String callback) {
        Log.i(TAG, "gestureCallback: " + event + " " + callback);
        Utils.eventBusPost(new CallbackRegistration(GestureManager.class, callback).setEvent(event));
    }

    public void speechRecognize(String prompt, String callback) {
        Utils.eventBusPost(new SpeechRecognizeEvent(prompt, callback));
    }

    public void liveCardCreate(boolean nonSilent, double period) {
        Utils.eventBusPost(new LiveCardEvent(nonSilent, period));
    }

    public void liveCardDestroy() {
        Utils.eventBusPost(new LiveCardEvent(false, 0));
    }

    public void cardInsert(final int position, final String cardJSON) {
        MainActivity a = bs.activity.get();
        if (a != null) {
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.i(TAG, "cardInsert: " + position);
                    bs.getCardScrollAdapter().cardInsert(position, cardJSON);
                    bs.updateCardScrollView();
                }
            });
        }
    }

    public void cardModify(final int position, final String cardJSON) {
        MainActivity a = bs.activity.get();
        if (a != null) {
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.i(TAG, "cardModify: " + position);
                    bs.getCardScrollAdapter().cardModify(position, cardJSON);
                    bs.getCardScrollAdapter().cardInsert(position, cardJSON);
                    bs.updateCardScrollView();
                }
            });
        }
    }

    public void cardTrim(final int position) {
        MainActivity a = bs.activity.get();
        if (a != null) {
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.i(TAG, "cardTrim: " + position);
                    bs.getCardScrollAdapter().cardTrim(position);
                    bs.updateCardScrollView();
                }
            });
        }
    }

    public void cardDelete(final int position) {
        MainActivity a = bs.activity.get();
        if (a != null) {
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.i(TAG, "cardDelete: " + position);
                    bs.getCardScrollAdapter().cardDelete(position);
                    bs.updateCardScrollView();
                }
            });
        }
    }

    public void cardPosition(final int position) {
        MainActivity a = bs.activity.get();
        if (a != null) {
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.i(TAG, "cardPosition: " + position);
                    bs.cardPosition(position);
                }
            });
        }
    }

    public String cardFactory(String text, String info) {
        JSONObject o = new JSONObject();
        o.put("type", "card");
        o.put("text", text);
        o.put("info", info);
        return o.toJSONString();
    }

    public String cardFactoryHTML(String html) {
        JSONObject o = new JSONObject();
        o.put("type", "html");
        o.put("html", html);
        return o.toJSONString();
    }

    public void cardCallback(String event, String callback) {
        bs.getCardScrollAdapter().registerCallback(event, callback);
    }

    public void displayCardScroll() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.CARD_SCROLL));
    }

    public void picarus(String config, String input, String callback) {
        Utils.eventBusPost(new PicarusEvent());
    }
}
