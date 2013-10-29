package com.dappervision.wearscript;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.SensorManager;
import android.media.AudioRecord;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Binder;
import android.os.Environment;
import android.os.IBinder;
import android.os.PowerManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.util.Base64;
import android.util.Log;
import android.webkit.WebView;

import org.msgpack.MessagePack;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.Mat;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.regex.Pattern;

import static org.msgpack.template.Templates.TValue;
import static org.msgpack.template.Templates.tList;

public class BackgroundService extends Service implements AudioRecord.OnRecordPositionUpdateListener, OnInitListener, SocketClient.SocketListener {
    private final IBinder mBinder = new LocalBinder();
    private final Object lock = new Object(); // All calls to webview client must acquire lock
    public WeakReference<MainActivity> activity;
    public boolean previewWarp = false, displayWeb = false;
    public Mat overlay;
    //public JSONArray wifiBuffer;
    public TreeSet<String> flags;
    public boolean dataRemote, dataLocal, dataImage, dataWifi;
    public double lastSensorSaveTime, lastImageSaveTime, sensorDelay, imagePeriod;
    protected static String TAG = "WearScript";
    protected CameraManager cameraManager;
    protected TreeMap<String, Mat> scriptImages;
    protected TextToSpeech tts;
    protected ScreenBroadcastReceiver broadcastReceiver;
    protected String glassID;
    MessagePack msgpack = new MessagePack();

    protected SocketClient client;
    protected WebView webview;
    protected DataManager dataManager;
    protected String wsUrl;
    protected PowerManager.WakeLock wakeLock;
    protected WifiManager wifiManager;
    public TreeMap<String, ArrayList<Value>> sensorBuffer;
    public TreeMap<String, Integer> sensorTypes;
    private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(this) {
        @Override
        public void onManagerConnected(int status) {
            switch (status) {
                case LoaderCallbackInterface.SUCCESS: {
                    Log.i(TAG, "OpenCV loaded successfully");
                    reset();
                }
                break;
                default: {
                    super.onManagerConnected(status);
                }
                break;
            }
        }
    };

    public void updateActivityView() {
        if (activity == null)
            return;
        final MainActivity a = activity.get();
        if (a == null)
            return;
        a.runOnUiThread(new Thread() {
            public void run() {
                if (displayWeb && webview != null) {
                    a.setContentView(webview);
                } else {

                }
            }
        });
    }

    public DataManager getDataManager() {
        return dataManager;
    }

    public CameraManager getCameraManager() {
        return cameraManager;
    }

    public void loadUrl(String url) {
        synchronized (lock) {
            if (webview != null && url != null) {
                webview.loadUrl(url);
            }
        }
    }

    public void handleSensor(DataPoint dp, String url) {
        synchronized (lock) {
            if (webview != null && url != null) {
                webview.loadUrl(url);
            }
            if (dataRemote || dataLocal) {
                Integer type = dp.getType();
                String name = dp.getName();
                if (!sensorBuffer.containsKey(name)) {
                    sensorBuffer.put(name, new ArrayList<Value>());
                    sensorTypes.put(name, type);
                }
                sensorBuffer.get(name).add(dp.getValue());
                if (System.nanoTime() - lastSensorSaveTime > sensorDelay) {
                    lastSensorSaveTime = System.nanoTime();
                    saveSensors();
                }
            }
        }
    }

    public void saveSensors() {
        final TreeMap<String, ArrayList<Value>> curSensorBuffer = sensorBuffer;
        if (curSensorBuffer.isEmpty())
            return;
        sensorBuffer = new TreeMap<String, ArrayList<Value>>();

        List<Value> output = new ArrayList<Value>();
        output.add(ValueFactory.createRawValue("sensors"));
        output.add(ValueFactory.createRawValue(glassID));
        ArrayList<Value> sensorTypes = new ArrayList();
        for (String k : this.sensorTypes.navigableKeySet()) {
            sensorTypes.add(ValueFactory.createRawValue(k));
            sensorTypes.add(ValueFactory.createIntegerValue(this.sensorTypes.get(k)));
        }
        output.add(ValueFactory.createMapValue(sensorTypes.toArray(new Value[0])));

        ArrayList<Value> sensors = new ArrayList();
        for (String k : curSensorBuffer.navigableKeySet()) {
            sensors.add(ValueFactory.createRawValue(k));
            sensors.add(ValueFactory.createArrayValue(curSensorBuffer.get(k).toArray(new Value[0])));
        }
        output.add(ValueFactory.createMapValue(sensors.toArray(new Value[0])));

        final byte[] dataStr;
        try {
            dataStr = msgpack.write(output);
        } catch (IOException e) {
            Log.e(TAG, "Couldn't serialize msgpack");
            e.printStackTrace();
            return;
        }
        if (dataLocal) {
            SaveData(dataStr, "data/", true, ".msgpack");
        }
        if (dataRemote) {
            if (clientConnected())
                synchronized (lock) {
                    client.send(dataStr);
                }
        }
    }

