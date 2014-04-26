package com.dappervision.wearscript.events;

import com.dappervision.wearscript.ui.MenuActivity;

public class LiveCardAddItemsEvent {
    private MenuActivity activity;

    public LiveCardAddItemsEvent(MenuActivity activity) {
        this.activity = activity;
    }
    public MenuActivity getActivity() {
        return activity;
    }
}
