package com.dappervision.wearscript.core.jsevents;

public class ServerTimelineEvent implements JSBusEvent {
    private String msg;

    public ServerTimelineEvent(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
