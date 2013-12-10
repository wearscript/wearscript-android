package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
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
