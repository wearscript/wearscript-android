package com.dappervision.wearscript.core;

import android.app.Service;
import android.speech.tts.TextToSpeech;

import java.util.Locale;

public abstract class ScriptService extends Service implements SocketClient.SocketListener, TextToSpeech.OnInitListener {
    private static final String TAG = "ScriptService";
    private ScriptActivity scriptActivity;

    protected SocketClient client;
    public ScriptView webview;
    public String wsUrl;

    protected TextToSpeech tts;

    @Override
    public void onCreate() {
        super.onCreate();
        Utils.getEventBus().register(this);
        tts = new TextToSpeech(this, this);
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "Lifecycle: Service onDestroy");
        shutdown();
        super.onDestroy();
    }

    public void shutdown(){
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        Utils.getEventBus().unregister(this);
    }

    public void setScriptActivity(ScriptActivity activity){
        Log.i(TAG, "Lifecycle: BackgroundService: setScriptActivity");
        if(scriptActivity != null)
            scriptActivity.finish();
        scriptActivity = activity;
    }

    protected ScriptActivity getScriptActivity(){
        return scriptActivity;
    }

    public void runScript(String script) {
        String path = Utils.SaveData(script.getBytes(), "scripting/", false, "script.html");
        runScriptUrl("file://" + path);
    }

    public void resetDefaultUrl() {
        byte[] wsUrlArray = Utils.LoadData("", "qr.txt");
        if (wsUrlArray == null) {
            say("Must setup wear script");
            return;
        }
        wsUrl = (new String(wsUrlArray)).trim();
    }

    public void say(String text) {
        if (tts == null)
            return;
        if (!tts.isSpeaking())
            tts.speak(text, TextToSpeech.QUEUE_FLUSH,
                    null);
    }

    public void sayInterrupt(String text) {
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            int result = tts.setLanguage(Locale.US);
            // TODO: Check result
        }
        // TODO: Check result on else
    }

    public abstract void runScriptUrl(String url);
    public abstract void runDefaultScript();

    public abstract void removeAllViews();

    public abstract void refreshActivityView();

    public abstract void onPause();

    public abstract void onResume();

    public abstract void reset();

    public void runOnUiThread(Thread thread) {
        if(scriptActivity == null)
            return;
        scriptActivity.runOnUiThread(thread);
    }
}
