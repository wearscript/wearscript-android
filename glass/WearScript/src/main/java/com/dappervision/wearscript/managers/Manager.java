package com.dappervision.wearscript.managers;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.events.JsCall;
import com.dappervision.wearscript.jsevents.CallbackRegistration;

import java.util.concurrent.ConcurrentHashMap;

import de.greenrobot.event.EventBus;

/**
 * Created by kurt on 12/9/13.
 */
public abstract class Manager {
    protected static final String TAG = "Manager";
    protected BackgroundService service;
    protected ConcurrentHashMap<String, String> jsCallbacks;

    public Manager(BackgroundService service){
        this.service = service;
        EventBus.getDefault().register(this);
        jsCallbacks = new ConcurrentHashMap<String, String>();
    }

    protected void setupCallback(CallbackRegistration e){
        registerCallback(e.getEvent(), e.getCallback());
    }

    public void onEvent(CallbackRegistration r){
        if(r.getManager().equals(this.getClass())){
            setupCallback(r);
        }
    }

    protected void registerCallback(String type, String jsFunction) {
        jsCallbacks.put(type, jsFunction);
    }

    public void unregister() {
        jsCallbacks = new ConcurrentHashMap<String, String>();
    }

    protected void makeCall(String key, String data) {
        Log.d(TAG, key + " " + data);
        if (!jsCallbacks.contains(key))
            return;
        String url = buildCallbackString(key, data);
        Log.d(TAG, "Gesture: Call: " + url);
        EventBus.getDefault().post(new JsCall(url));
    }

    protected String buildCallbackString(String key, String data){
        if (!jsCallbacks.contains(key))
            throw new RuntimeException("No such callback registered");
        return String.format("javascript:%s(%s);", jsCallbacks.get(key), data);
    }
}
