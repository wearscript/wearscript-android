package com.dappervision.wearscript.managers;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.HardwareDetector;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ManagerManager {
    private static ManagerManager singleton;
    Map<String, Manager>  managers;

    private ManagerManager() {
        managers = new ConcurrentHashMap<String, Manager>();
    }

    public static ManagerManager get() {
        if (singleton != null) {
            return singleton;
        }
        singleton = new ManagerManager();
        return singleton;
    }

    public static boolean hasManager(Class<? extends Manager> c) {
        return get().get(c) != null;
    }

    public void newManagers(BackgroundService bs) {
        add(new OpenCVManager(bs));
        add(new DataManager(bs));
        add(new CameraManager(bs));
        add(new BarcodeManager(bs));
        add(new WifiManager(bs));
        add(new AudioManager(bs));
        add(new BluetoothManager(bs));
        add(new SpeechManager(bs));
        add(new ConnectionManager(bs));
        add(new WarpManager(bs));
        add(new LiveCardManager(bs));
        add(new PicarusManager(bs));
        add(new MediaManager(bs));
        if (HardwareDetector.hasGDK) {
            add(new CardTreeManager(bs));
        }
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
}
