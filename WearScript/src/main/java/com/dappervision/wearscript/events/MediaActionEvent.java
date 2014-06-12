package com.dappervision.wearscript.events;

public class MediaActionEvent {

    private final String action;
    private final int magnitude;

    public MediaActionEvent(String action)
    {
        this.action = action;
        this.magnitude=0;
    }
    public MediaActionEvent(String action,int magnitude) {
        this.action = action; this.magnitude=magnitude;
    }


    public String getAction() {
        return action;
    }
    public int getMagnitude() {return magnitude;}
}
