package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class ScreenEvent implements JSBusEvent {
    private boolean on;

    public ScreenEvent(boolean on){
        this.on = on;
    }

    public boolean isOn() {
        return on;
    }
}
