package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class CameraEvent implements JSBusEvent {
    private double period;
    public CameraEvent(double period){
        this.period = period;
    }
    public double getPeriod(){
        return period;
    }
}
