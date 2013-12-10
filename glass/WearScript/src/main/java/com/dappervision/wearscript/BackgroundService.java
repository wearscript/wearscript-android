package com.dappervision.wearscript;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioRecord;
import android.os.Binder;
import android.os.Environment;
import android.os.IBinder;
import android.os.PowerManager;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.util.Base64;
import android.view.View;
import android.view.ViewGroup;

import com.dappervision.wearscript.activities.MainActivity;
import com.dappervision.wearscript.dataproviders.DataPoint;
import com.dappervision.wearscript.events.JsCall;
import com.dappervision.wearscript.events.LogEvent;
import com.dappervision.wearscript.events.SendBlobEvent;
import com.dappervision.wearscript.events.ServerConnectEvent;
import com.dappervision.wearscript.events.ShutdownEvent;
import com.dappervision.wearscript.jsevents.ActivityEvent;
import com.dappervision.wearscript.jsevents.BlobCallbackEvent;
import com.dappervision.wearscript.jsevents.CameraEvents;
import com.dappervision.wearscript.jsevents.DataLogEvent;
import com.dappervision.wearscript.jsevents.PicarusEvent;
import com.dappervision.wearscript.jsevents.SayEvent;
import com.dappervision.wearscript.jsevents.ScreenEvent;
import com.dappervision.wearscript.jsevents.ServerTimelineEvent;
import com.dappervision.wearscript.jsevents.SpeechRecognizeEvent;
import com.dappervision.wearscript.managers.BarcodeManager;
import com.dappervision.wearscript.managers.CameraManager;
import com.dappervision.wearscript.managers.DataManager;
import com.dappervision.wearscript.managers.GestureManager;
import com.dappervision.wearscript.managers.PicarusManager;
import com.dappervision.wearscript.managers.WifiManager;
import com.google.android.glass.media.Camera;
import com.google.android.glass.widget.CardScrollView;

import org.msgpack.MessagePack;
import org.msgpack.type.ArrayValue;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

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
import java.util.regex.Pattern;

import de.greenrobot.event.EventBus;

import static org.msgpack.template.Templates.TValue;
import static org.msgpack.template.Templates.tList;

public class BackgroundService extends Service implements AudioRecord.OnRecordPositionUpdateListener, OnInitListener, SocketClient.SocketListener {
    private final IBinder mBinder = new LocalBinder();
    private final Object lock = new Object(); // All calls to webview client must acquire lock
    public WeakReference<MainActivity> activity;
    public boolean dataRemote, dataLocal, dataWifi;
    public double lastSensorSaveTime, sensorDelay;
    protected static String TAG = "WearScript";
    protected CameraManager cameraManager;
    protected TextToSpeech tts;
    protected ScreenBroadcastReceiver broadcastReceiver;
    protected String glassID;
    MessagePack msgpack = new MessagePack();
    private String speechCallback;

    protected SocketClient client;
    public ScriptView webview;

    public String wsUrl;

    //Managers
    protected WifiManager wifiManager;
    protected GestureManager gestureManager;
    protected BarcodeManager BarcodeManager;
    protected DataManager dataManager;
    protected PicarusManager picarusManager;

    public TreeMap<String, ArrayList<Value>> sensorBuffer;
    public TreeMap<String, Integer> sensorTypes;
    public TreeMap<String, String> blobCallbacks;
    public String wifiScanCallback;
    public String photoCallback;
    protected ScriptCardScrollAdapter cardScrollAdapter;
    protected CardScrollView cardScroller;
    private View activityView;
    private String activityMode;

    public void updateActivityView(final String mode) {
        if (activity == null)
            return;
        final MainActivity a = activity.get();
        if (a == null)
            return;
        a.runOnUiThread(new Thread() {
            public void run() {
                activityMode = mode;
                if (mode.equals("webview") && webview != null) {
                    activityView = webview;
                } else if (mode.equals("cardscroll")) {
                    activityView = cardScroller;
                } else {
                }
                if (activityView != null) {
                    ViewGroup parentViewGroup = (ViewGroup) activityView.getParent();
                    if (parentViewGroup != null)
                        parentViewGroup.removeAllViews();
                    a.setContentView(activityView);
                } else {
                    Log.i(TAG, "Not setting activity view because it is null: " + mode);
                }
            }
        });
    }

