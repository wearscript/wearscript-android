package com.dappervision.wearscript.events;

public class PicarusStreamEvent {
    private byte[] model;
    private String callback;

    public PicarusStreamEvent(byte[] model, String callback) {
        this.model = model;
        this.callback = callback;
    }

    public byte[] getModel() {
        return model;
    }

    public String getCallback() {
        return callback;
    }

}
