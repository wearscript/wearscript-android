package com.dappervision.wearscript.events;

public class PicarusModelProcessWarpEvent {
    private final int id;

    public PicarusModelProcessWarpEvent(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
