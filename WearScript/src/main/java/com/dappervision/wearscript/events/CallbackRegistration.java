package com.dappervision.wearscript.events;

import com.dappervision.wearscript.managers.Manager;

public class CallbackRegistration {
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

    public String getEvent() {
        return event;
    }

    public CallbackRegistration setEvent(String type) {
        this.event = type;
        return this;
    }

    public String getCallback() {
        return callback;
    }
}
