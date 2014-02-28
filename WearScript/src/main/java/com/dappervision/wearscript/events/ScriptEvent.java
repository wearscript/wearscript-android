package com.dappervision.wearscript.events;

public class ScriptEvent implements BusEvent {
    private String scriptPath;

    public ScriptEvent(String scriptPath) {
        this.scriptPath = scriptPath;
    }

    public String getScriptPath() {
        return scriptPath;
    }
}
