package com.dappervision.wearscript.jsevents;

public class GestureCallbackEvent extends CallbackJSBusEvent {
    private String event;
    public GestureCallbackEvent(String event, String callback) {
        super(callback);
        this.event = event;
    }

    public String getEvent() {
        return event;
    }
}
