package com.dappervision.wearscript;

import android.content.Intent;
import android.util.Base64;
import android.webkit.JavascriptInterface;

import com.dappervision.wearscript.audio.AudioRecorder;
import com.dappervision.wearscript.events.ActivityEvent;
import com.dappervision.wearscript.events.BluetoothBondEvent;
import com.dappervision.wearscript.events.BluetoothModeEvent;
import com.dappervision.wearscript.events.BluetoothWriteEvent;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.events.CameraEvents;
import com.dappervision.wearscript.events.CardTreeEvent;
import com.dappervision.wearscript.events.ChannelSubscribeEvent;
import com.dappervision.wearscript.events.ChannelUnsubscribeEvent;
import com.dappervision.wearscript.events.ControlEvent;
import com.dappervision.wearscript.events.DataLogEvent;
import com.dappervision.wearscript.events.GistSyncEvent;
import com.dappervision.wearscript.events.JsCall;
import com.dappervision.wearscript.events.LiveCardEvent;
import com.dappervision.wearscript.events.LiveCardSetMenuEvent;
import com.dappervision.wearscript.events.MediaActionEvent;
import com.dappervision.wearscript.events.MediaEvent;
import com.dappervision.wearscript.events.PebbleMessageEvent;
import com.dappervision.wearscript.events.PicarusBenchmarkEvent;
import com.dappervision.wearscript.events.PicarusEvent;
import com.dappervision.wearscript.events.PicarusModelCreateEvent;
import com.dappervision.wearscript.events.PicarusModelProcessEvent;
import com.dappervision.wearscript.events.PicarusModelProcessStreamEvent;
import com.dappervision.wearscript.events.PicarusModelProcessWarpEvent;
import com.dappervision.wearscript.events.SayEvent;
import com.dappervision.wearscript.events.ScreenEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.SendSubEvent;
import com.dappervision.wearscript.events.SensorJSEvent;
import com.dappervision.wearscript.events.ServerConnectEvent;
import com.dappervision.wearscript.events.ShutdownEvent;
import com.dappervision.wearscript.events.SoundEvent;
import com.dappervision.wearscript.events.SpeechRecognizeEvent;
import com.dappervision.wearscript.events.WarpModeEvent;
import com.dappervision.wearscript.events.WarpSetAnnotationEvent;
import com.dappervision.wearscript.events.WarpSetupHomographyEvent;
import com.dappervision.wearscript.events.WifiEvent;
import com.dappervision.wearscript.events.WifiScanEvent;
import com.dappervision.wearscript.managers.BarcodeManager;
import com.dappervision.wearscript.managers.BluetoothManager;
import com.dappervision.wearscript.managers.CameraManager;
import com.dappervision.wearscript.managers.ConnectionManager;
import com.dappervision.wearscript.managers.EyeManager;
import com.dappervision.wearscript.managers.GestureManager;
import com.dappervision.wearscript.managers.MediaManager;
import com.dappervision.wearscript.managers.OpenCVManager;
import com.dappervision.wearscript.managers.PebbleManager;
import com.dappervision.wearscript.managers.PicarusManager;
import com.dappervision.wearscript.managers.RecordingManager;
import com.dappervision.wearscript.managers.WarpManager;
import com.dappervision.wearscript.managers.WifiManager;

import org.json.simple.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.Buffer;
import java.util.Arrays;
import java.util.List;
import java.util.TreeMap;

public class WearScript {
    BackgroundService bs;
    String TAG = "WearScript";
    TreeMap<String, Integer> sensors;
    String sensorsJS;
    List<String> touchGesturesList;
    List<String> pebbleGesturesList;

