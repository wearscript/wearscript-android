package com.dappervision.wearscript;

import android.util.Base64;
import android.util.Log;

import com.codebutler.android_websockets.WebSocketClient;

import org.msgpack.MessagePack;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.TreeSet;

import static org.msgpack.template.Templates.TValue;
import static org.msgpack.template.Templates.tList;

public abstract class WearScriptConnection {
    private static final String TAG = "WearScriptConnection";
    private static final String LISTEN_CHAN = "subscriptions";
    private final int sleepTimeMax = 6000;
    static MessagePack msgpack = new MessagePack();
    protected String device, group, groupDevice;
    private WebSocketClient client;
    private LocalListener listener;
    private boolean shutdown;
    private URI uri;
    private boolean connected;
    private boolean callOnConnect;
    // deviceToChannels is always updated, then externalChannels is rebuilt
    private TreeMap<String, ArrayList<String>> deviceToChannels;
    private TreeSet<String> externalChannels;
    private TreeSet<String> scriptChannels;
    private boolean reconnecting;

    public WearScriptConnection(String group, String device) {
        shutdown = false;
        callOnConnect = false;
        reconnecting = false;
        this.group = group;
        this.device = device;
        groupDevice = channel(group, device);
        scriptChannels = new TreeSet<String>();
        resetExternalChannels();
        pinger();
    }

    public static byte[] encode(Object... data) {
        List<Value> out = new ArrayList<Value>();
        for (Object i : data) {
            Class c = i.getClass();
            if (c.equals(String.class))
                out.add(ValueFactory.createRawValue((String) i));
            else if (c.equals(Double.class))
                out.add(ValueFactory.createFloatValue((Double) i));
            else if (Value.class.isAssignableFrom(c))
                out.add((Value) i);
            else if (c.equals(Boolean.class))
                out.add(ValueFactory.createBooleanValue((Boolean) i));
            else {
                Log.e(TAG, "Unhandled class: " + c);
                return null;
            }
        }
        try {
            return msgpack.write(out);
        } catch (IOException e) {
            Log.e(TAG, "Could not encode msgpack");
        }
        return null;
    }

    public static Value listValue(Iterable<String> channels) {
        ArrayList<Value> channelsArray = new ArrayList<Value>();
        for (String c : channels)
            channelsArray.add(ValueFactory.createRawValue(c));
        return ValueFactory.createArrayValue(channelsArray.toArray(new Value[channelsArray.size()]));
    }

    public static Value mapValue(Map<String, ArrayList<String>> data) {
        ArrayList<Value> mapArray = new ArrayList<Value>();
        for (String k : data.keySet()) {
            mapArray.add(ValueFactory.createRawValue(k));
            mapArray.add(listValue(data.get(k)));
        }
        return ValueFactory.createMapValue(mapArray.toArray(new Value[mapArray.size()]));
    }

    public abstract void onConnect();

    public abstract void onReceive(String channel, byte[] dataRaw, List<Value> data);

    public abstract void onDisconnect();

    private void onReceiveDispatch(String channel, byte[] dataRaw, List<Value> data) {
        String channelPart = existsInternal(channel);
        if (channelPart != null) {
            Log.i(TAG, "ScriptChannel: " + channelPart);
            if (dataRaw != null && data == null) {
                try {
                    data = msgpack.read(dataRaw, tList(TValue));
                } catch (IOException e) {
                    Log.e(TAG, "Could not decode msgpack");
                    return;
                }
            }
            onReceive(channelPart, dataRaw, data);
        }
    }

    private void resetExternalChannels() {
        deviceToChannels = new TreeMap<String, ArrayList<String>>();
        externalChannels = new TreeSet<String>();
    }

    public void publish(Object... data) {
        String channel = (String) data[0];
        if (!exists(channel) && !channel.equals(LISTEN_CHAN))
            return;
        Log.d(TAG, "Publishing...: " + channel);
        if (channel.equals(LISTEN_CHAN)) {
            Log.d(TAG, "Channels: " + Base64.encodeToString(encode(data), Base64.NO_WRAP));
        }
        publish(channel, encode(data));
    }

    public void publish(String channel, byte[] outBytes) {
        if (!exists(channel)) {
            Log.d(TAG, String.format("Not publishing[%s] Client: %s outBytes: %s", channel, client != null, outBytes != null));
            return;
        }
        if (outBytes != null) {
            onReceiveDispatch(channel, outBytes, null);
            if (client != null && existsExternal(channel))
                client.send(outBytes);
        }
    }

