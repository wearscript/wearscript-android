package com.dappervision.wearscript.events;

import android.content.Context;

/**
 * Created by conner on 3/25/14.
 */
public class ControlEvent {
    String command;
    boolean adb;

    public ControlEvent(String command, boolean adb) {
        this.command = command;
        this.adb = adb;
    }

    public boolean isAdb() {
        return adb;
    }

    public String getCommand() {
        return command;
    }
}
