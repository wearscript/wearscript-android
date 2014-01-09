package com.dappervision.wearscript;

import android.opengl.GLES20;
import android.util.Base64;

import com.dappervision.wearscript.activities.MainActivity;
import com.dappervision.wearscript.dataproviders.DataPoint;
import com.dappervision.wearscript.events.LogEvent;
import com.dappervision.wearscript.events.ServerConnectEvent;
import com.dappervision.wearscript.events.ShutdownEvent;
import com.dappervision.wearscript.jsevents.ActivityEvent;
import com.dappervision.wearscript.jsevents.AudioEvent;
import com.dappervision.wearscript.jsevents.CallbackRegistration;
import com.dappervision.wearscript.jsevents.CameraEvents;
import com.dappervision.wearscript.jsevents.CardTreeEvent;
import com.dappervision.wearscript.jsevents.DataLogEvent;
import com.dappervision.wearscript.jsevents.LiveCardEvent;
import com.dappervision.wearscript.jsevents.OpenGLEvent;
import com.dappervision.wearscript.jsevents.OpenGLEventCustom;
import com.dappervision.wearscript.jsevents.OpenGLRenderEvent;
import com.dappervision.wearscript.jsevents.PicarusEvent;
import com.dappervision.wearscript.jsevents.SayEvent;
import com.dappervision.wearscript.jsevents.ScreenEvent;
import com.dappervision.wearscript.jsevents.SensorJSEvent;
import com.dappervision.wearscript.jsevents.ServerTimelineEvent;
import com.dappervision.wearscript.jsevents.SoundEvent;
import com.dappervision.wearscript.jsevents.SpeechRecognizeEvent;
import com.dappervision.wearscript.jsevents.WifiEvent;
import com.dappervision.wearscript.jsevents.WifiScanEvent;
import com.dappervision.wearscript.managers.BarcodeManager;
import com.dappervision.wearscript.managers.BlobManager;
import com.dappervision.wearscript.managers.CameraManager;
import com.dappervision.wearscript.managers.GestureManager;
import com.dappervision.wearscript.managers.OpenGLManager;
import com.dappervision.wearscript.managers.WifiManager;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.TreeMap;

public class WearScript {
    BackgroundService bs;
    String TAG = "WearScript";
    TreeMap<String, Integer> sensors;
    TreeMap<String, Method> openglMethods;
    TreeMap<String, String> openglTypes;
    String sensorsJS;

    public static enum SENSOR {
        BATTERY("battery", -3),
        PUPIL("pupil", -2),
        GPS("gps", -1),
        ACCELEROMETER("accelerometer", 1),
        MAGNETIC_FIELD("magneticField", 2),
        ORIENTATION("orientation", 3),
        GYROSCOPE("gyroscope", 4),
        LIGHT("light", 5),
        GRAVITY("gravity", 9),
        LINEAR_ACCELERATION("linearAcceleration", 10),
        ROTATION_VECTOR("rotationVector", 11);

        private final int id;
        private final String name;

        private SENSOR(String name, final int id) {
            this.id = id;
            this.name = name;
        }

        public int id() {
            return id;
        }

        public String toString() {
            return name;
        }
    }

    ;


    WearScript(BackgroundService bs) {
        this.bs = bs;
        this.sensors = new TreeMap<String, Integer>();
        // Sensor Types
        for (SENSOR s : SENSOR.values()) {
            this.sensors.put(s.toString(), s.id());
        }
        this.sensorsJS = (new JSONObject(this.sensors)).toJSONString();
        this.openglMethods = new TreeMap<String, Method>();
        this.openglTypes = new TreeMap<String, String>();

        for (Method m : GLES20.class.getMethods()) {
            // Skips the overloaded variants we don't use
            if (m.getName().equals("glVertexAttribPointer") && m.getParameterTypes()[5].equals(Buffer.class))
                continue;
            String typeString = "";
            Class<?>[] types = m.getParameterTypes();
            for (int i = 0; i < types.length; i++)
                typeString += classToChar(types[i]);
            typeString += classToChar(m.getReturnType());
            openglTypes.put(m.getName(), typeString);
            openglMethods.put(m.getName(), m);
        }
    }

    private String classToChar(Class c) {
        if (c.equals(float.class) || c.equals(int.class))
            return "D";
        else if (c.equals(String.class))
            return "S";
        else if (c.equals(boolean.class))
            return "B";
        else if (Buffer.class.isAssignableFrom(c) || c.equals(Buffer.class))
            return "U";
        else if (c.equals(void.class))
            return "V";
        return "?";
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

    public void audioOn() {
        Utils.eventBusPost(new AudioEvent(true));
    }

    public void audioOff() {
        Utils.eventBusPost(new AudioEvent(false));
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

    public void cameraPhotoPath(String callback) {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(CameraManager.PHOTO_PATH);
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
        CallbackRegistration cr = new CallbackRegistration(WifiManager.class, callback);
        cr.setEvent("wifi");
        Utils.eventBusPost(cr);
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

    public void displayCardTree() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.CARD_TREE));
    }

    public void picarus(String config, String input, String callback) {
        Utils.eventBusPost(new PicarusEvent());
    }

    public void sound(String type) {
        Log.i(TAG, "sound");
        Utils.eventBusPost(new SoundEvent(type));
    }

