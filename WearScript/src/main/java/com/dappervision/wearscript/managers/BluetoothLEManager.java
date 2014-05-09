package com.dappervision.wearscript.managers;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.SensorJSEvent;

import java.util.concurrent.ConcurrentHashMap;

public class BluetoothLEManager extends Manager {
    public static final String READ = "READ:";
    static String TAG = "BluetoothManager";
    private BluetoothAdapter mBluetoothAdapter;
    protected ConcurrentHashMap<String, GattConnection> gatts;

    public BluetoothLEManager(BackgroundService bs) {
        super(bs);
        gatts = new ConcurrentHashMap<String, GattConnection>();
        BluetoothManager bluetoothManager = (BluetoothManager) service.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    @Override
    public void reset() {
        super.reset();
        scanOff();
    }

    @Override
    public void shutdown() {
        super.shutdown();
        scanOff();
        for(GattConnection connection : gatts.values()){
            connection.close();
        }
        gatts.clear();
    }

    public void onEvent(SensorJSEvent event) {
        int type = event.getType();
        if(event.getStatus()) {
            if (type == WearScript.SENSOR.BTLE.id())
                scanOn();
        }
        else {
            scanOff();
        }
    }

    @Override
    public void onEvent(CallbackRegistration r) {
        super.onEvent(r);
        if (r.getEvent().startsWith(READ)) {
            String address = r.getEvent().substring(READ.length());
            BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);
            if(!gatts.containsKey(address)){
                gatts.put(address, new GattConnection(r.getCallback()));
            }
            device.connectGatt(service, true, gatts.get(address));
        }

    }

    private void scanOff() {
        if(mBluetoothAdapter != null)
            mBluetoothAdapter.stopLeScan(mLeScanCallback);
    }

    public void scanOn() {
        mBluetoothAdapter.startLeScan(mLeScanCallback);
    }

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(BluetoothDevice bluetoothDevice, int i, byte[] bytes) {
            Utils.eventBusPost(new SendEvent("btle", bluetoothDevice.getAddress()));
        }
    };

    private class GattConnection extends BluetoothGattCallback {
        private static final int STATE_DISCONNECTED = 0;
        private static final int STATE_CONNECTING = 1;
        private static final int STATE_CONNECTED = 2;

        private final String mCallback;
        private int mConnectionState = STATE_DISCONNECTED;
        private BluetoothGatt mGatt;

        GattConnection(String callback) {
            super();
            mCallback = callback;
        }

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);
            mGatt = gatt;
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                mConnectionState = STATE_CONNECTED;
                gatt.discoverServices();

            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                mConnectionState = STATE_DISCONNECTED;
            }
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicRead(gatt, characteristic, status);
            mGatt = gatt;
            final byte[] data = characteristic.getValue();
            if (data != null && data.length > 0) {
                final StringBuilder stringBuilder = new StringBuilder(data.length);
                for(byte byteChar : data)
                    stringBuilder.append(String.format("%02X ", byteChar));
               makeCall(mCallback, stringBuilder.toString());
            }
        }

        public void close() {
            if(mGatt != null)
                mGatt.close();
        }
    }

}