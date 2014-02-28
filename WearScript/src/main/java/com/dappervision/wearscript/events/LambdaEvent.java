package com.dappervision.wearscript.events;

public class LambdaEvent implements BusEvent {
    private String command;

    public LambdaEvent(String command) {
        this.command = command;
    }

    public String getCommand() {
        return command;
    }
}
