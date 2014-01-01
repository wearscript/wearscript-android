package com.dappervision.wearscript.jsevents;

public class SoundEvent implements JSBusEvent {
    private String type;

    public SoundEvent(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
