package com.dappervision.wearscript.handlers;

import com.dappervision.wearscript.events.ControlEvent;
import com.mikedg.glass.control.inputhandler.AdbTcpInputHandler;

public class AdbHandler extends Handler {
    AdbTcpInputHandler adbTcpInputHandler;
    private boolean isStarted = false;

    public AdbHandler() {
        AdbTcpInputHandler adbTcpInputHandler = new AdbTcpInputHandler();
    }

    public void onEvent(ControlEvent event) {
        if(event.isAdb()){
            if(!isStarted)
                adbTcpInputHandler.start();
            String command = event.getCommand();
            if (command.equals("LEFT"))
                adbTcpInputHandler.left();
            if (command.equals("RIGHT"))
                adbTcpInputHandler.right();
            if (command.equals("BACK"))
                adbTcpInputHandler.back();
            if (command.equals("SELECT"))
                adbTcpInputHandler.select();
        }
    }

}
