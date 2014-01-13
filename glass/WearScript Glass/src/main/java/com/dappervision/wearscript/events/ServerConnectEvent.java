package com.dappervision.wearscript.events;

public class ServerConnectEvent implements BusEvent {
    private String server;
    private String callback;

    public ServerConnectEvent(String server, String callback) {
        this.server = server;
        this.callback = callback;
    }

    public ServerConnectEvent(String server) {
        this.server = server;
    }

    public String getCallback() {
        return callback;
    }

    public String getServer() {
        return server;
    }
}
