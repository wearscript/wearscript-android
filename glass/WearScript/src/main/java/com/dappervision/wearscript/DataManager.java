package com.dappervision.wearscript;
import android.hardware.SensorManager;

import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ConcurrentHashMap;

public class DataManager {
    SensorManager sensorManager;
    ConcurrentHashMap<String, DataProvider> providers;
    ConcurrentHashMap<String, String> jsCallbacks;
    ConcurrentLinkedQueue<DataPoint> data;

    DataManager(SensorManager sensorManager){
        this.sensorManager = sensorManager;
        providers = new ConcurrentHashMap<String, DataProvider>();
        jsCallbacks = new ConcurrentHashMap<String, String>();
        data = new ConcurrentLinkedQueue<DataPoint>();
    }

    public void registerProvider(int type){
        DataProvider dp = new DataProvider(this, sensorManager.getDefaultSensor(type));
        registerProvider(dp.sensor().getName(), dp);
    }

    public void registerProvider(String name, DataProvider p){
        providers.put(name, p);
    }

    public void registerCallback(String name, String jsFunction){
        jsCallbacks.put(name, jsFunction);
    }

    public DataPoint getData(String name){
        return providers.get(name).latest();
    }

    /**
     * To be called from a DataProvider
     * @param dp
     */
    public void queue(DataPoint dp){
        data.add(dp);
    }

    public DataPoint poll() {
        return data.poll();
    }

    public String buildCallbackString(String name, DataPoint dp){
        return String.format("javascript:%s(%s);", jsCallbacks.get(name), dp);
    }

    public void unregister() {
        for(String name : providers.keySet()){
            unregister(name);
        }
    }

    public void unregister(String name) {
        DataProvider dp = providers.remove(name);
        dp.unregister();
    }

    public SensorManager sensorManager() {
        return sensorManager;
    }
}
