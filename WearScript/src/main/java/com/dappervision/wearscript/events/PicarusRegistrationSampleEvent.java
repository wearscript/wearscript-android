package com.dappervision.wearscript.events;

public class PicarusRegistrationSampleEvent {
    private byte[] jpeg;

    public PicarusRegistrationSampleEvent(byte[] jpeg) {
        this.jpeg = jpeg;
    }

    public byte[] getJPEG() {
        return jpeg;
    }
}
