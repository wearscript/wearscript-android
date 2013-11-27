package com.dappervision.wearscript;

import android.content.Intent;
import android.opengl.GLES20;
import android.util.Log;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.opencv.core.CvType;
import org.opencv.core.Mat;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

public class WearScript {
    BackgroundService bs;
    String TAG = "WearScript";
    TreeMap<String, Integer> sensors;
    String sensorsJS;
    TreeMap<String, Method> openglMethods;


    WearScript(BackgroundService bs) {
        this.bs = bs;
        this.sensors = new TreeMap<String, Integer>();
        this.openglMethods = new TreeMap<String, Method>();
        for (Method m: GLES20.class.getMethods())
            openglMethods.put(m.getName(), m);
        // Sensor Types
        this.sensors.put("battery", -3);
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
        bs.shutdown();
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
        bs.serverTimeline(ti);
    }

    public void sensorOn(int type, double sampleTime) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type));
        bs.getDataManager().registerProvider(type, Math.round(sampleTime * 1000000000L));
    }

    public void sensorOn(int type, double sampleTime, String callback) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type) + " callback: " + callback);
        sensorOn(type, sampleTime);
        bs.getDataManager().registerCallback(type, callback);
    }

    public void log(String msg) {
        Log.i(TAG, "log: " + msg);
        bs.log(msg);
    }

    public void sensorOff(int type) {
        Log.i(TAG, "sensorOff: " + Integer.toString(type));
        bs.getDataManager().unregister(type);
    }

    public void serverConnect(String server, String callback) {
        Log.i(TAG, "serverConnect: " + server);
        bs.serverConnect(server, callback);
    }

    public void displayWebView() {
        Log.i(TAG, "displayWebView");
        bs.updateActivityView("webview");
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
        bs.handleSensor(dp, null);
    }

    public void cameraOff() {
        bs.dataImage = false;
        // NOTE(brandyn): This resets all callbacks, we should determine if that's the behavior we want
        bs.getCameraManager().unregister(true);
    }

    public void cameraPhoto() {
        this.bs.getCameraManager().cameraPhoto();
    }

    public void cameraVideo() {
        this.bs.getCameraManager().cameraVideo();
    }

    public void cameraOn(double imagePeriod) {
        bs.dataImage = true;
        bs.imagePeriod = imagePeriod * 1000000000L;
        bs.getCameraManager().register();
    }

    public void cameraCallback(int type, String callback) {
        bs.getCameraManager().registerCallback(type, callback);
    }

    public void activityCreate() {
        Intent i = new Intent(bs, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        bs.startActivity(i);
    }

    public void activityDestroy() {
        bs.activity.get().finish();
    }

    public void wifiOff() {
        bs.dataWifi = false;
    }

    public void wifiOn() {
        bs.dataWifi = true;
    }

    public void wifiOn(String callback) {
        bs.wifiScanCallback = callback;
        wifiOn();
    }

    public void wifiScan() {
        bs.wifiStartScan();
    }

    public void dataLog(boolean local, boolean server, double sensorDelay) {
        bs.dataRemote = server;
        bs.dataLocal = local;
        bs.sensorDelay = sensorDelay * 1000000000L;
    }

    public boolean scriptVersion(int version) {
        if (version == 0) {
            return false;
        } else {
            bs.say("Script version incompatible with client");
            return true;
        }
    }

    public void wake() {
        Log.i(TAG, "wake");
        bs.wake();
    }

    public void blobCallback(String name, String cb) {
        Log.i(TAG, "blobCallback");
        bs.registerBlobCallback(name, cb);
    }

    public void blobSend(String name, String blob) {
        Log.i(TAG, "blobSend");
        bs.blobSend(name, blob);
    }

    public void gestureCallback(String event, String callback) {
        Log.i(TAG, "gestureCallback: " + event + " " + callback);
        bs.getGestureManager().registerCallback(event, callback);
    }

    public void speechRecognize(String prompt, String callback) {
        bs.speechRecognize(prompt, callback);
    }

    public void liveCardCreate(boolean nonSilent, double period) {
        bs.getScriptView().liveCardPublish(nonSilent, Math.round(period * 1000.));
    }

    public void liveCardDestroy() {
        bs.getScriptView().liveCardUnpublish();
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
        Log.i(TAG, "displayCardScroll");
        bs.updateActivityView("cardscroll");
    }

    public void picarus(String config, String input, String callback) {
        bs.loadPicarus();
    }

    private Object glConvert(Object v) {
        Log.i(TAG, "GL: " + v);
        return new Float((Double)v);
        //return float.class;
    }

    private Class glClass(Float v) {
        return float.class;
    }

    private Class glClass(Integer v) {
        return int.class;
    }

    public void glCallback(String callback) {
        bs.setOpenGLCallback(callback);
    }

    public void displayGL() {
        Log.i(TAG, "displayGL");
        bs.updateActivityView("opengl");
    }

    public void glDone() {
        try {
            bs.openglCommandQueue.put(new OpenGLStatement());
        } catch (InterruptedException e) {
            // TODO
        }
    }

    public void gl(String methodName, double p0, double p1, double p2, double p3) {
        glHelper(methodName, false, p0, p1, p2, p3);
    }

    public void gl(String methodName, double p0) {
        glHelper(methodName, false, p0);
    }

    public int glInt(String methodName, double p0) {
        return (Integer)glHelper(methodName, true, p0);
    }

    private Object glHelper(String methodName, boolean ret, Object...p) {
        Log.i(TAG, "OpenGL Method[d...]: " + methodName);
        Method m = openglMethods.get(methodName);
        if (m == null) {
            Log.e(TAG, "Method missing: " + methodName);
            return null;
        }
        Class<?>[] types = m.getParameterTypes();
        ArrayList<Object> args = new ArrayList<Object>();
        for (int i = 0; i < p.length; i++) {
            Class c = types[i];
            if (c.equals(float.class))
                args.add(((Double)p[i]).floatValue());
            else if (c.equals(int.class))
                args.add(((Double)p[i]).intValue());
            else if (c.equals(String.class))
                args.add(((String)p[i]));
            else {
                Log.e(TAG, "Cannot cast!: " + c);
                return null;
            }
        }
        try {
            bs.openglCommandQueue.put(new OpenGLStatement(m, ret, args.toArray()));
            if (ret) {
                Log.i(TAG, "Waiting for return");
                Object out = bs.openglResultQueue.take();
                Log.i(TAG, "Got return: " + out);
                return out;
            } else {
                Log.i(TAG, "Not waiting for return");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String glConstants() {
        JSONObject o = new JSONObject();
        for (Field f : GLES20.class.getFields()) {
            try {
                o.put(f.getName(), f.getInt(o));
            } catch (IllegalAccessException e) {
                Log.w(TAG, "Illegal access in glConstants: " + f.getName());
                continue;
            }
        }
        return o.toJSONString();
    }

    public String glMethods() {
        JSONArray o = new JSONArray();
        for (Method m : GLES20.class.getMethods()) {
            o.add(m.getName());
        }
        return o.toJSONString();
    }
}
