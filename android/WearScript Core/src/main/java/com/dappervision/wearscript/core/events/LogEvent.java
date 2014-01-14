package com.dappervision.wearscript.core.events;

public class LogEvent implements BusEvent {
    private String msg;

    public LogEvent(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
