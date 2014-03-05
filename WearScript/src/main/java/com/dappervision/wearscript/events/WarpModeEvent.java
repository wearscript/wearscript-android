package com.dappervision.wearscript.events;

import com.dappervision.wearscript.managers.WarpManager;

public class WarpModeEvent implements BusEvent {
    WarpManager.Mode mode;

    public WarpModeEvent(WarpManager.Mode mode) {
        this.mode = mode;
    }

    public WarpManager.Mode getMode() {
        return mode;
    }
}