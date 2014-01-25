package com.dappervision.wearscript.jsevents;

public class SayEvent implements JSBusEvent {
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
