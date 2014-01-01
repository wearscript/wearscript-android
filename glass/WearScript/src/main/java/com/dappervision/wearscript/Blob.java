package com.dappervision.wearscript;

import org.msgpack.MessagePack;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Blob {
    private static final String TAG = "Blob";
    private final String name;
    private final byte[] payload;
    private boolean outgoing;
    private boolean sent;

    public Blob(String name, byte[] payload) {
        this.name = name;
        this.payload = payload;
        this.outgoing = false;
        this.sent = false;
    }

    public Blob(String name, String payload) {
        this(name, payload.getBytes());
    }

    public byte[] getPayload() {
        return payload;
    }

    public String getName() {
        return name;
    }

    public Blob outgoing() {
        this.outgoing = true;
        return this;
    }

    public boolean isOutgoing() {
        return outgoing;
    }

    public boolean isSent() {
        return sent;
    }

    public void send(SocketClient client) {
        if (client != null && client.isConnected()) {
            List<Value> output = new ArrayList<Value>();
            output.add(ValueFactory.createRawValue("blob"));
            output.add(ValueFactory.createRawValue(name));
            output.add(ValueFactory.createRawValue(payload));
            try {
                MessagePack msgpack = new MessagePack();
                client.send(msgpack.write(output));
                sent = true;
            } catch (IOException e) {
                Log.e(TAG, "blobSend: Couldn't serialize msgpack");
            }
        }
    }
}
