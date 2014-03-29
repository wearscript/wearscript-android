package com.dappervision.wearscript.managers;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.AsyncTask;
import android.os.ParcelUuid;
import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.events.BluetoothWriteEvent;
import com.dappervision.wearscript.events.CallbackRegistration;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

public class BluetoothManager extends Manager {
    public static final String LIST = "LIST";
    public static final String READ = "READ:";
    TreeMap<String, BluetoothSocket> mSockets;
    static String TAG = "BluetoothManager";
    private BluetoothAdapter mBluetoothAdapter;
    private boolean isSetup;

    public BluetoothManager(BackgroundService bs) {
        super(bs);
        isSetup = false;
        mSockets = new TreeMap<String, BluetoothSocket>();
        reset();
    }

    public void reset() {
        super.reset();
        for (BluetoothSocket sock : mSockets.values()) {
            try {
                sock.close();
            } catch (IOException e) {
                // TODO(brandyn): Add
            }
        }
        mSockets = new TreeMap<String, BluetoothSocket>();
    }

    private class BluetoothReadTask extends AsyncTask<String, Void, Void> {
        @Override
        protected Void doInBackground(String... addresses) {
            String address = addresses[0];
            String read = READ + address;
            byte data[] = new byte[1];
            // TODO(brandyn): Ensure that these tasks are getting shutdown on reset
            while (true) {
                if (!mSockets.containsKey(address)) {
                    try {
                        Thread.sleep(250);
                    } catch (InterruptedException e) {
                        // TODO(brandyn): Handle
                    }
                }
                try {

                    // TODO(brandyn): Bug here if you access with an unpaired address
                    data[0] = (byte)mSockets.get(address).getInputStream().read();
                    makeCall(read, "'" + Base64.encodeToString(data, Base64.NO_WRAP) + "'");
                } catch (IOException e) {
                    Log.w(TAG, "Could not read");
                    closeDevice(address);
                    return null;
                }
            }
        }
    }

    public void closeDevice(String address) {
        try {
            mSockets.get(address).close();
        } catch (IOException e1) {
            Log.w(TAG, "Could not close");
        }
        mSockets.remove(address);
    }

    public void setup() {
        if (isSetup)
            return;
        isSetup = true;
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null) {
            // Device does not support Bluetooth
            return;
        }
        if (!mBluetoothAdapter.isEnabled()) {
            Log.w(TAG, "BT not enabled");
        }
    }

    protected void setupCallback(CallbackRegistration e) {
        super.setupCallback(e);
        setup();
        if (e.getEvent() == LIST) {
            Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
            // If there are paired devices
            JSONArray devices = new JSONArray();
            if (pairedDevices.size() > 0) {
                // Loop through paired devices
                for (BluetoothDevice device : pairedDevices) {
                    JSONObject deviceJS = new JSONObject();
                    deviceJS.put("name", device.getName());
                    deviceJS.put("address", device.getAddress());
                    devices.add(deviceJS);
                }
            }
            String devicesJS = devices.toJSONString();
            Log.d(TAG, devicesJS);
            makeCall(LIST, "'" + devicesJS + "'");
            unregisterCallback(LIST);
        } else if (e.getEvent().startsWith(READ)) {
            String address = e.getEvent().substring(READ.length());
            if (!mSockets.containsKey(address)) {
                pairWithDevice(address);
            }
            BluetoothReadTask task = new BluetoothReadTask();
            task.execute(address);
        }
    }

    public void pairWithDevice(String address) {
        Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
        // If there are paired devices
        if (pairedDevices.size() > 0) {
            // Loop through paired devices
            for (BluetoothDevice device : pairedDevices) {
                if (device.getAddress().equals(address)) {
                    device.fetchUuidsWithSdp();
                    if (device.getUuids() == null) {
                        Log.d(TAG, "No uuids");
                        return;
                    }
                    // TODO(brandyn): Use intent
                    for (ParcelUuid uid: device.getUuids()) {
                        Log.d(TAG, "Uuid: " + uid.toString());
                    }
                    ParcelUuid uuid = device.getUuids()[0];
                    Log.d(TAG, "UUID: " + uuid.toString());
                    Log.d(TAG, "Trying to connect");
                    try {
                        mSockets.put(device.getAddress(), device.createInsecureRfcommSocketToServiceRecord(uuid.getUuid()));
                    } catch (IOException e2) {
                        Log.e(TAG, "Cannot create rfcom");
                        return;
                    }
                    try {
                        mSockets.get(device.getAddress()).connect();
                    } catch (IOException e3) {
                        mSockets.remove(device.getAddress());
                        Log.e(TAG, "Cannot connect");
                        return;
                    }
                    Log.d(TAG, "Connected");
                }
            }
        }
    }

    public void onEventBackgroundThread(BluetoothWriteEvent e) {
        setup();
        Log.d(TAG, "Addr: " + e.getAddress() + " Buffer: " + new String(e.getBuffer()));
        if (!mSockets.containsKey(e.getAddress()))
            pairWithDevice(e.getAddress());
        if (!mSockets.containsKey(e.getAddress())) {
            Log.e(TAG, "Not paired");
            return;
        }
        Log.d(TAG, "Size:" + mSockets.size());
        try {
            mSockets.get(e.getAddress()).getOutputStream().write(Base64.decode(e.getBuffer(), Base64.NO_WRAP));
        } catch (IOException e1) {
            closeDevice(e.getAddress());
            Log.e(TAG, "Cannot write");
        }
    }
}