    public void refreshActivityView() {
        updateActivityView(activityMode);
    }

    public void resetDefaultUrl() {
        byte[] wsUrlArray = LoadData("", "qr.txt");
        if (wsUrlArray == null) {
            say("Must setup wear script");
            return;
        }
        wsUrl = (new String(wsUrlArray)).trim();
    }

    public View getActivityView() {
        return activityView;
    }

    public void removeAllViews() {
        if (webview != null) {
            ViewGroup parentViewGroup = (ViewGroup) webview.getParent();
            if (parentViewGroup != null)
                parentViewGroup.removeAllViews();
        }
        if (cardScroller != null) {
            ViewGroup parentViewGroup = (ViewGroup) cardScroller.getParent();
            if (parentViewGroup != null)
                parentViewGroup.removeAllViews();
        }
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

    public void cardPosition(int position) {
        cardScroller.setSelection(position);
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

    public void onEventAsync(CameraEvents.Frame frameEvent) {
        try {
            final CameraManager.CameraFrame frame = frameEvent.getCameraFrame();
            // TODO(brandyn): Move this timing logic into the camera manager
            Log.d(TAG, "handeImage Thread: " + Thread.currentThread().getName());
            byte[] frameJPEG = null;
            if (webview != null) {
                if (frameJPEG == null)
                    frameJPEG = frame.getJPEG();
                String call = cameraManager.buildCallbackString(CameraManager.LOCAL, frameJPEG);
                if (call != null) {
                    Log.d(TAG, "Image JS Callback");
                    EventBus.getDefault().post(new JsCall(call));
                }
            }
            if (dataLocal) {
                if (frameJPEG == null)
                    frameJPEG = frame.getJPEG();
                // TODO(brandyn): We can improve timestamp precision by capturing it pre-encoding
                SaveData(frameJPEG, "data/", true, ".jpg");
            }
            if (dataRemote) {
                if (frameJPEG == null)
                    frameJPEG = frame.getJPEG();
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
        } finally {
            frameEvent.done();
        }
    }

    private boolean clientConnected() {
        synchronized (lock) {
            if (client == null)
                return false;
            if (!client.isConnected()) {
                client.reconnect();
            }
            return client.isConnected();
        }
    }

    public void shutdown() {
        synchronized (lock) {
            reset();
            Log.d(TAG, "Disconnecting client");
            if (client != null) {
                client.shutdown();
            }
            client = null;
            if (activity == null)
                return;
            final MainActivity a = activity.get();
            if (a == null) {
                Log.d(TAG, "Stop self not activity");
                stopSelf();
                return;
            }
            Log.d(TAG, "Running on ui thread");
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.d(TAG, "Stop self activity");
                    a.bs.stopSelf();
                    a.finish();
                }
            });
        }
    }

    public void reset() {
        synchronized (lock) {
            Log.d(TAG, "reset");
            // NOTE(brandyn): Put in a better spot
            if (webview != null) {
                webview.stopLoading();
                webview.onDestroy();
                webview = null;
            }
            sensorBuffer = new TreeMap<String, ArrayList<Value>>();
            sensorTypes = new TreeMap<String, Integer>();
            wifiScanCallback = null;
            photoCallback = null;
            blobCallbacks = new TreeMap<String, String>();
            dataWifi = dataRemote = dataLocal =  false;
            lastSensorSaveTime  = sensorDelay = 0.;
            dataManager.unregister();
            cameraManager.unregister(true);
            cardScrollAdapter.reset();
            updateCardScrollView();
            speechCallback = null;

            if (gestureManager == null) {
                if (activity != null) {
                    MainActivity a = activity.get();
                    if (a != null)
                        gestureManager = new GestureManager(a, this);
                }
            } else {
                gestureManager.unregister();
            }
            updateActivityView("webview");
        }
    }

    public void startDefaultScript() {
        runScript("<script>function s() {WS.say('Connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script>");
    }


