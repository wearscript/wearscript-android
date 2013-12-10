package com.dappervision.wearscript.managers;

import android.content.Context;
import android.hardware.SensorManager;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.jsevents.SensorJSEvent;
import com.dappervision.wearscript.dataproviders.DataPoint;
import com.dappervision.wearscript.dataproviders.DataProvider;
import com.dappervision.wearscript.dataproviders.GPSDataProvider;
import com.dappervision.wearscript.dataproviders.NativeDataProvider;
import com.dappervision.wearscript.dataproviders.RemoteDataProvider;

import java.util.concurrent.ConcurrentHashMap;

public class DataManager extends Manager {
    SensorManager sensorManager;
    ConcurrentHashMap<Integer, DataProvider> providers;
    ConcurrentHashMap<Integer, String> jsCallbacks;

    public DataManager(BackgroundService bs) {
        super(bs);
        this.sensorManager = (SensorManager) bs.getSystemService(Context.SENSOR_SERVICE);
        providers = new ConcurrentHashMap<Integer, DataProvider>();
        jsCallbacks = new ConcurrentHashMap<Integer, String>();
    }

    public void onEvent(SensorJSEvent e){
        if(e.getStatus()){
            registerProvider(e.getType(), Math.round(e.getSampleTime() * 1000000000L));
            if(e.getCallback() != null){
                registerCallback(e.getType(), e.getCallback());
            }
        }else{
            unregister(e.getType());
        }
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
