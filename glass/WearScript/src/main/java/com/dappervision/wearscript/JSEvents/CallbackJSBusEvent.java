package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public abstract class CallbackJSBusEvent implements JSBusEvent {
    private String callback;

    public CallbackJSBusEvent(String callback){
        this.callback = callback;
    }
    public String getCallback(){
        return callback;
    }
}
