package com.dappervision.wearscript.managers;

import android.content.Context;
import android.hardware.SensorManager;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.dataproviders.BatteryDataProvider;
import com.dappervision.wearscript.dataproviders.DataPoint;
import com.dappervision.wearscript.dataproviders.DataProvider;
import com.dappervision.wearscript.dataproviders.GPSDataProvider;
import com.dappervision.wearscript.dataproviders.NativeDataProvider;
import com.dappervision.wearscript.dataproviders.RemoteDataProvider;
import com.dappervision.wearscript.jsevents.SensorJSEvent;

import java.util.concurrent.ConcurrentHashMap;

public class DataManager extends Manager {
    SensorManager sensorManager;
    ConcurrentHashMap<Integer, DataProvider> providers;
    ConcurrentHashMap<Integer, String> jsCallbacks;

    public DataManager(BackgroundService bs) {
        super(bs);
        this.sensorManager = (SensorManager) bs.getSystemService(Context.SENSOR_SERVICE);
        this.providers = new ConcurrentHashMap<Integer, DataProvider>();
        reset();
    }

    public void onEvent(SensorJSEvent e) {
        if (e.getStatus()) {
            registerProvider(e.getType(), Math.round(e.getSampleTime() * 1000000000L));
            if (e.getCallback() != null) {
                registerCallback(e.getType(), e.getCallback());
            }
        } else {
            unregisterProvider(e.getType());
        }
    }

    public void registerProvider(int type, long samplePeriod) {
        DataProvider dp;
        if (type > 0)
            dp = new NativeDataProvider(this, samplePeriod, sensorManager.getDefaultSensor(type));
        else if (type == WearScript.SENSOR.GPS.id())
            dp = new GPSDataProvider(this, samplePeriod, type);
        else if (type == WearScript.SENSOR.PUPIL.id())
            dp = new RemoteDataProvider(this, samplePeriod, type, "Pupil Eyetracker");
        else if (type == WearScript.SENSOR.BATTERY.id())
            dp = new BatteryDataProvider(this, samplePeriod);
        else
            throw new RuntimeException("Invalid type: " + type);
        registerProvider(type, dp);
    }

    public void registerProvider(Integer type, DataProvider p) {
        providers.put(type, p);
    }


    public void unregisterProvider(Integer type) {
        DataProvider dp = providers.remove(type);
        dp.unregister();
    }

    public void unregisterProviders() {
        for (Integer type : providers.keySet()) {
            unregisterProvider(type);
        }
    }

    public DataProvider getProvider(int id) {
        return providers.get(id);
    }

    public void registerCallback(Integer type, String jsFunction) {
        jsCallbacks.put(type, jsFunction);
    }

    public Context getContext() {
        return service.getApplicationContext();
    }

    public void queue(DataPoint dp) {
        service.handleSensor(dp, buildCallbackString(dp));
    }

    public String buildCallbackString(DataPoint dp) {
        if (dp == null || !jsCallbacks.containsKey(dp.getType()))
            return null;
        return String.format("javascript:%s(%s);", jsCallbacks.get(dp.getType()), dp.toJSONString());
    }

    public void reset() {
        super.reset();
        unregisterProviders();
        jsCallbacks = new ConcurrentHashMap<Integer, String>();
    }

    public void shutdown() {
        super.shutdown();
        unregisterProviders();
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
