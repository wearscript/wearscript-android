package com.dappervision.wearscript.core.jsevents;

public class WifiEvent implements JSBusEvent {
    private boolean status;

    public WifiEvent(boolean status) {
        this.status = status;
    }

    public boolean getStatus() {
        return status;
    }
}
