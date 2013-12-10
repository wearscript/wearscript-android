package com.dappervision.wearscript.events;

/**
 * Created by kurt on 12/9/13.
 */
public class JsCall implements BusEvent {
    private String call;

    public JsCall(String call){
        this.call = call;
    }

    public String getCall() {
        return call;
    }
}
