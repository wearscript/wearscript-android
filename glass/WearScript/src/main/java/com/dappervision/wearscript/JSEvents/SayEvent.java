package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class SayEvent implements JSBusEvent {
    private String msg;

    public SayEvent(String msg){
        this.msg = msg;
    }
    public String getMsg() {
        return msg;
    }
}
