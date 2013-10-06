package com.dappervision.wearscript;

import android.util.Log;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.opencv.core.CvType;
import org.opencv.core.Mat;

import java.util.TreeMap;

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

    public String sensors() {
        return this.sensorsJS;
    }

    public void say(String text) {
        Log.i(TAG, "say: " + text);
        bs.say(text);
    }

    public void serverTimeline(String ti) {
        Log.i(TAG, "timeline");
        // TODO: Require WS connection
        bs.serverTimeline((JSONObject) new JSONValue().parse(ti));
    }

    public boolean hasFlag(String flag) {
        Log.i(TAG, "hasFlag");
        return bs.flags.contains(flag);
    }

    public void imageCreate(String key, int height, int width) {
        Log.i(TAG, "imageCreate: " + key);
        bs.scriptImages.put(key, new Mat(height, width, CvType.CV_8UC4));
    }

    public void sensorOn(int type, double sampleTime) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type));
        bs.sensorOn(type, Math.round(sampleTime * 1000000000L));
    }

    public void sensorCallback(String callback) {
        Log.i(TAG, "sensorCallback: " + callback);
        bs.sensorCallback = callback;
    }

    public void log(String msg) {
        Log.i(TAG, "log: " + msg);
        bs.log(msg);
    }


    public void sensorOff(int type) {
        Log.i(TAG, "sensorOff: " + Integer.toString(type));
        bs.sensorOff(type);
    }

    public void serverConnect(String server, String callback) {
        Log.i(TAG, "serverConnect: " + server);
        bs.serverConnect(server, callback);
    }

    public void imageCopy(String src, String dst) {
        Log.i(TAG, "imageCopy: " + src + " to " + dst);
        Mat image = bs.scriptImages.get(src);
        if (image == null)
            return;
        bs.scriptImages.put(dst, image.clone());
    }

    public void imageDelete(String key) {
        Log.i(TAG, "imageDelete: " + key);
        bs.scriptImages.remove(key);
    }

    public void displayImage(String key) {
        Log.i(TAG, "displayImage:" + key);
        bs.overlay = bs.scriptImages.get(key);
        bs.previewWarp = false;
        bs.displayWeb = false;
        bs.updateActivityView();
    }

    public void displayARWarp() {
        Log.i(TAG, "displayARWarp");
        bs.previewWarp = true;
        bs.displayWeb = false;
        bs.overlay = null;
        bs.updateActivityView();
    }

    public void displayWebView() {
        Log.i(TAG, "displayWebView");
        bs.previewWarp = false;
        bs.displayWeb = true;
        bs.overlay = null;
        bs.updateActivityView();
    }

    public void displayCamera() {
        Log.i(TAG, "displayCamera");
        bs.previewWarp = false;
        bs.displayWeb = false;
        bs.overlay = null;
        bs.updateActivityView();
    }


    public void data(int type, String name, String values) {
        Log.i(TAG, "data");
        JSONObject sensor = new JSONObject();
        sensor.put("timestamp", System.currentTimeMillis() / 1000.);
        sensor.put("type", new Integer(type));
        sensor.put("name", name);
        JSONArray valuesJS = (JSONArray) (new JSONValue()).parse(values);
        sensor.put("values", valuesJS);
        bs.sensorBuffer.add(sensor);
    }

    public void cameraOff() {
        bs.dataImage = false;
        // TODO: Turn off camera
    }

    public void cameraOn(double imagePeriod) {
        bs.dataImage = true;
        bs.imagePeriod = imagePeriod * 1000000000L;
        // TODO: Turn on camera
    }

    public void wifiListenOff() {
        bs.dataWifi = false;
    }

    public void wifiListenOn() {
        bs.dataWifi = true;
    }

    public void dataLog(boolean local, boolean server, double sensorDelay) {
        bs.dataRemote = server;
        bs.dataLocal = local;
        bs.sensorDelay = sensorDelay * 1000000000L;
    }
}
