package com.dappervision.wearscript.handlers;

import com.dappervision.wearscript.Utils;

public abstract class Handler {

    public Handler() {
        Utils.getEventBus().register(this);
    }

    public void shutdown() {
        Utils.getEventBus().unregister(this);
    }
}
