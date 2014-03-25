package com.dappervision.wearscript.handlers;

import com.dappervision.wearscript.glassbt.GlassDevice;
import com.dappervision.wearscript.events.ControlEvent;

public class ControlHandler extends Handler {
    public void onEvent(ControlEvent e) {
        if(e.isAdb())
            return;

        if(e.getCommand().equals(ControlEvent.TAP)) {
            GlassDevice.getInstance().tap();
        } else if(e.getCommand().equals(ControlEvent.SWIPE_LEFT)){
            GlassDevice.getInstance().swipeLeft();
        } else if(e.getCommand().equals(ControlEvent.SWIPE_RIGHT)){
            GlassDevice.getInstance().swipeRight();
        } else if(e.getCommand().equals(ControlEvent.SWIPE_DOWN)){
            GlassDevice.getInstance().swipeDown();
        }
    }
}
