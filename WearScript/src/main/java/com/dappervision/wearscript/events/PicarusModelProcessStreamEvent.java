package com.dappervision.wearscript.events;

public class PicarusModelProcessStreamEvent {
    private final int id;

    public PicarusModelProcessStreamEvent(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
