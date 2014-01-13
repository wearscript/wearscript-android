package com.dappervision.wearscript.managers;

import com.dappervision.wearscript.BackgroundService;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ManagerManager {
    Map<String, Manager> managers;
    private static ManagerManager singleton;

    private ManagerManager() {
        managers = new ConcurrentHashMap<String, Manager>();
    }

    public void newManagers(BackgroundService bs) {
        add(new DataManager(bs));
        add(new CameraManager(bs));
        add(new BarcodeManager(bs));
        add(new WifiManager(bs));
        add(new BlobManager(bs));
        add(new AudioManager(bs));
        add(new OpenGLManager(bs));
    }

    public void add(Manager manager) {
        String name = manager.getClass().getName();
        Manager old = managers.remove(name);
        if (old != null)
            old.shutdown();
        managers.put(name, manager);
    }

    public Manager remove(Class<? extends Manager> manager) {
        String name = manager.getName();
        return managers.remove(name);
    }

    public Manager get(Class<? extends Manager> c) {
        return managers.get(c.getName());
    }

    public void resetAll() {
        for (Manager m : managers.values()) {
            m.reset();
        }
    }

    public void shutdownAll() {
        for (String name : managers.keySet()) {
            Manager m = managers.remove(name);
            m.shutdown();
        }
    }

    public static ManagerManager get() {
        if (singleton != null) {
            return singleton;
        }
        singleton = new ManagerManager();
        return singleton;
    }
}
