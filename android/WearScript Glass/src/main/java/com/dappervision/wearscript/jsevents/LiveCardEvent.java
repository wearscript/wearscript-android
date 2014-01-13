package com.dappervision.wearscript.jsevents;

public class LiveCardEvent implements JSBusEvent {
    private boolean nonSilent;
    private double period;

    public LiveCardEvent(boolean nonSilent, double period) {
        this.nonSilent = nonSilent;
        this.period = period;
    }

    public boolean isNonSilent() {
        return nonSilent;
    }

    public double getPeriod() {
        return period;
    }
}
