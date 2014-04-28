package com.dappervision.wearscript.events;

public class MediaActionEvent {

    private final String action;

    public MediaActionEvent(String action) {
        this.action = action;
    }

    public String getAction() {
        return action;
    }
}