    public void wake() {
        final PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        final PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE, "BackgroundService");
        wakeLock.acquire();
        wakeLock.release();
    }

    public ScriptCardScrollAdapter getCardScrollAdapter() {
        return cardScrollAdapter;
    }

    public CardScrollView getCardScrollView() {
        return cardScroller;
    }

    public void updateCardScrollView() {
        if (activity == null)
            return;
        final MainActivity a = activity.get();
        if (a == null)
            return;
        a.runOnUiThread(new Thread() {
            public void run() {
                cardScroller.updateViews(true);
            }
        });
    }

    public void serverConnect(String url, final String callback) {
        Log.i(TAG, "WS Setup");
        synchronized (lock) {
            if (url.equals("{{WSUrl}}")) {
                // NOTE(brandyn): This means that we use the system default and not the previously
                // set url (e.g., if it was changed manually by a script)
                resetDefaultUrl();
                url = wsUrl;
            }
            if (url == null) {
                Log.e(TAG, "Lifecycle: Invalid url provided");
                return;
            }
            if (client != null && client.isConnected() && wsUrl.equals(url)) {
                Log.i(TAG, "WS Reusing client and calling callback");
                if (callback != null && webview != null) {
                    webview.loadUrl(String.format("javascript:%s();", callback));
                }
                return;
            }

            //We are starting a new connection or switching URLs.
            if (client != null) {
                client.disconnect();
                client = null;
            }
            wsUrl = url;
            client = new SocketClient(URI.create(url), this, callback);
            client.reconnect();
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

    public void onSocketMessage(byte[] message) {
        try {
            List<Value> input = msgpack.read(message, tList(TValue));
            String action = input.get(0).asRawValue().getString();
            Log.d(TAG, String.format("Got %s", action));
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
            } else if (action.equals("sensors")) {
                TreeMap<String, Integer> types = new TreeMap<String, Integer>();
                Value[] typesKeyValues = input.get(2).asMapValue().getKeyValueArray();
                for (int i = 0; i < typesKeyValues.length / 2; i++)
                    types.put(typesKeyValues[i * 2].asRawValue().getString(), typesKeyValues[i * 2 + 1].asIntegerValue().getInt());
                Value[] samplesKeyValues = input.get(3).asMapValue().getKeyValueArray();
                for (int i = 0; i < samplesKeyValues.length / 2; i++) {
                    String name = samplesKeyValues[i * 2].asRawValue().getString();
                    Integer type = types.get(name);
                    if (type == null) {
                        Log.w(TAG, "Unknown type in sensors: " + name);
                        continue;
                    }
                    Value[] samples = samplesKeyValues[i * 2 + 1].asArrayValue().getElementArray();
                    for (int j = 0; j < samples.length; j++) {
                        ArrayValue sample = samples[j].asArrayValue();
                        DataPoint dp = new DataPoint(name, type, sample.get(1).asFloatValue().getDouble(), sample.get(2).asIntegerValue().getLong());
                        for (Value k : sample.get(0).asArrayValue().getElementArray())
                            dp.addValue(k.asFloatValue().getDouble());
                        dataManager.queueRemote(dp);
                    }
                }
            } else if (action.equals("image")) {
                String call = cameraManager.buildCallbackString(CameraManager.REMOTE, input.get(3).asRawValue().getByteArray());
                EventBus.getDefault().post(new JsCall(call));
            } else if (action.equals("raven")) {
                Log.setDsn(input.get(1).asRawValue().getString());
            } else if (action.equals("blob")) {
                String name = input.get(1).asRawValue().getString();
                byte[] blob = input.get(2).asRawValue().getByteArray();
                String blobCallback = blobCallbacks.get(name);
                if (blobCallback != null && webview != null) {
                    String data = String.format("javascript:%s(\"%s\");", blobCallback, Base64.encodeToString(blob, Base64.NO_WRAP));
                    webview.loadUrl(data);
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

    public static String SaveData(byte[] data, String path, boolean timestamp, String suffix) {
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

    protected byte[] LoadFile(File file) {
        try {
            try {
                Log.i(TAG, "LoadFile: " + file.getAbsolutePath());
                FileInputStream inputStream = new FileInputStream(file);
                byte[] data = new byte[(int) file.length()];
                inputStream.read(data);
                inputStream.close();
                return data;
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Bad file read");
            return null;
        }
    }

    public byte[] LoadData(String path, String suffix) {
        return LoadFile(new File(new File(dataPath() + path), suffix));
    }

    public void runScript(String script) {
        reset();
        synchronized (lock) {
            // TODO(brandyn): Refactor these as they are similar
            webview = createScriptView();
            updateActivityView("webview");
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            Log.d(TAG, "WebView:" + script);
            String path = SaveData(script.getBytes(), "scripting/", false, "script.html");
            webview.setInitialScale(100);
            webview.loadUrl("file://" + path);
            Log.i(TAG, "WebView Ran");
        }
    }

    public void runScriptUrl(String url) {
        reset();
        synchronized (lock) {
            // TODO(brandyn): Refactor these as they are similar
            webview = createScriptView();
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            Log.d(TAG, "WebView:" + url);
            webview.setInitialScale(100);
            webview.loadUrl(url);
            Log.i(TAG, "WebView Ran");
            updateActivityView("webview");
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.i(TAG, "Service onBind");
        return mBinder;
    }

    @Override
    public void onCreate() {
        Log.i(TAG, "Lifecycle: Service onCreate");
        EventBus.getDefault().register(this);

        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_SCREEN_OFF);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_BATTERY_CHANGED);
        intentFilter.addAction(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
        broadcastReceiver = new ScreenBroadcastReceiver(this);
        registerReceiver(broadcastReceiver, intentFilter);

        //Plugin new Managers here
        dataManager = new DataManager(this);
        cameraManager = new CameraManager(this);
        BarcodeManager = new BarcodeManager(this);
        wifiManager = new WifiManager(this);

        tts = new TextToSpeech(this, this);

        glassID = wifiManager.getMacAddress();

        cardScrollAdapter = new ScriptCardScrollAdapter(BackgroundService.this);
        cardScroller = new CardScrollView(this);
        cardScroller.setAdapter(cardScrollAdapter);
        cardScroller.activate();
        cardScroller.setOnItemSelectedListener(cardScrollAdapter);
        cardScroller.setOnItemClickListener(cardScrollAdapter);
        reset();
    }

    public void setMainActivity(MainActivity a) {
        Log.i(TAG, "Lifecycle: BackgroundService: setMainActivity");
        if (this.activity != null) {
            MainActivity activity = this.activity.get();
            if (activity != null)
                activity.finish();
        }
        this.activity = new WeakReference<MainActivity>(a);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "Service onStartCommand");
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "Lifecycle: Service onDestroy");
        EventBus.getDefault().unregister(this);
        if (broadcastReceiver != null)
            unregisterReceiver(broadcastReceiver);
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

    public void onEvent(CameraEvents.Photo e){
        photoCallback = e.getCallback();
    }

    public void onEvent(JsCall e){
        loadUrl(e.getCall());
    }

    public void onEvent(SayEvent e){
        say(e.getMsg());
    }

    public void onEvent(ActivityEvent e){
        if(e.getMode() == ActivityEvent.Mode.CREATE){
            Intent i = new Intent(this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        }else if(e.getMode() == ActivityEvent.Mode.DESTROY){
            activity.get().finish();
        }else if(e.getMode() == ActivityEvent.Mode.WEBVIEW){
            updateActivityView("webview");
        }else if(e.getMode() == ActivityEvent.Mode.CARD_SCROLL){
            updateActivityView("cardscroll");
        }
    }

    public void onEvent(DataLogEvent e){
        dataRemote = e.isServer();
        dataLocal = e.isLocal();
        sensorDelay = e.getSensorDelay() * 1000000000L;
    }

    public void onEvent(SpeechRecognizeEvent e){
        speechRecognize(e.getPrompt(), e.getCallback());
    }

    public void onEvent(PicarusEvent e){
        picarusManager = new PicarusManager(this);
    }

    public void onEvent(SendBlobEvent e){
        blobSend(e.getName(), e.getBlob());
    }

    public void onEvent(BlobCallbackEvent e){
        registerBlobCallback(e.getName(), e.getCallback());
    }

    public void onEvent(ScreenEvent e){
        wake();
    }

    public void onEvent(DataPoint dp){
        handleSensor(dp, null);
    }

    public void onEvent(LogEvent e){
        Log.i(TAG, "log: " + e.getMsg());
        log(e.getMsg());
    }

    public void onEvent(ServerTimelineEvent e){
        serverTimeline(e.getMsg());
    }

    public void onEvent(ShutdownEvent e){
        shutdown();
    }

    public void onEvent(ServerConnectEvent e){
        serverConnect(e.getServer(), e.getCallback());
    }

    public void serverTimeline(String ti) {
        synchronized (lock) {
            if (client != null && client.isConnected()) {
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

    public void blobSend(String type, String blob) {
        synchronized (lock) {
            if (client != null && client.isConnected()) {
                List<Value> output = new ArrayList<Value>();
                output.add(ValueFactory.createRawValue("blob"));
                output.add(ValueFactory.createRawValue(type));
                output.add(ValueFactory.createRawValue(blob));
                try {
                    client.send(msgpack.write(output));
                } catch (IOException e) {
                    Log.e(TAG, "blobSend: Couldn't serialize msgpack");
                }
            }
        }
    }

    public void registerBlobCallback(String type, String jsFunction) {
        blobCallbacks.put(type, jsFunction);
    }

    public void log(String m) {
        synchronized (lock) {
            if (client != null && client.isConnected()) {
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

    public CameraManager getCameraManager() {
        return cameraManager;
    }

    class ScreenBroadcastReceiver extends BroadcastReceiver {
        BackgroundService bs;

        public ScreenBroadcastReceiver(BackgroundService bs) {
            this.bs = bs;
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                Log.d(TAG, "Screen off");
            } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                Log.d(TAG, "Screen on");
            } else if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
                Log.d(TAG, "Battery changed");
            } else if (intent.getAction().equals(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)) {
                Log.d(TAG, "Wifi scan results");
                bs.wifiManager.makeCall();
            }
        }
    }

    public class LocalBinder extends Binder {
        public BackgroundService getService() {
            return BackgroundService.this;
        }
    }

    public void speechRecognize(String prompt, String callback) {
        speechCallback = callback;
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, prompt);
        activity.get().startActivityForResult(intent, 1002);
    }

    public ScriptView createScriptView() {
        ScriptView mCallback = new ScriptView(this);
        return mCallback;
    }

    public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(TAG, "Got request code: " + requestCode);
        if (requestCode == 1000) {
            cameraManager.resume();
            if (resultCode == activity.get().RESULT_OK) {
                String pictureFilePath = intent.getStringExtra(Camera.EXTRA_PICTURE_FILE_PATH);
                String thumbnailFilePath = intent.getStringExtra(Camera.EXTRA_THUMBNAIL_FILE_PATH);
                if (photoCallback != null && webview != null) {
                    //pictureFilePath
                    byte imageData[] = null;
                    for (int i = 0; i < 100; i++) {
                        imageData = LoadFile(new File(pictureFilePath));
                        if (imageData == null) {
                            Log.w(TAG, "Waiting for photo...");
                            try {
                                Thread.sleep(250);
                            } catch (InterruptedException e) {
                            }
                        }
                    }
                    String data = String.format("javascript:%s(\"%s\");", photoCallback, Base64.encodeToString(imageData, Base64.NO_WRAP));
                    photoCallback = null;
                    webview.loadUrl(data);
                }
            } else if (resultCode == activity.get().RESULT_CANCELED) {

            }
        } else if (requestCode == 1001) {
            cameraManager.resume();
            if (resultCode == activity.get().RESULT_OK) {
                String thumbnailFilePath = intent.getStringExtra(Camera.EXTRA_THUMBNAIL_FILE_PATH);
                String videoFilePath = intent.getStringExtra(Camera.EXTRA_VIDEO_FILE_PATH);
            } else if (resultCode == activity.get().RESULT_CANCELED) {

            }
        } else if (requestCode == 1002) {
            Log.d(TAG, "Spoken Text Result");
            if (resultCode == activity.get().RESULT_OK) {
                List<String> results = intent.getStringArrayListExtra(
                        RecognizerIntent.EXTRA_RESULTS);
                String spokenText = results.get(0);
                Log.d(TAG, "Spoken Text: " + spokenText);
                if (speechCallback == null)
                    return true;
                // TODO(brandyn): Check speech result for JS injection that can escape out of the quotes
                loadUrl(String.format("javascript:%s(\"%s\");", speechCallback, spokenText));
            } else if (resultCode == activity.get().RESULT_CANCELED) {

            }
        } else {
            return false;
        }
        return true;
    }
}
