package com.dappervision.wearscript.events;

public class SendSubEvent implements BusEvent {
    private String subchannel;
    private Object[] data;


    public SendSubEvent(String subchannel, Object... data) {
        this.subchannel = subchannel;
        this.data = data;
    }

    public Object[] getData() {
        return data;
    }

    public String getSubChannel() {
        return subchannel;
    }

}
