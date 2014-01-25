package com.dappervision.wearscript.jsevents;

public class ActivityEvent implements JSBusEvent {
    private Mode mode;

    public enum Mode {
        CREATE,
        DESTROY,
        WEBVIEW,
        CARD_SCROLL,
        OPENGL,
        CARD_TREE
    }

    public ActivityEvent(Mode mode) {
        this.mode = mode;
    }

    public Mode getMode() {
        return mode;
    }
}