    public void cardTree(String treeJS) {
        Utils.eventBusPost(new CardTreeEvent(treeJS));
    }

    private Object glConvert(Object v) {
        Log.i(TAG, "GL: " + v);
        return new Float((Double) v);
        //return float.class;
    }

    private Class glClass(Float v) {
        return float.class;
    }

    private Class glClass(Integer v) {
        return int.class;
    }

    public void glCallback(String callback) {
        Utils.eventBusPost(new CallbackRegistration(OpenGLManager.class, callback).setEvent(OpenGLManager.OPENGL_DRAW_CALLBACK));
    }

    public void displayGL() {
        Log.i(TAG, "displayGL");
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.OPENGL));
    }

    public void glDone() {
        Log.d(TAG, "glDone");
        Utils.getEventBus().post(new OpenGLEvent());
    }

    public void glRender() {
        Log.d(TAG, "glRender");
        Utils.getEventBus().post(new OpenGLRenderEvent());
    }

    public void glDDDDV(String methodName, double p0, double p1, double p2, double p3) {
        glHelper(methodName, false, p0, p1, p2, p3);
    }

    public void glV(String methodName) {
        glHelper(methodName, false);
    }

    public void glDV(String methodName, double p0) {
        glHelper(methodName, false, p0);
    }

    public String glDS(String methodName, double p0) {
        return (String) glHelper(methodName, true, p0);
    }

    public void glDDV(String methodName, double p0, double p1) {
        Log.d(TAG, "OpenGL: Double Double: " + methodName);
        glHelper(methodName, false, p0, p1);
    }

    public void glDDDV(String methodName, double p0, double p1, double p2) {
        glHelper(methodName, false, p0, p1, p2);
    }

    public void glDDSDV(String methodName, double p0, double p1, String p2, double p3) {
        glHelper(methodName, false, p0, p1, p2, p3);
    }

    public void glDDDBDDV(String methodName, double p0, double p1, double p2, boolean p3, double p4, double p5) {
        glHelper(methodName, false, p0, p1, p2, p3, p4, p5);
    }

    public void glDDBSV(String methodName, double p0, double p1, boolean p2, String p3) {
        glHelper(methodName, false, p0, p1, p2, p3);
    }

    public void glDSV(String methodName, double p0, String p1) {
        Log.d(TAG, "OpenGL: Double string: " + methodName);
        glHelper(methodName, false, p0, p1);
    }

    public int glDSD(String methodName, double p0, String p1) {
        Log.d(TAG, "OpenGL: Double string ret int: " + methodName);
        return (Integer) glHelper(methodName, true, p0, p1);
    }

    private ByteBuffer stringToBuffer(String data) {
        Log.d(TAG, "stringToBuffer: " + data + " : " + data.length());
        ByteBuffer b = ByteBuffer.allocateDirect(data.length());
        b.put(Base64.decode(data, Base64.NO_WRAP));
        b.position(0);
        return b;
    }

    private FloatBuffer stringToFloatBuffer(String data) {
        return stringToBuffer(data).order(ByteOrder.nativeOrder()).asFloatBuffer();
    }

    public void glBufferData(double target, double size, String data, double usage) {
        glHelper("glBufferData", false, target, size, data, usage);
    }

    public int glCreateBuffer() {
        Log.d(TAG, "glCreateBuffer");
        return (Integer) postOpenGLEvent(new OpenGLEventCustom("glCreateBuffer", true));
    }

    public int glD(String methodName) {
        return (Integer) glHelper(methodName, true);
    }

    public int glDD(String methodName, double p0) {
        return (Integer) glHelper(methodName, true, p0);
    }

    public boolean glDB(String methodName, double p0) {
        return (Boolean) glHelper(methodName, true, p0);
    }

    private Object postOpenGLEvent(OpenGLEvent event) {
        Utils.getEventBus().post(event);
        if (event.hasReturn()) {
            Log.i(TAG, "Waiting for return");
            Object out = event.getReturn();
            Log.i(TAG, "Got return: " + out);
            return out;
        } else {
            Log.i(TAG, "Not waiting for return");
        }
        return null;
    }

    private Object glHelper(String methodName, boolean ret, Object... p) {
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
            try {
                if (c.equals(float.class))
                    args.add(((Double) p[i]).floatValue());
                else if (c.equals(int.class))
                    args.add(((Double) p[i]).intValue());
                else if (c.equals(String.class))
                    args.add(((String) p[i]));
                else if (c.equals(Buffer.class))
                    args.add(stringToBuffer((String) p[i]));
                else if (c.equals(boolean.class))
                    args.add((Boolean) p[i]);
                else if (c.equals(FloatBuffer.class))
                    args.add(stringToFloatBuffer((String) p[i]));
                else {
                    Log.e(TAG, "Cannot cast!: " + c);
                    return null;
                }
            } catch (ClassCastException e) {
                Log.e(TAG, String.format("ClassCastException: %s %s %s", methodName, c.getName(), p[i].getClass().getName()));
                return null;
            }
        }
        Log.d(TAG, String.format("OpenGLMethod: %s Params: %d Args: %d", methodName, p.length, args.size()));
        return postOpenGLEvent(new OpenGLEvent(m, ret, args.toArray()));
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
        return (new JSONObject(openglTypes)).toJSONString();
    }
}
