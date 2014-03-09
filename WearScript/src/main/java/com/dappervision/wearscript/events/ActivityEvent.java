package com.dappervision.wearscript.events;

public class ActivityEvent {
    private Mode mode;

    public ActivityEvent(Mode mode) {
        this.mode = mode;
    }

    public Mode getMode() {
        return mode;
    }

    public enum Mode {
        CREATE,
        DESTROY,
        WEBVIEW,
        OPENGL,
        CARD_TREE,
        WARP, REFRESH
    }
}
