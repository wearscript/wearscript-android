package com.dappervision.wearscript.dataproviders;

import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.managers.DataManager;

public class PebbleDataProvider extends DataProvider {

    public PebbleDataProvider(DataManager dataManager, long samplePeriod){
        super(dataManager, samplePeriod, WearScript.SENSOR.PEBBLE_ACCELEROMETER.id(), "pebbleAccel");
    }

}
