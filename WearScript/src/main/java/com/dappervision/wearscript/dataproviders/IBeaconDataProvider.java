package com.dappervision.wearscript.dataproviders;

import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.managers.DataManager;

public class IBeaconDataProvider extends DataProvider {
    public IBeaconDataProvider(DataManager parent, long samplePeriod) {
        super(parent, samplePeriod, WearScript.SENSOR.IBEACON.id(), "IBeacon");
    }
}
