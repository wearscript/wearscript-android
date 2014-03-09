package com.dappervision.wearscript.events;

public class ScreenEvent {
    private boolean on;

    public ScreenEvent(boolean on) {
        this.on = on;
    }

    public boolean isOn() {
        return on;
    }
}
