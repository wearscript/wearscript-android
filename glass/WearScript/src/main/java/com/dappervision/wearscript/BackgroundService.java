package com.dappervision.wearscript;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.SensorManager;
import android.media.AudioRecord;
import android.net.wifi.ScanResult;
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
import android.view.SurfaceView;
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

public class BackgroundService extends Service implements AudioRecord.OnRecordPositionUpdateListener, OnInitListener {
    private final IBinder mBinder = new LocalBinder();
    private final Object lock = new Object(); // All calls to webview client must acquire lock
    public WeakReference<MainActivity> activity;
    public boolean previewWarp = false, displayWeb = false;
    public Mat overlay;
    public JSONArray sensorBuffer;
    public JSONArray wifiBuffer;
    public TreeSet<String> flags;
    public String imageCallback;
    public boolean dataRemote, dataLocal, dataImage, dataWifi;
    public double lastSensorSaveTime, lastImageSaveTime, sensorDelay, imagePeriod;
    protected String TAG = "WearScript";
    protected TreeMap<String, Mat> scriptImages;
    protected TextToSpeech tts;
    protected ScreenBroadcastReceiver broadcastReceiver;
    protected String glassID;
    protected WebSocketClient client;
    protected WebView webview;
    protected DataManager dataManager;
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
                if (displayWeb && webview != null) {
                    a.setContentView(webview);
                } else {
                    a.setContentView(R.layout.surface_view);
                    a.view = (JavaCameraView) a.findViewById(R.id.activity_java_surface_view);
                    a.view.setVisibility(SurfaceView.VISIBLE);
                    a.view.setCvCameraViewListener(a);
                    a.view.enableView();
                }
            }
        });
    }

    public DataManager getDataManager() {
        return dataManager;
    }

    public void handleSensor(DataPoint dp, String url) {
        synchronized (lock) {
            if (webview != null && url != null) {
                webview.loadUrl(url);
            }
            if (dataRemote || dataLocal) {
                sensorBuffer.add(dp.toJSONObject());
                if (System.nanoTime() - lastSensorSaveTime > sensorDelay) {
                    lastSensorSaveTime = System.nanoTime();
                    saveDataPacket(null);
                }
            }
        }
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

    public void shutdown() {
        synchronized (lock) {
            reset();
            if (client != null) {
                client.disconnect();
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
            sensorBuffer = new JSONArray();
            wifiBuffer = new JSONArray();
            overlay = null;
            dataWifi = previewWarp = dataRemote = dataLocal = dataImage = false;
            /* Note(Conner): Changed displayWeb to true so that UpdateActivityView doesn't break
                the QR code Intent.
            */
            displayWeb = true;
            lastSensorSaveTime = lastImageSaveTime = sensorDelay = imagePeriod = 0.;
            dataManager.unregister();
            remoteImageAckCount = remoteImageCount = 0;
            updateActivityView();
        }
    }

    public void startDefaultScript() {
        byte[] defaultScriptArray = LoadData("", "default.html");
        if (defaultScriptArray == null) {
            runScript("<script>function s() {WS.say('Connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script>");
        } else {
            runScript(new String(defaultScriptArray));
        }
    }

    public void directStartScriptUrl(final String url) {
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
    }

    public void serverConnect(String url, final String callback) {
        Log.i(TAG, "WS Setup");
        List<BasicNameValuePair> extraHeaders = Arrays.asList();
        synchronized (lock) {
            if (url.equals("{{WSUrl}}"))
                url = wsUrl;
            if (client != null && client.isConnected() && wsUrl.equals(url)) {
                Log.i(TAG, "WS Reusing client and calling callback");
                if (callback != null && webview != null) {
                    webview.loadUrl(String.format("javascript:%s();", callback));
                }
                return;
            }
            if (client != null) {
                client.disconnect();
                client = null;
            }
            wsUrl = url;
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
                        if (action.equals("startScript") || action.equals("defaultScript")) {
                            final String script = (String) o.get("script");
                            Log.i(TAG, "WebView:" + Integer.toString(script.length()));
                            if (activity == null)
                                return;
                            final MainActivity a = activity.get();
                            if (a == null)
                                return;
                            if (action.equals("defaultScript"))
                                SaveData(script.getBytes(), "", false, "default.html");
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
                        } else if (action.equals("pingStatus")) {
                            o.put("action", "pongStatus");
                            o.put("glassID", glassID);
                            // Display: On/Off  Activity Visible: True/False, Sensor Count (Raw): Map<Integer, Integer>, Sensor Count (Saved): Map<Integer, Integer>
                            // Javascript: ?
                            synchronized (lock) {
                                client.send(o.toJSONString());
                            }
                        } else if (action.equals("data")) {
                            // TODO(brandyn): Add data point to provider
                        } else if (action.equals("shutdown")) {
                            Log.i(TAG, "Shutting down!");
                            shutdown();
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
