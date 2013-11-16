package com.dappervision.wearscript;

import android.util.Log;

import com.google.android.glass.touchpad.Gesture;
import com.google.android.glass.touchpad.GestureDetector;

import java.util.concurrent.ConcurrentHashMap;

public class GestureManager extends GestureDetector implements GestureDetector.BaseListener, GestureDetector.FingerListener, GestureDetector.ScrollListener, GestureDetector.TwoFingerScrollListener, GestureDetector.VerticalScrollListener {
    private static final String TAG = "GestureManager";
    ConcurrentHashMap<String, String> jsCallbacks;
    private BackgroundService bs;

    GestureManager(MainActivity activity, BackgroundService bs) {
        super(activity);
        this.bs = bs;
        setBaseListener(this);
        setFingerListener(this);
        setScrollListener(this);
        setTwoFingerScrollListener(this);
        jsCallbacks = new ConcurrentHashMap<String, String>();
    }

    public void registerCallback(String type, String jsFunction) {
        jsCallbacks.put(type, jsFunction);
    }

    public void unregister() {
        jsCallbacks = new ConcurrentHashMap<String, String>();
    }

    protected void makeCall(String key, String data) {
        Log.i(TAG, key + " " + data);
        if (!jsCallbacks.contains(key))
            return;
        String url = String.format("javascript:%s(%s);", jsCallbacks.get(key), data);
        Log.i(TAG, "Gesture: Call: " + url);
        bs.loadUrl(url);
    }

    @Override
    public boolean onGesture(Gesture gesture) {
        makeCall("onGesture", String.format("'%s'", gesture.name()));
        return false;
    }

    @Override
    public void onFingerCountChanged(int i, int i2) {
        makeCall("onFingerCountChanged", String.format("%d, %d", i, i2));
    }

    @Override
    public boolean onScroll(float v, float v2, float v3) {
        makeCall("onScroll", String.format("%f, %f, %f", v, v2, v3));
        return false;
    }

    @Override
    public boolean onTwoFingerScroll(float v, float v2, float v3) {
        makeCall("onTwoFingerScroll", String.format("%f, %f, %f", v, v2, v3));
        return false;
    }

    @Override
    public boolean onVerticalScroll(float v, float v2, float v3) {
        makeCall("onVerticalScroll", String.format("%f, %f, %f", v, v2, v3));
        return false;
    }
}