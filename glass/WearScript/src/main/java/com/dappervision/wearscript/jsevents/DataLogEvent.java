package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class DataLogEvent implements JSBusEvent {
    private boolean local, server;
    private double sensorDelay;

    public DataLogEvent(boolean local, boolean server, double sensorDelay){
        this.local = local;
        this.server = server;
        this.sensorDelay = sensorDelay;
    }

    public boolean isLocal() {
        return local;
    }

    public boolean isServer() {
        return server;
    }

    public double getSensorDelay() {
        return sensorDelay;
    }
}
