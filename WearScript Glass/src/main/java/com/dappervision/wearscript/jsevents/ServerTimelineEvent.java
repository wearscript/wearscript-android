package com.dappervision.wearscript.jsevents;

public class ServerTimelineEvent implements JSBusEvent {
    private String msg;

    public ServerTimelineEvent(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
