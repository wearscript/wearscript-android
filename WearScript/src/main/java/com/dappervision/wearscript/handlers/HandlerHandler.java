package com.dappervision.wearscript.handlers;

import java.util.ArrayList;

public class HandlerHandler {
    private static HandlerHandler singleton;
    ArrayList<Handler> handlers;

    public HandlerHandler() {
        handlers = new ArrayList<Handler>();
        newHandlers();
    }

    public static HandlerHandler get() {
        if (singleton != null) {
            return singleton;
        }
        singleton = new HandlerHandler();
        return singleton;
    }
    public void resetAll() {
        for (Handler h : handlers) {
            h.shutdown();
        }
        newHandlers();
    }

    public void shutdownAll() {
        for (Handler h : handlers) {
            h.shutdown();
        }
        handlers = null;
    }

    public void newHandlers() {
        handlers.add(new ControlHandler());
    }
}
