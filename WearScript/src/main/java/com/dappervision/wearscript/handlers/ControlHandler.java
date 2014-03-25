package com.dappervision.wearscript.handlers;

import com.dappervision.wearscript.glassbt.GlassDevice;
import com.dappervision.wearscript.events.ControlEvent;

public class ControlHandler extends Handler {
    public void onEventBackgroundThread(ControlEvent e) {
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
        } else if(e.getCommand().equals((ControlEvent.INIT))){
            GlassDevice.getInstance();
        }
    }

    @Override
    public void shutdown() {
        super.shutdown();
        if(GlassDevice.hasInstance())
            GlassDevice.getInstance().close();
    }
}