    WearScript(BackgroundService bs) {
        this.bs = bs;
        this.sensors = new TreeMap<String, Integer>();
        // Sensor Types
        for (SENSOR s : SENSOR.values()) {
            this.sensors.put(s.toString(), s.id());
        }
        this.sensorsJS = (new JSONObject(this.sensors)).toJSONString();
        String[] touchGestures = {"onGesture", "onFingerCountChanged", "onScroll", "onTwoFingerScroll"};
        touchGesturesList = Arrays.asList(touchGestures);
        String[] pebbleGestures = {"onPebbleSingleClick", "onPebbleLongClick", "onPebbleAccelTap"};
        pebbleGesturesList = Arrays.asList(pebbleGestures);
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

    @JavascriptInterface
    public int sensor(String name) {
        return this.sensors.get(name);
    }

    @JavascriptInterface
    public void shutdown() {
        //Global event
        Utils.getEventBus().post(new ShutdownEvent());
    }

    @JavascriptInterface
    public String sensors() {
        return this.sensorsJS;
    }

    @JavascriptInterface
    public void say(String text) {
        Utils.eventBusPost(new SayEvent(text));
        Log.i(TAG, "say: " + text);
    }

    @JavascriptInterface
    public void serverTimeline(String ti) {
        Log.i(TAG, "timeline");
        Utils.eventBusPost(new SendSubEvent("mirror", ti));
    }

    @JavascriptInterface
    public void sensorOn(int type, double sampleTime) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type));
        Utils.eventBusPost(new SensorJSEvent(type, true, sampleTime, null));
    }

    @JavascriptInterface
    public void sensorOn(int type, double sampleTime, String callback) {
        Log.i(TAG, "sensorOn: " + Integer.toString(type) + " callback: " + callback);
        Utils.eventBusPost(new SensorJSEvent(type, true, sampleTime, callback));
    }

    @JavascriptInterface
    public void log(String msg) {
        //Global event
        Utils.eventBusPost(new SendSubEvent("log", msg));
    }

    @JavascriptInterface
    public void sensorOff(int type) {
        Log.i(TAG, "sensorOff: " + Integer.toString(type));
        Utils.eventBusPost(new SensorJSEvent(type, false));
    }

    @JavascriptInterface
    public void mediaLoad(String uri, boolean looping){
        try {
            Utils.eventBusPost(new MediaEvent(new URI(uri), looping));
        } catch (URISyntaxException e) {
            // TODO(kurtisnelson): Handle
        }
    }

    @JavascriptInterface
    public void mediaPlay(){
        Utils.eventBusPost(new MediaActionEvent("play"));
    }

    @JavascriptInterface
    public void mediaPause(){
        Utils.eventBusPost(new MediaActionEvent("pause"));
    }

    @JavascriptInterface
    public void mediaStop(){
        Utils.eventBusPost(new MediaActionEvent("stop"));
    }

    @JavascriptInterface
    public void mediaPlayReverse(int speed){ Utils.eventBusPost(new MediaActionEvent("playReverse",speed)); }

    @JavascriptInterface
    public void mediaPlayFastForward(int speed){ Utils.eventBusPost(new MediaActionEvent("playFastForward",speed)); }

    @JavascriptInterface
    public void mediaFastForward(int speed){ Utils.eventBusPost(new MediaActionEvent("fastForward",speed)); }

    @JavascriptInterface
    public void mediaRewind(int speed){ Utils.eventBusPost(new MediaActionEvent("rewind",speed)); }

    @JavascriptInterface
    public void mediaOnGesture(String gesture, String callback)
    {
        Utils.eventBusPost(new CallbackRegistration(MediaManager.class, callback).setEvent(gesture));
    }
    @JavascriptInterface
    public void mediaJump(int jumpTo){ Utils.eventBusPost(new MediaActionEvent("jump",jumpTo)); }

    public void mediaSeekTo(int msecs) { Utils.eventBusPost(new MediaActionEvent("seekTo", msecs)); }

    @JavascriptInterface
    public void mediaSeekBackwards(int msecs) { Utils.eventBusPost(new MediaActionEvent("seekBackwards", msecs)); }

    @JavascriptInterface
    public void serverConnect(String server, String callback) {
        Log.i(TAG, "serverConnect: " + server);
        if (server.equals("{{WSUrl}}"))
            server = bs.getDefaultUrl();
        if (server == null) {
            Log.e(TAG, "Lifecycle: Invalid url provided");
            return;
        }
        try {
            Utils.eventBusPost(new ServerConnectEvent(new URI(server), callback));
        } catch (URISyntaxException e) {
            // TODO(brandyn): Handle
        }
    }

    @JavascriptInterface
    public void displayWebView() {
        Log.i(TAG, "displayWebView");
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.WEBVIEW));
    }

    @JavascriptInterface
    public void displayWarpView() {
        Log.i(TAG, "displayWarpView");
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.WARP));
    }

    @JavascriptInterface
    public void displayWarpView(String homography) {
        Log.i(TAG, "displayWarpView");
        Utils.eventBusPost(new WarpSetupHomographyEvent(homography));
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.WARP));
    }

    @JavascriptInterface
    public void cvInit(String callback) {
        Utils.eventBusPost(new CallbackRegistration(OpenCVManager.class, callback).setEvent(OpenCVManager.LOAD));
    }

    @JavascriptInterface
    public void warpPreviewSamplePlane(String callback) {
        Log.i(TAG, "warpPreviewsample");
        Utils.eventBusPost(new CallbackRegistration(WarpManager.class, callback).setEvent(WarpManager.SAMPLE));

        Utils.eventBusPost(new WarpModeEvent(WarpManager.Mode.SAMPLEWARPPLANE));
    }

    @JavascriptInterface
    public void warpPreviewSampleGlass(String callback) {
        Log.i(TAG, "warpPreviewsample");
        Utils.eventBusPost(new CallbackRegistration(WarpManager.class, callback).setEvent(WarpManager.SAMPLE));
        Utils.eventBusPost(new WarpModeEvent(WarpManager.Mode.SAMPLEWARPGLASS));
    }

    @JavascriptInterface
    public void warpARTags(String callback) {
        Log.i(TAG, "warpARTags");
        Utils.eventBusPost(new CallbackRegistration(WarpManager.class, callback).setEvent(WarpManager.ARTAGS));
    }

    @JavascriptInterface
    public void warpGlassToPreviewH(String callback) {
        Log.i(TAG, "warpPreviewsample");
        Utils.eventBusPost(new CallbackRegistration(WarpManager.class, callback).setEvent(WarpManager.GLASS2PREVIEWH));
    }

    @JavascriptInterface
    public void warpSetOverlay(String image) {
        Utils.eventBusPost(new WarpSetAnnotationEvent(Base64.decode(image, Base64.NO_WRAP)));
    }

    @JavascriptInterface
    public void cameraOff() {
        Utils.eventBusPost(new CameraEvents.Start(0));
    }

    @JavascriptInterface
    public void cameraPhotoData(String callback) {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(CameraManager.PHOTO);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void cameraPhoto(String callback) {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(CameraManager.PHOTO_PATH);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void cameraPhoto() {
        // TODO(brandyn): This is a hack, we should have a separate event to take a photo and just register the callback prior to that
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, null);
        cr.setEvent(CameraManager.PHOTO_PATH);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void cameraVideo() {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, null);
        cr.setEvent(CameraManager.VIDEO_PATH);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void cameraVideo(String callback) {
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(CameraManager.VIDEO_PATH);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void cameraOn(double imagePeriod, int maxHeight, int maxWidth, boolean background) {
        Utils.eventBusPost(new CameraEvents.Start(imagePeriod, maxHeight, maxWidth, background));
    }

    @JavascriptInterface
    public void cameraOn(double imagePeriod, int maxHeight, int maxWidth, boolean background, String callback) {
        Log.d(TAG, "cameraOn: Callback: " + callback);
        cameraOn(imagePeriod, maxHeight, maxWidth, background);
        CallbackRegistration cr = new CallbackRegistration(CameraManager.class, callback);
        cr.setEvent(0);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void startAudioBuffer() {
        Log.d(TAG, "in startAudioBuffer()!");

        Intent intent = new Intent("com.wearscript.record.RECORD_AUDIO").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        bs.startService(intent);

        /*Intent intent = new Intent();
        intent.setAction("com.wearscript.audio.RECORD");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);*/
        //bs.sendBroadcast(intent);

        //bs.sendBroadcast(new Intent("com.wearscript.AUDIO"));
    }

    @JavascriptInterface
    public void saveAudioBuffer(String callback) {
        Log.d(TAG, "in saveAudioBuffer()");
        Intent intent = new Intent("com.wearscript.record.SAVE_AUDIO").putExtra(AudioRecorder.MILLIS_EXTRA_KEY, System.currentTimeMillis());
        bs.startService(intent);
        CallbackRegistration cr = new CallbackRegistration(RecordingManager.class, callback);
        cr.setEvent(RecordingManager.SAVED);
        Utils.eventBusPost(cr);
    }

    @JavascriptInterface
    public void activityCreate() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.CREATE));
    }

    @JavascriptInterface
    public void activityDestroy() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.DESTROY));
    }

    @JavascriptInterface
    public void wifiOff() {
        Utils.eventBusPost(new WifiEvent(false));
    }

    @JavascriptInterface
    public void wifiOn() {
        Utils.eventBusPost(new WifiEvent(true));
    }

    @JavascriptInterface
    public void wifiOn(String callback) {
        CallbackRegistration cr = new CallbackRegistration(WifiManager.class, callback);
        cr.setEvent(WifiManager.WIFI);
        Utils.eventBusPost(cr);
        Utils.eventBusPost(new WifiEvent(true));
    }

    @JavascriptInterface
    public void wifiScan() {
        Utils.eventBusPost(new WifiScanEvent());
    }

    @JavascriptInterface
    public void dataLog(boolean local, boolean server, double sensorDelay) {
        Utils.eventBusPost(new DataLogEvent(local, server, sensorDelay));
    }

    @JavascriptInterface
    public boolean scriptVersion(int version) {
        if (version == 1) {
            return false;
        } else {
            Utils.eventBusPost(new SayEvent("Script version incompatible with client"));
            return true;
        }
    }

    @JavascriptInterface
    public void wake() {
        Log.i(TAG, "wake");
        Utils.eventBusPost(new ScreenEvent(true));
    }

    @JavascriptInterface
    public void qr(String cb) {
        Log.i(TAG, "QR");
        Utils.eventBusPost(new CallbackRegistration(BarcodeManager.class, cb).setEvent(BarcodeManager.QR_CODE));
    }

    @JavascriptInterface
    public void subscribe(String name, String cb) {
        Log.i(TAG, "subscribe");
        Utils.eventBusPost(new ChannelSubscribeEvent(name, cb));
    }

    @JavascriptInterface
    public void unsubscribe(String name) {
        Log.i(TAG, "unsubscribe");
        Utils.eventBusPost(new ChannelUnsubscribeEvent(name));
    }

    @JavascriptInterface
    public void publish(String channel, String data) {
        Log.i(TAG, "publish " + channel);
        Utils.eventBusPost(new SendEvent(channel, Base64.decode(data, Base64.NO_WRAP)));
    }

    @JavascriptInterface
    public String echo(String data) {
        Log.i(TAG, "echo");
        return data;
    }

    @JavascriptInterface
    public int echolen(String data) {
        Log.i(TAG, "echolen");
        return data.length();
    }

    @JavascriptInterface
    public void echocall(String data) {
        Log.i(TAG, "echocb");
        Utils.eventBusPost(new JsCall(data));
    }

    @JavascriptInterface
    public void gistSync() {
        Log.i(TAG, "gistSync");
        Utils.eventBusPost(new GistSyncEvent());
    }

    @JavascriptInterface
    public void gestureCallback(String event, String callback) {
        Log.i(TAG, "gestureCallback: " + event + " " + callback);
        Class route = EyeManager.class;
        for (String gesture : touchGesturesList)
            if (event.startsWith(gesture)) {
                route = GestureManager.class;
                break;
            }
        for (String pebbleGesture : pebbleGesturesList) {
            if (event.startsWith(pebbleGesture)) {
                route = PebbleManager.class;
                break;
            }
        }
        Utils.eventBusPost(new CallbackRegistration(route, callback).setEvent(event));
    }

    @JavascriptInterface
    public void pebbleSetTitle(String title, boolean clear) {
        Log.i(TAG, "pebbleSetTitle: " + title);
        Utils.eventBusPost(new PebbleMessageEvent("setTitle", title, clear));
    }

    @JavascriptInterface
    public void pebbleSetSubtitle(String subTitle, boolean clear) {
        Log.i(TAG, "pebbleSetSubtitle: " + subTitle);
        Utils.eventBusPost(new PebbleMessageEvent("setSubtitle", subTitle, clear));
    }

    @JavascriptInterface
    public void pebbleSetBody(String body, boolean clear) {
        Log.i(TAG, "pebbleSetSubTitle: " + body);
        Utils.eventBusPost(new PebbleMessageEvent("setBody", body, clear));
    }

    @JavascriptInterface
    public void pebbleVibe(int type) {
        Log.i(TAG, "pebbleVibe: " + type);
        Utils.eventBusPost(new PebbleMessageEvent("vibe", type));
    }

    @JavascriptInterface
    public void speechRecognize(String prompt, String callback) {
        Utils.eventBusPost(new SpeechRecognizeEvent(prompt, callback));
    }

    @JavascriptInterface
    public void liveCardCreate(boolean nonSilent, double period, String menu) {
        requiresGDK();
        Utils.eventBusPost(new LiveCardSetMenuEvent(menu));
        Utils.eventBusPost(new LiveCardEvent(nonSilent, period));
    }

    @JavascriptInterface
    public void liveCardDestroy() {
        requiresGDK();
        Utils.eventBusPost(new LiveCardEvent(false, 0));
    }

    @JavascriptInterface
    public void displayCardTree() {
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.CARD_TREE));
    }

    @JavascriptInterface
    public void sound(String type) {
        Log.i(TAG, "sound");
        Utils.eventBusPost(new SoundEvent(type));
    }

    @JavascriptInterface
    public void cardTree(String treeJS) {
        requiresGDK();
        Utils.eventBusPost(new CardTreeEvent(treeJS));
    }

    @JavascriptInterface
    public void bluetoothList(String callback) {
        Utils.eventBusPost(new CallbackRegistration(BluetoothManager.class, callback).setEvent(BluetoothManager.LIST));
    }

    @JavascriptInterface
    public void bluetoothDiscover(String callback) {
        Utils.eventBusPost(new CallbackRegistration(BluetoothManager.class, callback).setEvent(BluetoothManager.DISCOVERY_START));
    }

    @JavascriptInterface
    public void bluetoothBond(String address, String pin) {
        Utils.eventBusPost(new BluetoothBondEvent(address, pin));
    }

    @JavascriptInterface
    public void bluetoothRead(String device, String callback) {
        Utils.eventBusPost(new CallbackRegistration(BluetoothManager.class, callback).setEvent(BluetoothManager.READ + device));
    }

    @JavascriptInterface
    public void bluetoothWrite(String address, String data) {
        Utils.eventBusPost(new BluetoothWriteEvent(address, data));
    }

    @JavascriptInterface
    public void bluetoothEnable() {
        Utils.eventBusPost(new BluetoothModeEvent(true));
    }

    @JavascriptInterface
    public void bluetoothDisable() {
        Utils.eventBusPost(new BluetoothModeEvent(false));
    }

    @JavascriptInterface
    public String groupDevice() {
        ConnectionManager cm = (ConnectionManager) bs.getManager(ConnectionManager.class);
        if (cm == null)
            return null;
        return cm.groupDevice();
    }

    @JavascriptInterface
    public String group() {
        ConnectionManager cm = (ConnectionManager) bs.getManager(ConnectionManager.class);
        if (cm == null)
            return null;
        return cm.group();
    }

    @JavascriptInterface
    public String device() {
        ConnectionManager cm = (ConnectionManager) bs.getManager(ConnectionManager.class);
        if (cm == null)
            return null;
        return cm.device();
    }

    @JavascriptInterface
    public void control(String event, boolean adb){
        Utils.eventBusPost(new ControlEvent(event, adb));
    }

    @JavascriptInterface
    public void picarus(String model, String input, String callback) {
        Utils.eventBusPost((new CallbackRegistration(PicarusManager.class, callback)).setEvent(callback));
        Utils.eventBusPost(new PicarusEvent(Base64.decode(model.getBytes(), Base64.NO_WRAP),
            Base64.decode(input.getBytes(), Base64.NO_WRAP),
            callback));
    }

    @JavascriptInterface
    public void picarusBenchmark() {
        Utils.eventBusPost(new PicarusBenchmarkEvent());
    }

    @JavascriptInterface
    public void picarusModelCreate(String model, int id, String callback) {
        Utils.eventBusPost(new PicarusModelCreateEvent(Base64.decode(model.getBytes(), Base64.NO_WRAP), id, callback));
    }

    @JavascriptInterface
    public void picarusModelProcess(int id, String input, String callback) {
        Utils.eventBusPost(new PicarusModelProcessEvent(id, Base64.decode(input.getBytes(), Base64.NO_WRAP), callback));
    }

    @JavascriptInterface
    public void picarusModelProcessStream(int id, String callback) {
        Utils.eventBusPost((new CallbackRegistration(PicarusManager.class, callback)).setEvent(PicarusManager.MODEL_STREAM + id));
        Utils.eventBusPost(new PicarusModelProcessStreamEvent(id));
    }

    @JavascriptInterface
    public void picarusModelProcessWarp(int id, String callback) {
        Utils.eventBusPost((new CallbackRegistration(PicarusManager.class, callback)).setEvent(PicarusManager.MODEL_WARP + id));
        Utils.eventBusPost(new PicarusModelProcessWarpEvent(id));
    }

    private void requiresGDK() {
        if (HardwareDetector.hasGDK)
            return;
        Utils.eventBusPost(new SendSubEvent("log", "Script requires glass"));
        Utils.eventBusPost(new SayEvent("This script requires Glass"));
        throw new RuntimeException("GDK not available");
    }

    public static enum SENSOR {
        PEBBLE_ACCELEROMETER("pebbleAccelerometer", -7),
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
}
