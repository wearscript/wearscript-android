package com.dappervision.wearscript.events;

public class WarpSetupHomographyEvent {
    String h;

    public WarpSetupHomographyEvent(String h) {
        this.h = h;
    }

    public String getHomography() {
        return h;
    }
}
