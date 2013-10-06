package com.dappervision.wearscript;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.AudioRecord;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Binder;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.os.PowerManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.util.Base64;
import android.util.Log;
import android.webkit.WebView;

import com.codebutler.android_websockets.WebSocketClient;

import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.lang.ref.WeakReference;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.TreeMap;
import java.util.TreeSet;

public class BackgroundService extends Service implements AudioRecord.OnRecordPositionUpdateListener, OnInitListener, SensorEventListener {
    private final IBinder mBinder = new LocalBinder();
    private final Object lock = new Object(); // All calls to webview, sensorSampleTimes, sensors, sensorSampleTimesLast, client must acquire lock
    public WeakReference<MainActivity> activity;
    public boolean previewWarp = false, displayWeb = false;
    public Mat overlay;
    public JSONArray sensorBuffer;
    public JSONArray wifiBuffer;
    public TreeSet<String> flags;
    public String sensorCallback, imageCallback;
    public boolean dataRemote, dataLocal, dataImage, dataWifi;
    public double lastSensorSaveTime, lastImageSaveTime, sensorDelay, imagePeriod;
    protected String TAG = "WearScript";
    protected TreeMap<String, Mat> scriptImages;
    protected TreeMap<Integer, Sensor> sensors;
    protected TreeMap<Integer, Long> sensorSampleTimesLast;
    protected TreeMap<Integer, Long> sensorSampleTimes;
    protected TextToSpeech tts;
    protected String glassID;
    protected WebSocketClient client;
    protected WebView webview;
    protected LocationManager locationManager;
    protected LocationListener locationListener;
    protected SensorManager sensorManager;
    protected int remoteImageAckCount, remoteImageCount;
    protected String wsUrl;
    protected PowerManager.WakeLock wakeLock;
    protected WifiManager wifiManager;
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
                if (displayWeb && webview != null)
                    a.setContentView(webview);
                else
                    a.setContentView(R.layout.surface_view);
            }
        });
    }

    public void handleSensor(JSONObject sensor) {
        synchronized (lock) {
            if (sensorCallback != null && webview != null) {
                webview.loadUrl(String.format("javascript:%s(%s);", sensorCallback, sensor.toJSONString()));
            }
        }
        if (dataRemote || dataLocal) {
            sensorBuffer.add(sensor);
            if (System.nanoTime() - lastSensorSaveTime > sensorDelay) {
                lastSensorSaveTime = System.nanoTime();
                saveDataPacket(null);
            }
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Integer type = event.sensor.getType();
        synchronized (lock) {
            if (sensorSampleTimes == null || sensorSampleTimesLast == null)
                return;
            Long sampleTimeLast = sensorSampleTimesLast.get(type);
            Long sampleTime = sensorSampleTimes.get(type);
            if (sampleTimeLast == null || sampleTime == null || event.timestamp - sampleTimeLast < sampleTime)
                return;
            sensorSampleTimesLast.put(type, event.timestamp);
        }
        JSONObject sensor = new JSONObject();
        // NOTE(brandyn): The light sensor's timestampRaw is incorrect, this has been reported
        // TODO(brandyn): Look into removing extra boxing, keep in mind we are buffering
        sensor.put("timestamp", System.currentTimeMillis() / 1000.);
        sensor.put("timestampRaw", new Long(event.timestamp));
        sensor.put("type", new Integer(event.sensor.getType()));
        sensor.put("name", event.sensor.getName());
        JSONArray values = new JSONArray();
        for (int i = 0; i < event.values.length; i++) {
            values.add(new Float(event.values[i]));
        }
        sensor.put("values", values);
        handleSensor(sensor);
    }

    public void saveDataPacket(final Mat frame) {
        final JSONArray curSensorBuffer = sensorBuffer;
        final JSONArray curWifiBuffer = wifiBuffer;
        final Double Tsave = new Double(System.currentTimeMillis() / 1000.);
        sensorBuffer = new JSONArray();
        wifiBuffer = new JSONArray();

        JSONObject data = new JSONObject();
        if (frame != null) {
            Log.i(TAG, "Got frame:" + frame.size().toString());
            MatOfByte jpgFrame = new MatOfByte();
            Highgui.imencode(".jpg", frame, jpgFrame);
            final byte[] out = jpgFrame.toArray();
            data.put("imageb64", Base64.encodeToString(out, Base64.NO_WRAP));
        }
        if (!curSensorBuffer.isEmpty())
            data.put("sensors", curSensorBuffer);
        if (!wifiBuffer.isEmpty())
            data.put("wifi", wifiBuffer);
        data.put("Tsave", Tsave);
        data.put("Tg0", new Double(System.currentTimeMillis() / 1000.));
        data.put("glassID", glassID);
        data.put("action", "data");
        final String dataStr = data.toJSONString();
        if (dataLocal) {
            SaveData(dataStr.getBytes(), "data/", true, ".js");
        }
        if (dataRemote) {
            if (frame != null)
                remoteImageCount++;
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
            if (!client.isConnected()) {
                remoteImageAckCount = remoteImageCount = 0;
                client.connect();
            }
            return client.isConnected();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }

    public void reset() {
        synchronized (lock) {
            if (client != null) {
                client.disconnect();
                client = null;
            }
            if (webview != null) {
                webview.stopLoading();
                webview = null;
            }
            flags = new TreeSet<String>();
            scriptImages = new TreeMap<String, Mat>();
            TreeMap<Integer, Sensor> sensorsPrev = sensors;
            if (sensors != null) {
                for (Integer type : (new TreeSet<Integer>(sensors.navigableKeySet()))) {
                    sensorOff(type);
                }
            }
            sensors = new TreeMap<Integer, Sensor>();
            sensorBuffer = new JSONArray();
            wifiBuffer = new JSONArray();
            overlay = null;
            sensorSampleTimes = new TreeMap<Integer, Long>();
            sensorSampleTimesLast = new TreeMap<Integer, Long>();
            dataWifi = previewWarp = dataRemote = dataLocal = dataImage = false;
            sensorCallback = null;
            lastSensorSaveTime = lastImageSaveTime = sensorDelay = imagePeriod = 0.;
            sensorManager.unregisterListener(this);
            remoteImageAckCount = remoteImageCount = 0;
            wsUrl = null;
        }
    }

    public void serverConnect(String url, final String callback) {
        Log.i(TAG, "WS Setup");
        wsUrl = url;
        List<BasicNameValuePair> extraHeaders = Arrays.asList();
        synchronized (lock) {
            client = new WebSocketClient(URI.create(url), new WebSocketClient.Listener() {
                private String cb = callback;

                @Override
                public void onConnect() {
                    Log.i(TAG, "WS Connected!");
                    remoteImageAckCount = remoteImageCount = 0;
                    synchronized (lock) {
                        if (cb != null && webview != null) {
                            webview.loadUrl(String.format("javascript:%s();", cb));
                            cb = null;
                        }
                    }
                }

                @Override
                public void onMessage(String message) {
                    try {
                        JSONObject o = (JSONObject) JSONValue.parse(message);

                        String action = (String) o.get("action");
                        Log.i(TAG, String.format("Got %s", action));
                        // TODO: String to Mat, save and display in the loopback thread
                        if (action.equals("startScript")) {
                            final String script = (String) o.get("script");
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
                        } else if (action.equals("startScriptUrl")) {
                            final String url = (String) o.get("scriptUrl");
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
                        } else if (action.equals("data")) {
                            for (Object sensor : (JSONArray) o.get("sensors")) {
                                JSONObject s = (JSONObject) sensor;
                                int sensorType = ((Long) s.get("type")).intValue();
                                synchronized (lock) {
                                    if (sensorType < 0 && sensors.containsKey(sensorType))
                                       handleSensor(s);
                                }
                            }
                        } else if (action.equals("ping")) {
                            remoteImageAckCount++;
                            o.put("action", "pong");
                            o.put("Tg1", new Double(System.currentTimeMillis() / 1000.));
                            synchronized (lock) {
                                client.send(o.toJSONString());
                            }
                        } else if (action.equals("flags")) {
                            JSONArray a = (JSONArray) o.get("flags");
                            if (a != null)
                                flags = new TreeSet<String>((List<String>) a);
                        }
                        Log.d(TAG, String.format("WS: Got string message! %d", message.length()));
                    } catch (Exception e) {
                        Log.e(TAG, e.toString());
                    }
                }

                @Override
                public void onDisconnect(int code, String reason) {
                    Log.d(TAG, String.format("WS: Disconnected! Code: %d Reason: %s", code, reason));
                    synchronized (lock) {
                        if (client == null || client.getListener() != this)
                            return;
                    }
                    remoteImageAckCount = remoteImageCount = 0;
                    new Thread(new Runnable() {
                        public void run() {
                            ReconnectClient(client);
                        }
                    }).start();
                }

                @Override
                public void onError(Exception error) {
                    Log.e(TAG, "WS: Error!", error);
                }

                @Override
                public void onMessage(byte[] arg0) {
                    // TODO Auto-generated method stub

                }

            }, extraHeaders);
            client.connect();
        }
    }

    protected void ReconnectClient(WebSocketClient client) {
        synchronized (lock) {
            if (client == null)
                return;
        }
        while (true) {
            synchronized (lock) {
                if (client.isConnected())
                    break;
                client.connect();
            }
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
            }
        }
    }

    protected String SaveData(byte[] data, String path, boolean timestamp, String suffix) {
        try {
            try {
                File dir = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/wearscript/" + path);
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
            Log.e(TAG, "Bad disc");
            return null;
        }
    }

    protected byte[] LoadData(String path, String suffix) {
        try {
            try {
                File dir = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/wearscript/" + path);
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
            webview = new WebView(this);
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            Log.i(TAG, "WebView:" + script);
            String path = SaveData(script.getBytes(), "scripting/", false, "script.html");
            webview.setInitialScale(100);
            webview.loadUrl("file://" + path);
            Log.i(TAG, "WebView Ran");
        }
    }

    public void runScriptUrl(String url) {
        reset();
        synchronized (lock) {
            webview = new WebView(this);
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            Log.i(TAG, "WebView:" + url);
            webview.setInitialScale(100);
            webview.loadUrl(url);
            Log.i(TAG, "WebView Ran");
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
        registerReceiver(new ScreenBroadcastReceiver(this), intentFilter);
        tts = new TextToSpeech(this, this);
        wifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
        glassID = getMacAddress();
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, this, mLoaderCallback);
    }

    public void wifiScanResults() {
        Double timestamp = System.currentTimeMillis() / 1000.;
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
    }

    public void wifiStartScan() {
        wifiManager.startScan();
    }

    public void sensorOn(int type, long sampleTime) {
        synchronized (lock) {
            if (sensors.containsKey(type))
                return;

            sensorSampleTimes.put(type, sampleTime);
            sensorSampleTimesLast.put(type, 0L);

            if (type < -1) // Custom
                sensors.put(type, null);
            if (type == -1) { // GPS
                locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                locationListener = new LocationListener() {
                    @Override
                    public void onLocationChanged(Location l) {
                        JSONObject sensor = new JSONObject();
                        sensor.put("timestamp", System.currentTimeMillis() / 1000.);
                        sensor.put("type", new Integer(-1));
                        sensor.put("name", "GPS");
                        JSONArray values = new JSONArray();
                        values.add(new Float(l.getLatitude()));
                        values.add(new Float(l.getLongitude()));
                        values.add(new Float(l.getBearing()));
                        values.add(new Float(l.getSpeed()));
                        sensor.put("values", values);
                        handleSensor(sensor);
                    }

                    @Override
                    public void onProviderDisabled(String provider) {
                    }

                    @Override
                    public void onProviderEnabled(String provider) {
                    }

                    @Override
                    public void onStatusChanged(String provider, int status, Bundle extras) {
                    }
                };
                for (String provider : locationManager.getAllProviders())
                    if (locationManager.isProviderEnabled(provider))
                        locationManager.requestLocationUpdates(provider, 10000, 0, locationListener);
            } else { // Standard Android Sensors
                Sensor s = sensorManager.getDefaultSensor(type);
                sensors.put(type, s);
                sensorManager.registerListener(this, s, SensorManager.SENSOR_DELAY_GAME);
            }
        }
    }

    public void sensorOff(int type) {
        synchronized (lock) {
            if (!sensors.containsKey(type))
                return;
            Sensor s = sensors.get(type);
            sensors.remove(type);
            if (type == -1) {  // GPS
                locationManager.removeUpdates(locationListener);
                locationManager = null;
                locationListener = null;
            }
            if (s != null)
                sensorManager.unregisterListener(this, s);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "Service onStartCommand");
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "Service onDestroy");
        //wakeLock.release();
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
    }

    public void serverTimeline(JSONObject ti) {
        Log.i(TAG, "Timeline: " + ti.toJSONString());
        JSONObject data = new JSONObject();
        data.put("action", "timeline");
        data.put("ti", ti);
        synchronized (lock) {
            client.send(data.toJSONString());
        }
    }

    public void log(String m) {
        synchronized (lock) {
            if (client != null && client.isConnected()) {
                JSONObject data = new JSONObject();
                data.put("action", "log");
                data.put("message", m);
                client.send(data.toJSONString());
            }
        }
    }

    @Override
    public void onMarkerReached(AudioRecord arg0) {
        // TODO Auto-generated method stub
        Log.i(TAG, "Audio mark");
    }

    @Override
    public void onPeriodicNotification(AudioRecord arg0) {
        // TODO Auto-generated method stub
        Log.i(TAG, "Audio period");
    }

    protected Mat ImageBGRFromString(String dataB64) {
        byte[] data = Base64.decode(dataB64, Base64.NO_WRAP);
        Mat frame = new Mat(1, data.length, CvType.CV_8UC1);
        frame.put(0, 0, data);
        return Highgui.imdecode(frame, 1);
    }

    protected Mat ImageRGBAFromString(String data) {
        Mat frameBGR = ImageBGRFromString(data);
        Mat frameRGBA = new Mat(frameBGR.rows(), frameBGR.cols(), CvType.CV_8UC4);
        Imgproc.cvtColor(frameBGR, frameRGBA, Imgproc.COLOR_BGR2RGBA);
        return frameRGBA;
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
