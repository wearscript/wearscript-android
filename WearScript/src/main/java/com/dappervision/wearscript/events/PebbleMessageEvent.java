package com.dappervision.wearscript.events;

public class PebbleMessageEvent {
    private String type;
    private String text;
    private boolean clear;
    private int vibeType;

    public PebbleMessageEvent(String type, String text, boolean clear) {
        this.type = type;
        this.text = text;
        this.clear = clear;
    }

    public PebbleMessageEvent(String type, int vibeType){
        this.type = type;
        this.vibeType = vibeType;
    }

    public String getText() {
        return text;
    }

    public String getType() {
        return type;
    }

    public boolean getClear() {
        return clear;
    }

    public int getVibeType() {
        return vibeType;
    }
}
