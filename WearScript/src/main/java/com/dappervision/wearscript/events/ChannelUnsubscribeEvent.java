package com.dappervision.wearscript.events;

import java.util.ArrayList;
import java.util.List;

public class ChannelUnsubscribeEvent {
    private List<String> channels;

    public ChannelUnsubscribeEvent(List<String> channels) {
        this.channels = channels;
    }

    public ChannelUnsubscribeEvent(String channel) {
        this.channels = new ArrayList<String>();
        this.channels.add(channel);
    }

    public List<String> getChannels() {
        return channels;
    }
}
