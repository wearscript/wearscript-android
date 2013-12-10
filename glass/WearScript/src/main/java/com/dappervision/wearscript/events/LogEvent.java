package com.dappervision.wearscript.events;

/**
 * Created by kurt on 12/9/13.
 */
public class LogEvent implements BusEvent {
    private String msg;

    public LogEvent(String msg){
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
