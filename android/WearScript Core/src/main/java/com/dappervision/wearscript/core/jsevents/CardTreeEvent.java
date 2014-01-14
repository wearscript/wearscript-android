package com.dappervision.wearscript.core.jsevents;

public class CardTreeEvent implements JSBusEvent {
    private String treeJS;

    public CardTreeEvent(String treeJS) {
        this.treeJS = treeJS;
    }

    public String getTreeJS() {
        return treeJS;
    }
}
