package com.dappervision.wearscript.events;

public class PicarusEvent {
    private byte[] input;
    private byte[] model;
    private String callback;

    public PicarusEvent(byte[] model, byte[] input, String callback) {
        this.input = input;
        this.model = model;
        this.callback = callback;
    }

    public byte[] getInput() {
        return input;
    }

    public byte[] getModel() {
        return model;
    }

    public String getCallback() {
        return callback;
    }

}
