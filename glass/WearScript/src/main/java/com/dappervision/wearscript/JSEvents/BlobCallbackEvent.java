package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class BlobCallbackEvent extends CallbackJSBusEvent {
    private String name;

    public BlobCallbackEvent(String name, String callback) {
        super(callback);
        this.name = name;
    }

    public String getName(){
        return name;
    }
}
