package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class BarcodeCallbackEvent extends CallbackJSBusEvent {
    private String type;
    public BarcodeCallbackEvent(String type, String callback) {
        super(callback);
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
