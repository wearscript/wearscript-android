package com.dappervision.wearscript.jsevents;

public class SensorJSEvent implements JSBusEvent {
    private String callback;
    private double sampleTime;
    private boolean status;
    private int type;

    public SensorJSEvent(int type, boolean status) {
        this.type = type;
        this.status = status;
    }

    public SensorJSEvent(int type, boolean status, double sampleTime, String callback) {
        this.type = type;
        this.sampleTime = sampleTime;
        this.status = status;
        this.callback = callback;
    }

    public int getType() {
        return type;
    }

    public double getSampleTime() {
        return sampleTime;
    }

    public String getCallback() {
        return callback;
    }

    public boolean getStatus() {
        return status;
    }
}
