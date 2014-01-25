package com.dappervision.wearscript.dataproviders;

import com.dappervision.wearscript.managers.DataManager;

public abstract class DataProvider {
    protected DataManager parent;
    private long lastTimestamp;
    protected long samplePeriod;
    private int type;
    private String name;

    DataProvider(DataManager parent, long samplePeriod, int type, String name) {
        this.parent = parent;
        this.samplePeriod = samplePeriod;
        this.type = type;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public int getType() {
        return type;
    }

    public void unregister() {
        this.parent = null;
    }

    public void remoteSample(DataPoint dp) {
        if (!useSample(dp.timestampRaw))
            return;
        parent.queue(dp);
    }

    protected boolean useSample(long timestamp) {
        if (timestamp - lastTimestamp < samplePeriod)
            return false;
        lastTimestamp = timestamp;
        return true;
    }
}
