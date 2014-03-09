package com.dappervision.wearscript.events;

public class CardTreeEvent {
    private String treeJS;

    public CardTreeEvent(String treeJS) {
        this.treeJS = treeJS;
    }

    public String getTreeJS() {
        return treeJS;
    }
}
