package com.dappervision.wearscript.events;

public class LiveCardMenuSelectedEvent {
    private int position;

    public LiveCardMenuSelectedEvent(int position) {
        this.position = position;
    }

    public int getPosition() {
        return position;
    }
}
