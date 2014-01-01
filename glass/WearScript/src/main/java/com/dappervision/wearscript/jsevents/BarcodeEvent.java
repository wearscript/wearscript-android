package com.dappervision.wearscript.jsevents;

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
