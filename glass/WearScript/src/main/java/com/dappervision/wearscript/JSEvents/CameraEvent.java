package com.dappervision.wearscript.jsevents;

public class CameraEvent implements JSBusEvent {
    private double period;
    public CameraEvent(double period){
        this.period = period;
    }
    public double getPeriod(){
        return period;
    }
}
