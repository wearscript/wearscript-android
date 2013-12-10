package com.dappervision.wearscript.jsevents;

public class ActivityEvent implements JSBusEvent {
    private Mode mode;
    public enum Mode {
        CREATE,
        DESTROY,
        WEBVIEW,
        CARD_SCROLL
    }

    public ActivityEvent(Mode m){
        this.mode = mode;
    }

    public Mode getMode(){
        return mode;
    }
}
