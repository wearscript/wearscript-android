package com.dappervision.wearscript.dataproviders;

import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.events.PebbleAccelerometerDataEvent;
import com.dappervision.wearscript.managers.DataManager;

public class PebbleDataProvider extends DataProvider {
    private static final String TAG = "PebbleDataProvider";

    public PebbleDataProvider(DataManager dataManager, long samplePeriod){
        super(dataManager, samplePeriod, WearScript.SENSOR.PEBBLE_ACCELEROMETER.id(), "Pebble");
    }

    @Override
    public void unregister() {
        super.unregister();
    }

    public void onEvent(PebbleAccelerometerDataEvent e) {
        if(getType() == WearScript.SENSOR.PEBBLE_ACCELEROMETER.id()) {
            DataPoint dataPoint = new DataPoint(this, System.currentTimeMillis() / 1000., e.getTimestamp());
            byte[] accel = e.getAccel();
            dataPoint.addValue(Double.valueOf(accel[0]));
            dataPoint.addValue(Double.valueOf(accel[1]));
            dataPoint.addValue(Double.valueOf(accel[2]));
            parent.queue(dataPoint);
        }
    }

}
