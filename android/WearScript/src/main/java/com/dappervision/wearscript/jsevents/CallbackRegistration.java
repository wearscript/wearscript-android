package com.dappervision.wearscript.jsevents;

import com.dappervision.wearscript.managers.Manager;

public class CallbackRegistration implements JSBusEvent {
    private Class manager;
    private String callback;
    private String event;

    public CallbackRegistration(Class manager, String callback) {
        this.callback = callback;
        this.manager = manager;
    }

    public Class<Manager> getManager() {
        return manager;
    }

    public CallbackRegistration setEvent(int t) {
        event = String.format("%d", t);
        return this;
    }

    public boolean isEvent(String event) {
        return this.event.equals(event);
    }

    public boolean isManager(Class m) {
        return m.getClass().equals(manager);
    }

    public CallbackRegistration setEvent(String type) {
        this.event = type;
        return this;
    }

    public String getEvent() {
        return event;
    }

    public String getCallback() {
        return callback;
    }
}
