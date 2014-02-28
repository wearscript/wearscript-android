package com.dappervision.wearscript.events;

import com.dappervision.wearscript.Log;

import org.msgpack.MessagePack;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SendEvent implements BusEvent {
    private static final String TAG = "SendEvent";
    private String channel;
    private Object[] data;
    private byte[] dataMsgpack;
    private MessagePack msgpack;

    public SendEvent(String channel, byte[] data) {
        this.channel = channel;
        this.dataMsgpack = data;
    }

    public SendEvent(String channel, Object... data) {
        this.channel = channel;
        this.data = data;
        this.msgpack = new MessagePack();
    }

    public byte[] getData() {
        if (dataMsgpack == null) {
            List<Value> data = new ArrayList<Value>();
            data.add(ValueFactory.createRawValue(channel));
            for (Object i : this.data) {
                Class c = i.getClass();
                if (c.equals(String.class))
                    data.add(ValueFactory.createRawValue((String) i));
                else if (c.equals(Double.class))
                    data.add(ValueFactory.createFloatValue((Double) i));
                else if (Value.class.isAssignableFrom(c))
                    data.add((Value) i);
                else {
                    Log.e(TAG, "Unhandled class: " + c);
                    return null;
                }
            }
            try {
                this.dataMsgpack = msgpack.write(data);
            } catch (IOException e) {
                // TODO(brandyn): Handle
            }
        }
        return dataMsgpack;
    }

    public String getChannel() {
        return channel;
    }

}
