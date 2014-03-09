package com.dappervision.wearscript.events;

public class ScriptEvent {
    private String scriptPath;

    public ScriptEvent(String scriptPath) {
        this.scriptPath = scriptPath;
    }

    public String getScriptPath() {
        return scriptPath;
    }
}