    public void handleImage(final CameraManager.CameraFrame frame) {
        // TODO(brandyn): Move this timing logic into the camera manager
        if (!dataImage || System.nanoTime() - lastImageSaveTime < imagePeriod)
            return;
        lastImageSaveTime = System.nanoTime();
        byte[] frameJPEG = frame.getJPEG();
        if (webview != null) {
            String jsCallback = cameraManager.buildCallbackString(0, frameJPEG);
            if (jsCallback != null)
                webview.loadUrl(jsCallback);
        }
        if (dataLocal) {
            // TODO(brandyn): We can improve timestamp precision by capturing it pre-encoding
            SaveData(frameJPEG, "data/", true, ".jpg");
        }
        if (dataRemote) {
            List<Value> output = new ArrayList<Value>();
            output.add(ValueFactory.createRawValue("image"));
            output.add(ValueFactory.createRawValue(glassID));
            output.add(ValueFactory.createFloatValue(System.currentTimeMillis() / 1000.));
            output.add(ValueFactory.createRawValue(frameJPEG));
            final byte[] dataStr;
            try {
                dataStr = msgpack.write(output);
            } catch (IOException e) {
                Log.e(TAG, "Couldn't serialize msgpack");
                e.printStackTrace();
                return;
            }
            if (clientConnected())
                synchronized (lock) {
                    client.send(dataStr);
                }
        }
    }

    private boolean clientConnected() {
        synchronized (lock) {
            if (client == null)
                return false;
            if (!client.isEnabled()) {
                client.enable();
            }
            return client.isEnabled();
        }
    }

    public void shutdown() {
        synchronized (lock) {
            reset();
            if (client != null) {
                client.disable();
                client = null;
            }
            if (activity == null)
                return;
            final MainActivity a = activity.get();
            if (a == null) {
                stopSelf();
                return;
            }
            a.runOnUiThread(new Thread() {
                public void run() {
                    a.bs.stopSelf();
                    a.finish();
                }
            });
        }
    }

    public void reset() {
        synchronized (lock) {
            if (webview != null) {
                webview.stopLoading();
                webview = null;
            }
            flags = new TreeSet<String>();
            scriptImages = new TreeMap<String, Mat>();
            sensorBuffer = new TreeMap<String, ArrayList<Value>>();
            sensorTypes = new TreeMap<String, Integer>();
            //wifiBuffer = new JSONArray();
            overlay = null;
            dataWifi = previewWarp = dataRemote = dataLocal = dataImage = false;
            displayWeb = true;
            lastSensorSaveTime = lastImageSaveTime = sensorDelay = imagePeriod = 0.;
            dataManager.unregister();
            cameraManager.unregister(true);
            updateActivityView();
        }
    }

    public void startDefaultScript() {
        runScript("<script>function s() {WS.say('Connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script>");
    }

    public void serverConnect(String url, final String callback) {
        Log.i(TAG, "WS Setup");
        synchronized (lock) {
            if (url.equals("{{WSUrl}}"))
                url = wsUrl;

            if (client != null && client.isEnabled() && wsUrl.equals(url)) {
                Log.i(TAG, "WS Reusing client and calling callback");
                if (callback != null && webview != null) {
                    webview.loadUrl(String.format("javascript:%s();", callback));
                }
                return;
            }

            //We are starting a new connection or switching URLs.
            wsUrl = url;
            if (client != null) {
                client.disable();
                client = null;
                client.setURI(URI.create(url));
            }else{
                client = new SocketClient(URI.create(url), this, callback);
            }
            client.enable();
        }
    }

    public void onSocketConnect(String cb) {
        Log.i(TAG, "WS Connected!");
        synchronized (lock) {
            if (cb != null && webview != null) {
                webview.loadUrl(String.format("javascript:%s();", cb));
            }
        }
    }

    public void onSocketMessage(String message) {
        //we don't use this
    }

