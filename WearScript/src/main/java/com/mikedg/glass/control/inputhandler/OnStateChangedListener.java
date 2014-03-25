package com.mikedg.glass.control.inputhandler;

/**
 * Created by Michael on 2/28/14.
 */
public interface OnStateChangedListener {
    public enum State {READY, NOT_READY, CATASTROPHIC_FAILURE};

    public void onStateChanged(State state);
}
