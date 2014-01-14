package com.dappervision.wearscript.core.jsevents;

import com.dappervision.wearscript.core.jsevents.JSBusEvent;

public class BarcodeEvent implements JSBusEvent {
    private String format;
    private String result;

    public BarcodeEvent(String format, String result) {
        this.format = format;
        this.result = result;
    }

    public String getFormat() {
        return format;
    }

    public String getResult() {
        return result;
    }
}
