package com.dappervision.wearscript.jsevents;

public class ActivityEvent implements JSBusEvent {
    private Mode mode;

    public enum Mode {
        CREATE,
        DESTROY,
        WEBVIEW,
        OPENGL,
        CARD_TREE,
        REFRESH
    }

    public ActivityEvent(Mode mode) {
        this.mode = mode;
    }

    public Mode getMode() {
        return mode;
    }
}
