package com.dappervision.wearscript.events;

public class BluetoothBondEvent {
    private String address;
    private String pin;

    public BluetoothBondEvent(String address, String pin) {
        this.address = address;
        this.pin = pin;
    }
    public String getAddress() {
        return address;
    }
    public String getPin() {
        return pin;
    }

}
