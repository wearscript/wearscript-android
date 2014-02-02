package com.dappervision.wearscript;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioRecord;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.view.View;
import android.view.ViewGroup;

import com.dappervision.wearscript.ui.ScriptActivity;
import com.dappervision.wearscript.dataproviders.BatteryDataProvider;
import com.dappervision.wearscript.dataproviders.DataPoint;
import com.dappervision.wearscript.events.JsCall;
import com.dappervision.wearscript.events.LambdaEvent;
import com.dappervision.wearscript.events.ScriptEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.ShutdownEvent;
import com.dappervision.wearscript.jsevents.ActivityEvent;
import com.dappervision.wearscript.jsevents.CameraEvents;
import com.dappervision.wearscript.jsevents.CardTreeEvent;
import com.dappervision.wearscript.jsevents.DataLogEvent;
import com.dappervision.wearscript.jsevents.PicarusEvent;
import com.dappervision.wearscript.jsevents.SayEvent;
import com.dappervision.wearscript.jsevents.ScreenEvent;
import com.dappervision.wearscript.jsevents.WifiScanResultsEvent;
import com.dappervision.wearscript.managers.CameraManager;
import com.dappervision.wearscript.managers.ConnectionManager;
import com.dappervision.wearscript.managers.DataManager;
import com.dappervision.wearscript.managers.GestureManager;
import com.dappervision.wearscript.managers.Manager;
import com.dappervision.wearscript.managers.ManagerManager;
import com.dappervision.wearscript.managers.OpenGLManager;
import com.dappervision.wearscript.managers.PicarusManager;
import com.dappervision.wearscript.managers.WifiManager;
import com.google.android.glass.widget.CardScrollView;
import com.kelsonprime.cardtree.Level;
import com.kelsonprime.cardtree.Node;
import com.kelsonprime.cardtree.Tree;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.msgpack.MessagePack;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;
import java.util.TreeMap;

public class BackgroundService extends Service implements AudioRecord.OnRecordPositionUpdateListener, OnInitListener {
    protected static String TAG = "WearScript";
    private final IBinder mBinder = new LocalBinder();
    private final Object lock = new Object(); // All calls to webview client must acquire lock
    public ScriptActivity activity;
    public boolean dataRemote, dataLocal, dataWifi;
    public double lastSensorSaveTime, sensorDelay;
    public ScriptView webview;
    public TreeMap<String, ArrayList<Value>> sensorBuffer;
    public TreeMap<String, Integer> sensorTypes;
    public String wifiScanCallback;
    protected TextToSpeech tts;
    protected ScreenBroadcastReceiver broadcastReceiver;
    protected String glassID;
    protected ScriptCardScrollAdapter cardScrollAdapter;
    protected CardScrollView cardScroller;
    MessagePack msgpack = new MessagePack();
    private View activityView;
    private Tree cardTree;
    private String activityMode;

    static public String getDefaultUrl() {
        byte[] wsUrlArray = Utils.LoadData("", "qr.txt");
        if (wsUrlArray == null) {
            Utils.eventBusPost(new SayEvent("Must setup wear script", false));
            return "";
        }
        return (new String(wsUrlArray)).trim();
    }

