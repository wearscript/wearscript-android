package com.dappervision.wearscript.events;

public class SayEvent {
    private String msg;
    private Boolean interrupt;

    public SayEvent(String msg, Boolean interrupt) {
        this.msg = msg;
        this.interrupt = interrupt;
    }

    public SayEvent(String msg) {
        this.msg = msg;
        this.interrupt = false;
    }

    public String getMsg() {
        return msg;
    }

    public Boolean getInterrupt() {
        return interrupt;
    }

}
