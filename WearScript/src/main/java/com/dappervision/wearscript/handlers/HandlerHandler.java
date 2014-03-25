package com.dappervision.wearscript.handlers;

import java.util.ArrayList;

public class HandlerHandler {
    ArrayList<Handler> handlers;

    public HandlerHandler() {
        handlers = new ArrayList<Handler>();
    }

    public void shutdown() {
        for (Handler h : handlers) {
            h.shutdown();
        }
        handlers = null;
    }
}
