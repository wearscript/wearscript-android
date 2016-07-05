package com.dappervision.wearscript.handlers;

import com.dappervision.wearscript.events.ControlEvent;
import com.mikedg.glass.control.inputhandler.AdbTcpInputHandler;

import de.greenrobot.event.Subscribe;

public class AdbHandler extends Handler {
    AdbTcpInputHandler adbTcpInputHandler;
    private boolean isStarted = false;

    public AdbHandler() {
        adbTcpInputHandler = new AdbTcpInputHandler();
    }

    @Subscribe
    public void onEvent(ControlEvent event) {
        if(event.isAdb()){
            if(!isStarted)
                adbTcpInputHandler.start();
            String command = event.getCommand();
            if (command.equals(ControlEvent.SWIPE_LEFT))
                adbTcpInputHandler.left();
            if (command.equals(ControlEvent.SWIPE_RIGHT))
                adbTcpInputHandler.right();
            if (command.equals(ControlEvent.SWIPE_DOWN))
                adbTcpInputHandler.back();
            if (command.equals(ControlEvent.TAP))
                adbTcpInputHandler.select();
        }
    }

}
