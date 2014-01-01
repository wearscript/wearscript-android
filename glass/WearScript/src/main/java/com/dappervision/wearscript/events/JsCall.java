package com.dappervision.wearscript.events;

public class JsCall implements BusEvent {
    private String call;

    public JsCall(String call) {
        this.call = call;
    }

    public String getCall() {
        return call;
    }
}
