package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
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
