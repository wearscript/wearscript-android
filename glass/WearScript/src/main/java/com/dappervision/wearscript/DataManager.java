package com.dappervision.wearscript;

import android.content.Context;
import android.content.Intent;
import android.hardware.SensorManager;
import android.net.wifi.WifiManager;
import android.os.BatteryManager;
import android.util.Log;

import org.msgpack.type.Value;

import java.util.concurrent.ConcurrentHashMap;

public class DataManager {
    private static final String TAG = "DataManager";
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
        else if (type == -3)
            dp = new RemoteDataProvider(this, samplePeriod, type, "Battery");
        else
            throw new RuntimeException("Invalid type: " + type);
        registerProvider(type, dp);
    }

    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
            Log.i(TAG, "Screen off");
        } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
            Log.i(TAG, "Screen on");
        } else if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
            Log.i(TAG, "Battery changed");
            // NOTE(brandyn): This is a little funny since it's on the device, but we are creating the data
            // point "remotely" so we treat it as such, it's not worth a new class and pushing the intent around
            int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            if (level >= 0 && scale >= 0) {
                double pct = level / (double)scale;
                Log.i(TAG, "Battery changed: " + pct);
                DataPoint dataPoint = new DataPoint("Battery", -3, System.currentTimeMillis() / 1000., System.nanoTime());
                dataPoint.addValue(pct);
                queueRemote(dataPoint);
            }
        }
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