    private Value oneStringArray(String channel) {
        Value[] array = new Value[1];
        array[0] = ValueFactory.createRawValue(channel);
        return ValueFactory.createArrayValue(array);
    }

    private Value channelsValue() {
        synchronized (this) {
            return listValue(scriptChannels);
        }
    }

    public void subscribe(String channel) {
        synchronized (this) {
            if (!scriptChannels.contains(channel)) {
                scriptChannels.add(channel);
                publish(LISTEN_CHAN, this.groupDevice, channelsValue());
            }
        }
    }

    public void subscribe(Iterable<String> channels) {
        synchronized (this) {
            boolean added = false;
            for (String channel : channels) {
                if (!scriptChannels.contains(channel)) {
                    added = true;
                    scriptChannels.add(channel);
                }
            }
            if (added)
                publish(LISTEN_CHAN, this.groupDevice, channelsValue());
        }
    }

    public String channel(Object... channels) {
        String out = "";
        for (Object c : channels) {
            if (out.isEmpty())
                out += (String) c;
            else {
                out += ":" + (String) c;
            }

        }
        return out;
    }

    public void unsubscribe(String channel) {
        synchronized (this) {
            if (scriptChannels.contains(channel)) {
                scriptChannels.remove(channel);
                publish(LISTEN_CHAN, this.groupDevice, channelsValue());
            }
        }
    }

    public void unsubscribe(Iterable<String> channels) {
        synchronized (this) {
            boolean removed = false;
            for (String channel : channels) {
                if (scriptChannels.contains(channel)) {
                    removed = true;
                    scriptChannels.remove(channel);
                }
            }
            if (removed)
                publish(LISTEN_CHAN, this.groupDevice, channelsValue());
        }
    }

    private void setDeviceChannels(String device, Value[] channels) {
        synchronized (this) {
            ArrayList<String> channelsArray = new ArrayList();
            for (Value channel : channels)
                channelsArray.add(channel.asRawValue().getString());
            deviceToChannels.put(device, channelsArray);
            TreeSet<String> externalChannelsNew = new TreeSet<String>();
            for (ArrayList<String> deviceChannels : deviceToChannels.values())
                for (String channel : deviceChannels)
                    externalChannelsNew.add(channel);
            externalChannels = externalChannelsNew;
        }
    }

    public void connect(URI uri) {
        Log.d(TAG, "Lifecycle: Connect called");
        synchronized (this) {
            if (shutdown) {
                Log.w(TAG, "Trying to connect while shutdown");
                return;
            }
            Log.i(TAG, uri.toString());
            if (uri.equals(this.uri) && connected) {
                onConnect();
                return;
            }
            this.uri = uri;
            Log.i(TAG, "Lifecycle: Socket connecting");
            if (client != null)
                client.disconnect();
            client = new WebSocketClient(uri, new LocalListener(), null);
            reconnect();
        }
    }

    public String subchannel(String part) {
        return channel(part, this.groupDevice);
    }

    public TreeSet<String> channelsInternal() {
        return scriptChannels;
    }

    public TreeMap<String, ArrayList<String>> channelsExternal() {
        return deviceToChannels;
    }

    public String group() {
        return group;
    }

    public String groupDevice() {
        return groupDevice;
    }

    public String device() {
        return device;
    }

    public String ackchannel(String c) {
        return channel(c, "ACK");
    }

    private boolean existsExternal(String channel) {
        if (channel.equals(LISTEN_CHAN))
            return true;
        String channelPartial = "";
        String[] parts = channel.split(":");
        if (externalChannels.contains(channelPartial))
            return true;
        for (String part : parts) {
            if (channelPartial.isEmpty())
                channelPartial += part;
            else
                channelPartial += ":" + part;
            if (externalChannels.contains(channelPartial))
                return true;
        }
        return false;
    }

    private String existsInternal(String channel) {
        String channelPartial = "";
        String[] parts = channel.split(":");
        String channelPartialExists = null;
        for (String part : parts) {
            if (channelPartial.isEmpty())
                channelPartial += part;
            else
                channelPartial += ":" + part;
            if (scriptChannels.contains(channelPartial))
                channelPartialExists = channelPartial;
        }
        return channelPartialExists;
    }

    public boolean exists(String channel) {
        return existsExternal(channel) || existsInternal(channel) != null;
    }

    public void disconnect() {
        if (client != null)
            client.disconnect();
    }

