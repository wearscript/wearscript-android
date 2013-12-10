package com.dappervision.wearscript.jsevents;

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
