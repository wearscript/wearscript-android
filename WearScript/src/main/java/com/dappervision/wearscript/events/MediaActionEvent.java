package com.dappervision.wearscript.events;

public class MediaActionEvent {

    private final String action;
    private final int msecs;

    public MediaActionEvent(String action)
    {
        this.action = action;
        this.msecs = 0;
    }
    public MediaActionEvent(String action, int msecs) {
        this.action = action;
        this.msecs = msecs;
    }

    public String getAction() {
        return action;
    }
    public int getMsecs() {return msecs;}
}
