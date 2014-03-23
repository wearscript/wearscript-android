package com.dappervision.wearscript.events;

public class PebbleAccelerometerDataEvent {
    private long timestamp;
    private byte[] accel;

    public PebbleAccelerometerDataEvent(long timstamp, byte[] accel) {
        this.timestamp = timstamp;
        this.accel = accel;
    }

    public PebbleAccelerometerDataEvent(byte[] accel) {
        this.accel = accel;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public byte[] getAccel() {
        return accel;
    }

}
