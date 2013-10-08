package com.dappervision.wearscript;

import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.Sensor;
import android.hardware.SensorManager;

public class DataProvider implements SensorEventListener{
    private Sensor sensor;
    private DataManager parent;
    private DataPoint latest;

    DataProvider(DataManager parent, Sensor androidSensor){
        this.sensor = androidSensor;
        this.parent = parent;
        parent.sensorManager().registerListener(this, androidSensor, SensorManager.SENSOR_DELAY_GAME);
    }

    public DataPoint latest(){
        return latest;
    }

    public Sensor sensor(){
        return sensor;
    }

    public void unregister(){
        parent.sensorManager().unregisterListener(this);
        this.sensor = null;
        this.latest = null;
        this.parent = null;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        DataPoint dataPoint = new DataPoint(this);
        for(int i = 0; i < event.values.length; i++) {
            dataPoint.addValue(new Float(event.values[i]));
        }
        this.latest = dataPoint;
        parent.queue(dataPoint);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }
}
