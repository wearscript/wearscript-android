package com.dappervision.wearscript.events;

public class LogEvent implements BusEvent {
    private String msg;

    public LogEvent(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
