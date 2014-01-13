package com.dappervision.wearscript.jsevents;

public class ScreenEvent implements JSBusEvent {
    private boolean on;

    public ScreenEvent(boolean on) {
        this.on = on;
    }

    public boolean isOn() {
        return on;
    }
}
