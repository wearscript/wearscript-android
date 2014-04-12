package com.dappervision.wearscript.managers;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.events.JsCall;

import java.util.concurrent.ConcurrentHashMap;

public abstract class Manager {
    protected static final String TAG = "Manager";
    protected BackgroundService service;
    protected ConcurrentHashMap<String, String> jsCallbacks;

    public Manager(BackgroundService service) {
        this.service = service;
    }

    protected void setupCallback(CallbackRegistration e) {
        registerCallback(e.getEvent(), e.getCallback());
    }

    public void onEvent(CallbackRegistration r) {
        if (r.getManager().equals(this.getClass())) {
            setupCallback(r);
        }
    }

    protected void unregisterCallback(String type) {
        jsCallbacks.remove(type);
    }

    protected void registerCallback(String type, String jsFunction) {
        if (jsFunction != null)
            jsCallbacks.put(type, jsFunction);
    }

    protected boolean hasCallback(String type) {
        return jsCallbacks.containsKey(type);
    }

    public void reset() {
        if (!Utils.getEventBus().isRegistered(this))
            Utils.getEventBus().register(this);
        jsCallbacks = new ConcurrentHashMap<String, String>();
    }

    public void shutdown() {
        Utils.getEventBus().unregister(this);
    }

    protected void makeCall(String key, String data) {
        Log.d(TAG, jsCallbacks.toString());
        if (!jsCallbacks.containsKey(key)) {
            Log.d(TAG, "Callback not found: " + key);
            return;
        }
        String url = buildCallbackString(key, data);
        Utils.eventBusPost(new JsCall(url));
    }

    protected void makeCallDirect(String callback, String data) {
        if (callback == null || data == null)
            return;
        String url = String.format("javascript:%s(%s);", callback, data);
        Utils.eventBusPost(new JsCall(url));
    }

    protected String buildCallbackString(String key, String data) {
        if (!jsCallbacks.containsKey(key))
            throw new RuntimeException("No such callback registered");
        return String.format("javascript:%s(%s);", jsCallbacks.get(key), data);
    }
}
