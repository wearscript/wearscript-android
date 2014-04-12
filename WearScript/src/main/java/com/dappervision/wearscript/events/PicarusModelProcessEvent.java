package com.dappervision.wearscript.events;

public class PicarusModelProcessEvent {
    private final int id;
    private final String callback;
    private byte[] input;

    public PicarusModelProcessEvent(int id, byte[] input, String callback) {
        this.input = input;
        this.id = id;
        this.callback = callback;
    }

    public byte[] getInput() {
        return input;
    }

    public int getId() {
        return id;
    }

    public String getCallback() {
        return callback;
    }

}
