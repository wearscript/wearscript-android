package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class CameraCallbackEvent extends CallbackJSBusEvent {
    private int type;

    public CameraCallbackEvent(int type, String callback) {
        super(callback);
        this.type = type;
    }

    public String getType(){
        return String.format("%i", type);
    }
}
