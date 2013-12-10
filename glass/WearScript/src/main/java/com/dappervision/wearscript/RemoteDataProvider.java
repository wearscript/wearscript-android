package com.dappervision.wearscript;

import com.dappervision.wearscript.managers.DataManager;


public class RemoteDataProvider extends DataProvider {
    public RemoteDataProvider(final DataManager parent, long samplePeriod, int type, String name) {
        super(parent, samplePeriod, type, name);
    }

    @Override
    public void unregister() {
        super.unregister();
    }
}
