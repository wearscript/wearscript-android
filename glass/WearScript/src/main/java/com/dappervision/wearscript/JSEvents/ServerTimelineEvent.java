package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class ServerTimelineEvent implements JSBusEvent {
    private String msg;

    public ServerTimelineEvent(String msg){
        this.msg = msg;
    }
    public String getMsg() {
        return msg;
    }
}
