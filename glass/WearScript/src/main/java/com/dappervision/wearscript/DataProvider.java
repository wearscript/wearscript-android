package com.dappervision.wearscript;

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

    protected boolean useSample(long timestamp) {
        if (timestamp - lastTimestamp < samplePeriod)
            return false;
        lastTimestamp = timestamp;
        return true;
    }
}
