package com.dappervision.wearscript.dataproviders;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.dappervision.wearscript.managers.DataManager;

public class NativeDataProvider extends DataProvider implements SensorEventListener {
    private Sensor sensor;

    public NativeDataProvider(DataManager parent, long samplePeriod, Sensor sensor) {
        super(parent, samplePeriod, sensor.getType(), sensor.getName());
        this.sensor = sensor;
        // TODO(brandyn): We should base the sensor sample on the Type and selected sampling rate (requires calibration)
        parent.sensorManager().registerListener(this, sensor, SensorManager.SENSOR_DELAY_GAME);
    }

    public void unregister() {
        parent.sensorManager().unregisterListener(this);
        this.sensor = null;
        super.unregister();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (!useSample(event.timestamp))
            return;
        // TODO(brandyn): Compensate for light sensor and offset here
        DataPoint dataPoint = new DataPoint(this, System.currentTimeMillis() / 1000., event.timestamp);
        for (int i = 0; i < event.values.length; i++) {
            dataPoint.addValue(Double.valueOf(event.values[i]));
        }
        // NOTE(brandyn): This prevents a race condition but doesn't completely eliminate it, look into further
        if (parent != null)
            parent.queue(dataPoint);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {
    }
}
