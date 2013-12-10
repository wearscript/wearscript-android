package com.dappervision.wearscript.managers;

import android.content.Context;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.jsevents.WifiCallbackEvent;
import com.dappervision.wearscript.jsevents.WifiEvent;
import com.dappervision.wearscript.jsevents.WifiScanEvent;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * Created by kurt on 12/9/13.
 */
public class WifiManager extends Manager {
    public static final String SCAN_RESULTS_AVAILABLE_ACTION = android.net.wifi.WifiManager.SCAN_RESULTS_AVAILABLE_ACTION;
    android.net.wifi.WifiManager manager;
    private boolean enabled;

    public WifiManager(BackgroundService bs){
        super(bs);
        enabled = false;
        manager = (android.net.wifi.WifiManager) bs.getSystemService(Context.WIFI_SERVICE);
    }

    public String getMacAddress() {
        WifiInfo info = manager.getConnectionInfo();
        return info.getMacAddress();
    }

    public String getScanResults(){
        Double timestamp = System.currentTimeMillis() / 1000.;
        JSONArray a = new JSONArray();
        for (ScanResult s : manager.getScanResults()) {
            JSONObject r = new JSONObject();
            r.put("timestamp", timestamp);
            r.put("capabilities", new String(s.capabilities));
            r.put("SSID", new String(s.SSID));
            r.put("BSSID", new String(s.BSSID));
            r.put("level", new Integer(s.level));
            r.put("frequency", new Integer(s.frequency));
            a.add(r);
        }
        return a.toJSONString();
    }

    public void onEvent(WifiCallbackEvent e){
        registerCallback("wifi", e.getCallback());
    }

    public void onEvent(WifiScanEvent e){
        manager.startScan();
    }

    public void makeCall(){
        makeCall("wifi", getScanResults());
    }

    public void onEvent(WifiEvent e){
        enabled = e.getStatus();
    }
}
