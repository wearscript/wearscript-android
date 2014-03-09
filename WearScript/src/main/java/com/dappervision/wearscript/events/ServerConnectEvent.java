package com.dappervision.wearscript.events;

import java.net.URI;

public class ServerConnectEvent {
    private URI server;
    private String callback;

    public ServerConnectEvent(URI server, String callback) {
        this.server = server;
        this.callback = callback;
    }

    public String getCallback() {
        return callback;
    }

    public URI getServer() {
        return server;
    }
}
