package com.dappervision.wearscript.jsevents;

public class AudioEvent implements JSBusEvent {
    private final boolean start;

    public AudioEvent(boolean start) {
        this.start = start;
    }

    public boolean isStart() {
        return start == true;
    }

    public boolean isStop() {
        return start != true;
    }
}