    public void updateActivityView(final String mode) {
        if (activity == null)
            return;
        final ScriptActivity a = activity;
        a.runOnUiThread(new Thread() {
            public void run() {
                activityMode = mode;
                if (mode.equals("webview") && webview != null) {
                    activityView = webview;
                } else if (mode.equals("cardscroll")) {
                    activityView = cardScroller;
                } else if (mode.equals("opengl")) {
                    activityView = ((OpenGLManager) getManager(OpenGLManager.class)).getView();
                } else if (mode.equals("cardtree")) {
                    activityView = cardTree;
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
                //webview.loadUrl(url);
                Utils.eventBusPost(new JsCall(url));
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
        ConnectionManager cm = (ConnectionManager) getManager(ConnectionManager.class);
        ArrayList<Value> output = new ArrayList<Value>();
        String channel = cm.subchannel(ConnectionManager.SENSORS_SUBCHAN);
        output.add(ValueFactory.createRawValue(channel));
        sensorBuffer = new TreeMap<String, ArrayList<Value>>();
        if (!(dataRemote && cm.exists(channel)) && !dataLocal)
            return;

        ArrayList<Value> sensorTypes = new ArrayList<Value>();
        for (String k : this.sensorTypes.navigableKeySet()) {
            sensorTypes.add(ValueFactory.createRawValue(k));
            sensorTypes.add(ValueFactory.createIntegerValue(this.sensorTypes.get(k)));
        }
        output.add(ValueFactory.createMapValue(sensorTypes.toArray(new Value[sensorTypes.size()])));

        ArrayList<Value> sensors = new ArrayList<Value>();
        for (String k : curSensorBuffer.navigableKeySet()) {
            sensors.add(ValueFactory.createRawValue(k));
            sensors.add(ValueFactory.createArrayValue(curSensorBuffer.get(k).toArray(new Value[curSensorBuffer.get(k).size()])));
        }
        output.add(ValueFactory.createMapValue(sensors.toArray(new Value[sensors.size()])));

        final byte[] dataStr;
        try {
            dataStr = msgpack.write(output);
        } catch (IOException e) {
            Log.e(TAG, "Couldn't serialize msgpack");
            e.printStackTrace();
            return;
        }
        if (dataRemote && cm.exists(channel))
            Utils.eventBusPost(new SendEvent(channel, dataStr));
        if (dataLocal)
            Utils.SaveData(dataStr, "data/", true, ".msgpack");
    }

    public void onEventAsync(CameraEvents.Frame frameEvent) {
        try {
            final CameraManager.CameraFrame frame = frameEvent.getCameraFrame();
            // TODO(brandyn): Move this timing logic into the camera manager
            Log.d(TAG, "handeImage Thread: " + Thread.currentThread().getName());
            byte[] frameJPEG = null;
            if (dataLocal) {
                frameJPEG = frame.getJPEG();
                // TODO(brandyn): We can improve timestamp precision by capturing it pre-encoding
                Utils.SaveData(frameJPEG, "data/", true, ".jpg");
            }
            ConnectionManager cm = (ConnectionManager) getManager(ConnectionManager.class);
            String channel = cm.subchannel(ConnectionManager.IMAGE_SUBCHAN);
            if (dataRemote && cm.exists(channel)) {
                if (frameJPEG == null)
                    frameJPEG = frame.getJPEG();
                Utils.eventBusPost(new SendEvent(channel, System.currentTimeMillis() / 1000., ValueFactory.createRawValue(frameJPEG)));
            }
        } finally {
            frameEvent.done();
        }
    }

    public void shutdown() {
        synchronized (lock) {
            reset();
            if (broadcastReceiver != null) {
                unregisterReceiver(broadcastReceiver);
                broadcastReceiver = null;
            }
            if (tts != null) {
                tts.stop();
                tts.shutdown();
            }
            Utils.getEventBus().unregister(this);
            ManagerManager.get().shutdownAll();

            if (activity == null)
                return;
            final ScriptActivity a = activity;
            a.runOnUiThread(new Thread() {
                public void run() {
                    Log.d(TAG, "Lifecycle: Stop self activity");
                    a.bs.stopSelf();
                    a.bs.activity = null;
                    a.bs = null;
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
            dataWifi = dataRemote = dataLocal = false;
            lastSensorSaveTime = sensorDelay = 0.;
            if (cardScrollAdapter != null)
                cardScrollAdapter.reset();
            updateCardScrollView();

            ManagerManager.get().resetAll();
            // TODO(brandyn): Verify that if we create a new activity that the gestures still work
            if (HardwareDetector.isGlass && ManagerManager.get().get(GestureManager.class) == null) {
                if (activity != null) {
                    ScriptActivity a = activity;
                    ManagerManager.get().add(new GestureManager(a, this));
                }
            }
            updateActivityView("webview");
        }
    }

    public void startDefaultScript() {
        byte[] data = "<body style='width:640px; height:480px; overflow:hidden; margin:0' bgcolor='black'><center><h1 style='font-size:70px;color:#FAFAFA;font-family:monospace'>WearScript</h1><h1 style='font-size:40px;color:#FAFAFA;font-family:monospace'>When connected use playground to control<br><br>Docs @ wearscript.com</h1></center><script>function s() {WS.say('Connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script></body>".getBytes();
        String path = Utils.SaveData(data, "scripting/", false, "glass.html");
        Utils.eventBusPost(new ScriptEvent(path));
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


    public void updateCardScrollView() {
        if (activity == null || cardScroller == null)
            return;
        final ScriptActivity a = activity;
        a.runOnUiThread(new Thread() {
            public void run() {
                cardScroller.updateViews(true);
            }
        });
    }

    public void onEventMainThread(ScriptEvent e) {
        reset();
        synchronized (lock) {
            webview = createScriptView();
            updateActivityView("webview");
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new WearScript(this), "WS");
            webview.setInitialScale(100);
            Log.i(TAG, "WebView: " + e.getScriptPath());
            webview.loadUrl("file://" + e.getScriptPath());
            Log.i(TAG, "WebView Ran");
        }
    }

    public void onEventMainThread(LambdaEvent e) {
        synchronized (lock) {
            webview.loadUrl("javascript:" + e.getCommand());
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
        Utils.getEventBus().register(this);

        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_SCREEN_OFF);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_BATTERY_CHANGED);
        intentFilter.addAction(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
        broadcastReceiver = new ScreenBroadcastReceiver(this);
        registerReceiver(broadcastReceiver, intentFilter);

        //Plugin new Managers here
        ManagerManager.get().newManagers(this);

        tts = new TextToSpeech(this, this);

        glassID = ((WifiManager) getManager(WifiManager.class)).getMacAddress();

        if (HardwareDetector.isGlass) {
            cardScrollAdapter = new ScriptCardScrollAdapter(BackgroundService.this);
            cardScroller = new CardScrollView(this);
            cardScroller.setAdapter(cardScrollAdapter);
            cardScroller.activate();
            cardScroller.setOnItemSelectedListener(cardScrollAdapter);
            cardScroller.setOnItemClickListener(cardScrollAdapter);
        }

        reset();
    }

    public Level cardArrayToLevel(JSONArray array, Level level, Tree tree) {
        for (Object o : array) {
            JSONObject cardJS = (JSONObject) o;
            JSONArray children = (JSONArray) cardJS.get("children");
            if (children != null) {
                level.add(new Node(cardScrollAdapter.cardFactory((JSONObject) cardJS.get("card")), cardArrayToLevel(children, new Level(tree), tree)));
            } else {
                level.add(new Node(cardScrollAdapter.cardFactory((JSONObject) cardJS.get("card"))));
            }
        }
        return level;
    }

    public void onEventMainThread(CardTreeEvent e) {
        // TODO(brandyn): This is a temporary solution, fix it
        cardTree = new Tree(this.activity);
        refreshActivityView();
        JSONArray cardArray = (JSONArray) JSONValue.parse(e.getTreeJS());
        cardArrayToLevel(cardArray, cardTree.getRoot(), cardTree);
        cardTree.showRoot();
    }

    public void setMainActivity(ScriptActivity a) {
        Log.i(TAG, "Lifecycle: BackgroundService: setMainActivity");
        if (this.activity != null) {
            activity.finish();
        }
        this.activity = a;
        if (cardTree == null && HardwareDetector.isGlass)
            cardTree = new Tree(a);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "Service onStartCommand");
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "Lifecycle: Service onDestroy");
        shutdown();
        super.onDestroy();
    }

    public void onEventMainThread(JsCall e) {
        loadUrl(e.getCall());
    }

    public void onEvent(SayEvent e) {
        say(e.getMsg(), e.getInterrupt());
    }

    public void onEvent(ActivityEvent e) {
        // TODO(brandyn): Change these strings to use the modes
        if (e.getMode() == ActivityEvent.Mode.CREATE) {
            Intent i = new Intent(this, ScriptActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } else if (e.getMode() == ActivityEvent.Mode.DESTROY) {
            activity.finish();
        } else if (e.getMode() == ActivityEvent.Mode.WEBVIEW) {
            updateActivityView("webview");
        } else if (e.getMode() == ActivityEvent.Mode.OPENGL) {
            updateActivityView("opengl");
        } else if (e.getMode() == ActivityEvent.Mode.CARD_TREE) {
            updateActivityView("cardtree");
        } else if (e.getMode() == ActivityEvent.Mode.CARD_SCROLL) {
            updateActivityView("cardscroll");
        }
    }

    public void onEvent(DataLogEvent e) {
        dataRemote = e.isServer();
        dataLocal = e.isLocal();
        sensorDelay = e.getSensorDelay() * 1000000000L;
    }

    public void onEvent(PicarusEvent e) {
        // TODO(brandyn): Needs to be fixed
        ManagerManager.get().add(new PicarusManager(this));
    }

    public void onEvent(ScreenEvent e) {
        wake();
    }

    public void onEvent(ShutdownEvent e) {
        shutdown();
    }

    @Override
    public void onMarkerReached(AudioRecord arg0) {
        Log.i(TAG, "Audio mark");
    }

    @Override
    public void onPeriodicNotification(AudioRecord arg0) {
        Log.i(TAG, "Audio period");
    }

    public void say(String text, boolean interrupt) {
        if (tts == null)
            return;
        if (!tts.isSpeaking() || interrupt)
            tts.speak(text, TextToSpeech.QUEUE_ADD,
                    null);
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            Utils.setupTTS(this, tts);
        } else {
            Log.w(TAG, "TTS initialization failed: " + status);
        }
    }

    public Manager getManager(Class<? extends Manager> cls) {
        return ManagerManager.get().get(cls);
    }

    public ScriptView createScriptView() {
        ScriptView mCallback = new ScriptView(this);
        return mCallback;
    }

    class ScreenBroadcastReceiver extends BroadcastReceiver {
        BackgroundService bs;

        public ScreenBroadcastReceiver(BackgroundService bs) {
            this.bs = bs;
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            //TODO: Move recievers into managers when possible
            if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                Log.d(TAG, "Screen off");
            } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                Log.d(TAG, "Screen on");
            } else if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
                BatteryDataProvider dp = (BatteryDataProvider) ((DataManager) bs.getManager(DataManager.class)).getProvider(WearScript.SENSOR.BATTERY.id());
                if (dp != null)
                    dp.post(intent);
            } else if (intent.getAction().equals(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)) {
                Log.d(TAG, "Wifi scan results");
                Utils.eventBusPost(new WifiScanResultsEvent());
            }
        }
    }

    public class LocalBinder extends Binder {
        public BackgroundService getService() {
            return BackgroundService.this;
        }
    }
}
