package com.dappervision.wearscript.events;

/**
 * Created by kurt on 12/9/13.
 */
public class SendBlobEvent implements BusEvent {
    private String name, blob;

    public SendBlobEvent(String name, String blob){
        this.name = name;
        this.blob = blob;
    }

    public String getBlob() {
        return blob;
    }

    public String getName() {
        return name;
    }
}