    public void shutdown() {
        synchronized (this) {
            this.shutdown = true;
            disconnect();
            if (client != null)
                client.getHandlerThread().getLooper().quit();
        }
    }

    private void pinger() {
        new Thread(new Runnable() {
            public void run() {
                while (true) {
                    if (shutdown)
                        return;
                    Log.w(TAG, "Lifecycle: Pinger...");
                    publish(LISTEN_CHAN, WearScriptConnection.this.groupDevice, channelsValue());
                    try {
                        Thread.sleep(60000);
                    } catch (InterruptedException e) {
                    }
                }
            }
        }).start();
    }

    private void publishChannels(int delay) {
        new Thread(new Runnable() {
            public void run() {
                Log.w(TAG, "Lifecycle: Pinger...");
                Log.d(TAG, "Channels: " + channelsValue());
                publish(LISTEN_CHAN, WearScriptConnection.this.groupDevice, channelsValue());
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                }
            }
        }).start();
    }

    private void reconnect() {
        synchronized (this) {
            if (shutdown)
                return;
            if (reconnecting)
                return;
            reconnecting = true;
        }
        new Thread(new Runnable() {
            public void run() {
                try {
                    int sleepTime = 1000;
                    while (true) {
                        Log.w(TAG, "Lifecycle: Trying to reconnect...");
                        synchronized (WearScriptConnection.this) {
                            if (connected || shutdown) {
                                reconnecting = false;
                                break;
                            }
                            Log.w(TAG, "Lifecycle: Reconnecting...");
                            // NOTE(brandyn): Reset channelToDevices, server will refresh on connect
                            resetExternalChannels();
                            client.connect();
                        }
                        try {
                            Thread.sleep(sleepTime);
                        } catch (InterruptedException e) {
                        }
                        sleepTime *= 2;
                        if (sleepTime > sleepTimeMax) {
                            sleepTime = sleepTimeMax;
                        }
                    }
                } finally {
                    synchronized (WearScriptConnection.this) {
                        reconnecting = false;
                        // NOTE(brandyn): This ensures that we at least leave this thread with one of...
                        // 1.) socket connected (disconnect after this would trigger a reconnect)
                        // 2.) another thread that will try again
                        if (!connected && !shutdown)
                            reconnect();
                    }
                }
            }
        }).start();
    }

    private class LocalListener implements WebSocketClient.Listener {

        LocalListener() {

        }

        @Override
        public void onConnect() {
            if (shutdown)
                return;
            connected = true;
            callOnConnect = true;
        }

        @Override
        public void onMessage(String s) {
            // Unused
        }

        @Override
        public void onDisconnect(int i, String s) {
            Log.w(TAG, "Lifecycle: Underlying socket disconnected: i: " + i + " s: " + s);
            synchronized (this) {
                connected = false;
                callOnConnect = false;
                if (shutdown)
                    return;
            }
            WearScriptConnection.this.onDisconnect();
            reconnect();
        }

        @Override
        public void onError(Exception e) {
            Log.w(TAG, "Lifecycle: Underlying socket errored: " + e.getLocalizedMessage());
            synchronized (this) {
                connected = false;
                callOnConnect = false;
                if (shutdown)
                    return;
            }
            WearScriptConnection.this.onDisconnect();
            reconnect();
        }

        @Override
        public void onMessage(byte[] message) {
            if (shutdown)
                return;
            synchronized (this) {
                try {
                    handleMessage(message);
                } catch (Exception e) {
                    Log.e(TAG, String.format("onMessage: %s", e.toString()));
                }
            }
        }

        private void handleMessage(byte[] message) throws IOException {
            String channel = "";
            List<Value> input = msgpack.read(message, tList(TValue));
            channel = input.get(0).asRawValue().getString();
            Log.d(TAG, String.format("Got %s", channel));
            if (channel.equals(LISTEN_CHAN)) {
                String d = input.get(1).asRawValue().getString();
                Value[] channels = input.get(2).asArrayValue().getElementArray();
                setDeviceChannels(d, channels);
                if (callOnConnect) {
                    callOnConnect = false;
                    Log.i(TAG, "Lifecycle: Calling server callback");
                    //publish(LISTEN_CHAN, groupDevice, channelsValue());
                    WearScriptConnection.this.onConnect();
                    publishChannels(500);
                }
            }
            WearScriptConnection.this.onReceiveDispatch(channel, message, input);
        }
    }

}
