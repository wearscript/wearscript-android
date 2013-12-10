package com.dappervision.wearscript;

import de.greenrobot.event.EventBus;

/**
 * Created by kurt on 12/9/13.
 */
public abstract class Manager {
    protected BackgroundService service;

    public Manager(BackgroundService service){
        this.service = service;
        EventBus.getDefault().register(this);
    }
}
