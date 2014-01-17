package com.dappervision.wearscript.events;

import org.msgpack.type.Value;

import java.util.List;

public class ChannelSubscribeEvent implements BusEvent {
    private String channel;
    private String callback;

    public ChannelSubscribeEvent(String channel, String callback) {
        this.channel = channel;
        this.callback = callback;
    }

    public String getChannel() {
        return channel;
    }
    public String getCallback() {
        return callback;
    }
}
