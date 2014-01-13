package com.dappervision.wearscript.dataproviders;

import android.content.Intent;
import android.os.BatteryManager;

import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.managers.DataManager;

public class BatteryDataProvider extends DataProvider {
    private static final String TAG = "BatteryDataProvider";

    public BatteryDataProvider(DataManager dataManager, long samplePeriod) {
        super(dataManager, samplePeriod, WearScript.SENSOR.BATTERY.id(), "battery");
    }

    public void post(Intent intent) {
        int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        if (level >= 0 && scale >= 0) {
            double pct = level / (double) scale;
            Log.i(TAG, "Battery changed: " + pct);
            DataPoint dataPoint = new DataPoint("Battery", -3, System.currentTimeMillis() / 1000., System.nanoTime());
            dataPoint.addValue(pct);
            parent.queue(dataPoint);
        }
    }
}
