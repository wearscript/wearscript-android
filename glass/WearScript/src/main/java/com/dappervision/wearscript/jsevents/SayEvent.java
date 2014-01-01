package com.dappervision.wearscript.jsevents;

public class SayEvent implements JSBusEvent {
    private String msg;

    public SayEvent(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
