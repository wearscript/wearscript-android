package com.dappervision.wearscript.events;

public class PicarusModelCreateEvent {
    private final int id;
    private final String callback;
    private byte[] model;

    public PicarusModelCreateEvent(byte[] model, int id, String callback) {
        this.model = model;
        this.id = id;
        this.callback = callback;
    }

    public byte[] getModel() {
        return model;
    }

    public int getId() {
        return id;
    }

    public String getCallback() {
        return callback;
    }

}
