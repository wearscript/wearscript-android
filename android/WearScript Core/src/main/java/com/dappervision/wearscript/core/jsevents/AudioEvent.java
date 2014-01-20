package com.dappervision.wearscript.core.jsevents;

import com.dappervision.wearscript.core.jsevents.JSBusEvent;

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
