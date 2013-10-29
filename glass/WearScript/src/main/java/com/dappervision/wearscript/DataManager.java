package com.dappervision.wearscript;

import android.content.Context;
import android.hardware.SensorManager;

import java.util.concurrent.ConcurrentHashMap;

public class DataManager {
    SensorManager sensorManager;
    ConcurrentHashMap<Integer, DataProvider> providers;
    ConcurrentHashMap<Integer, String> jsCallbacks;
    BackgroundService bs;

    DataManager(SensorManager sensorManager, BackgroundService bs) {
        this.sensorManager = sensorManager;
        this.bs = bs;
        providers = new ConcurrentHashMap<Integer, DataProvider>();
        jsCallbacks = new ConcurrentHashMap<Integer, String>();
    }

    public void registerProvider(int type, long samplePeriod) {
        DataProvider dp;
        if (type > 0)
            dp = new NativeDataProvider(this, samplePeriod, sensorManager.getDefaultSensor(type));
        else if (type == -1)
            dp = new GPSDataProvider(this, samplePeriod, type);
        else if (type == -2)
            dp = new RemoteDataProvider(this, samplePeriod, type, "Pupil Eyetracker");
        else
            throw new RuntimeException("Invalid type: " + type);
        registerProvider(type, dp);
    }

    public void registerProvider(Integer type, DataProvider p) {
        providers.put(type, p);
    }

    public void registerCallback(Integer type, String jsFunction) {
        jsCallbacks.put(type, jsFunction);
    }

    public Context getContext() {
        return bs.getApplicationContext();
    }

    public void queue(DataPoint dp) {
        bs.handleSensor(dp, buildCallbackString(dp));
    }

    public String buildCallbackString(DataPoint dp) {
        if (dp == null || !jsCallbacks.containsKey(dp.getType()))
            return null;
        return String.format("javascript:%s(%s);", jsCallbacks.get(dp.getType()), dp.toJSONString());
    }

    public void unregister() {
        for (Integer type : providers.keySet()) {
            unregister(type);
        }
    }

    public void unregister(Integer type) {
        DataProvider dp = providers.remove(type);
        dp.unregister();
    }

    public SensorManager sensorManager() {
        return sensorManager;
    }

    public void queueRemote(DataPoint dp) {
        DataProvider provider = providers.get(dp.getType());
        if (provider == null)
            return;
        provider.remoteSample(dp);
    }
}
