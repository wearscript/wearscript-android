package com.dappervision.wearscript.dataproviders;

import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.managers.DataManager;

public class BTLEDataProvider extends DataProvider {
    public BTLEDataProvider(DataManager parent, long samplePeriod) {
        super(parent, samplePeriod, WearScript.SENSOR.BTLE.id(), "btle");
    }
}