    public void onSocketMessage(byte[] message) {
        try {
            Log.i(TAG, "0: " + Base64.encodeToString(message, Base64.NO_WRAP));
            List<Value> input = msgpack.read(message, tList(TValue));
            String action = input.get(0).asRawValue().getString();
            Log.i(TAG, String.format("Got %s", action));
            // TODO: String to Mat, save and display in the loopback thread
            if (action.equals("startScript")) {
                final String script = input.get(1).asRawValue().getString();
                Log.i(TAG, "WebView:" + Integer.toString(script.length()));
                if (activity == null)
                    return;
                final MainActivity a = activity.get();
                if (a == null)
                    return;
                a.runOnUiThread(new Thread() {
                    public void run() {
                        runScript(script);
                    }
                });
            } else if (action.equals("saveScript")) {
                final String script = input.get(1).asRawValue().getString();
                final String name = input.get(2).asRawValue().getString();
                Pattern p = Pattern.compile("[^a-zA-Z0-9]");
                if (name == null || name.isEmpty() || p.matcher(name).find()) {
                    Log.w(TAG, "Unable to save script");
                    return;
                }
                SaveData(script.getBytes(), "scripts/", false, name + ".html");
            } else if (action.equals("startScriptUrl")) {
                final String url = input.get(1).asRawValue().getString();
                if (activity == null)
                    return;
                final MainActivity a = activity.get();
                if (a == null)
                    return;
                a.runOnUiThread(new Thread() {
                    public void run() {
                        runScriptUrl(url);
                    }
                });
            } else if (action.equals("pingStatus")) {
                List<Value> output = new ArrayList<Value>();
                output.add(ValueFactory.createRawValue("pongStatus"));
                output.add(ValueFactory.createRawValue(glassID));
                // Display: On/Off  Activity Visible: True/False, Sensor Count (Raw): Map<Integer, Integer>, Sensor Count (Saved): Map<Integer, Integer>
                // Javascript: ?
                synchronized (lock) {
                    client.send(msgpack.write(output));
                }
            } else if (action.equals("data")) {
                // TODO(brandyn): Add remote sensors
            } else if (action.equals("image")) {
                if (webview != null) {
                    String jsCallback = cameraManager.buildCallbackString(1, input.get(3).asRawValue().getByteArray());
                    if (jsCallback != null)
                        webview.loadUrl(jsCallback);
                }
            } else if (action.equals("version")) {
                int versionExpected = 0;
                int version = input.get(1).asIntegerValue().getInt();
                if (version != versionExpected) {
                    say("Version mismatch!  Got " + version + " and expected " + versionExpected + ".  Visit wear script .com for information.");
                }
            } else if (action.equals("shutdown")) {
                Log.i(TAG, "Shutting down!");
                shutdown();
            } else if (action.equals("ping")) {
                /*remoteImageAckCount++;
                WSDataPong data = new WSDataPong();
                data.timestamp = System.currentTimeMillis() / 1000.;
                //o.action = "pong";
                //o.Tg1 = new Double(System.currentTimeMillis() / 1000.);
                synchronized (lock) {
                    client.send(msgpack.write(data));
                }
                */
            }
            Log.d(TAG, String.format("WS: Got string message! %d", message.length));
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
    }

    public void onSocketDisconnect(int code, String reason) {
        Log.d(TAG, String.format("WS: Disconnected! Code: %d Reason: %s", code, reason));
        synchronized (lock) {
            if (client == null || client.getListener() != this)
                return;
        }
        client.reconnect();
    }

    public void onSocketError(Exception error) {
        Log.e(TAG, "WS: Connection Error!", error);
    }

    static protected String SaveData(byte[] data, String path, boolean timestamp, String suffix) {
        try {
            try {
                File dir = new File(dataPath() + path);
                dir.mkdirs();
                File file;
                if (timestamp)
                    file = new File(dir, Long.toString(System.currentTimeMillis()) + suffix);
                else
                    file = new File(dir, suffix);

                FileOutputStream outputStream = new FileOutputStream(file);
                outputStream.write(data);
                outputStream.close();
                return file.getAbsolutePath();
            } catch (Exception e) {
                return null;
            }
        } catch (Exception e) {
            Log.e("SaveData", "Bad disc");
            return null;
        }
    }

    static public String dataPath() {
        return Environment.getExternalStorageDirectory().getAbsolutePath() + "/wearscript/";
    }

    protected byte[] LoadData(String path, String suffix) {
        try {
            try {
                File dir = new File(dataPath() + path);
                File file;
                file = new File(dir, suffix);
                FileInputStream inputStream = new FileInputStream(file);
                byte[] data = new byte[(int) file.length()];
                inputStream.read(data);
                inputStream.close();
                return data;
            } catch (Exception e) {
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Bad file read");
            return null;
        }

    }

    public void runScript(String script) {
        reset();
        synchronized (lock) {
            // TODO(brandyn): Refactor these as they are similar
            webview = new WebView(this);
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            Log.i(TAG, "WebView:" + script);
            String path = SaveData(script.getBytes(), "scripting/", false, "script.html");
            webview.setInitialScale(100);
            webview.loadUrl("file://" + path);
            Log.i(TAG, "WebView Ran");
            updateActivityView();
        }
    }

    public void runScriptUrl(String url) {
        reset();
        synchronized (lock) {
            // TODO(brandyn): Refactor these as they are similar
            webview = new WebView(this);
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            Log.i(TAG, "WebView:" + url);
            webview.setInitialScale(100);
            webview.loadUrl(url);
            Log.i(TAG, "WebView Ran");
            updateActivityView();
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.i(TAG, "Service onBind");
        return mBinder;
    }

    public String getMacAddress() {
        WifiInfo info = wifiManager.getConnectionInfo();
        return info.getMacAddress();
    }

    @Override
    public void onCreate() {
        Log.i(TAG, "Service onCreate");
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        //PowerManager.PARTIAL_WAKE_LOCK
        //wakeLock = pm.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "WearScript Background");
        //wakeLock.acquire(); // TODO: Should only do this if necessary
        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_SCREEN_OFF);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_BATTERY_CHANGED);
        intentFilter.addAction(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
        broadcastReceiver = new ScreenBroadcastReceiver(this);
        registerReceiver(broadcastReceiver, intentFilter);
        tts = new TextToSpeech(this, this);
        wifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
        glassID = getMacAddress();
        dataManager = new DataManager((SensorManager) getSystemService(SENSOR_SERVICE), this);
        cameraManager = new CameraManager(this);
        OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, this, mLoaderCallback);
    }

    public void wifiScanResults() {
        Double timestamp = System.currentTimeMillis() / 1000.;
        /*
        for (ScanResult s : wifiManager.getScanResults()) {
            JSONObject r = new JSONObject();
            r.put("timestamp", timestamp);
            r.put("capabilities", new String(s.capabilities));
            r.put("SSID", new String(s.SSID));
            r.put("BSSID", new String(s.BSSID));
            r.put("level", new Integer(s.level));
            r.put("frequency", new Integer(s.frequency));
            if (dataWifi)
                wifiBuffer.add(r);
        }
        */
    }

    public void wifiStartScan() {
        wifiManager.startScan();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "Service onStartCommand");
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "Service onDestroy");
        if (broadcastReceiver != null)
            unregisterReceiver(broadcastReceiver);
        //wakeLock.release();
        if (cameraManager != null) {
            cameraManager.unregister(true);
        }
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        shutdown();
        super.onDestroy();
    }

    public void serverTimeline(String ti) {
        synchronized (lock) {
            if (client != null && client.isEnabled()) {
                List<Value> output = new ArrayList<Value>();
                output.add(ValueFactory.createRawValue("timeline"));
                output.add(ValueFactory.createRawValue(ti));
                try {
                    client.send(msgpack.write(output));
                } catch (IOException e) {
                    Log.e(TAG, "serverTimeline: Couldn't serialize msgpack");
                }
            }
        }
    }

    public void log(String m) {
        synchronized (lock) {
            if (client != null && client.isEnabled()) {
                List<Value> output = new ArrayList<Value>();
                output.add(ValueFactory.createRawValue("log"));
                output.add(ValueFactory.createRawValue(m));
                try {
                    client.send(msgpack.write(output));
                } catch (IOException e) {
                    Log.e(TAG, "serverTimeline: Couldn't serialize msgpack");
                }
            }
        }
    }

    @Override
    public void onMarkerReached(AudioRecord arg0) {
        Log.i(TAG, "Audio mark");
    }

    @Override
    public void onPeriodicNotification(AudioRecord arg0) {
        Log.i(TAG, "Audio period");
    }

    public void say(String text) {
        if (tts == null)
            return;
        if (!tts.isSpeaking())
            tts.speak(text, TextToSpeech.QUEUE_FLUSH,
                    null);
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            int result = tts.setLanguage(Locale.US);
            // TODO: Check result
        }
        // TODO: Check result on else
    }

    class ScreenBroadcastReceiver extends BroadcastReceiver {
        BackgroundService bs;

        public ScreenBroadcastReceiver(BackgroundService bs) {
            this.bs = bs;
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                Log.i(TAG, "Screen off");
            } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                Log.i(TAG, "Screen on");
            } else if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
                Log.i(TAG, "Battery changed");
            } else if (intent.getAction().equals(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)) {
                Log.i(TAG, "Wifi scan results");
                if (dataWifi)
                    bs.wifiScanResults();
            }
        }
    }

    public class LocalBinder extends Binder {
        BackgroundService getService() {
            return BackgroundService.this;
        }
    }
}
