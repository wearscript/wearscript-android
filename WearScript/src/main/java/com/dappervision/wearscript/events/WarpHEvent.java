package com.dappervision.wearscript.events;

public class WarpHEvent implements BusEvent {
    double [] h;

    public WarpHEvent(double[] h) {
        this.h = h;
    }

    public double[] getH() {
        return h;
    }
}
