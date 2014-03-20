package com.dappervision.wearscript.events;

public class MediaPlayEvent {

    private final boolean playing;

    public MediaPlayEvent(boolean playing) {
        this.playing = playing;
    }

    public boolean isPlaying() {
        return playing;
    }
}
