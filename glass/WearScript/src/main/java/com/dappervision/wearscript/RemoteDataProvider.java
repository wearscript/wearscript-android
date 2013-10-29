package com.dappervision.wearscript;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;


public class RemoteDataProvider extends DataProvider {
    RemoteDataProvider(final DataManager parent, long samplePeriod, int type, String name) {
        super(parent, samplePeriod, type, name);
    }

    @Override
    public void unregister() {
        super.unregister();
    }
}
