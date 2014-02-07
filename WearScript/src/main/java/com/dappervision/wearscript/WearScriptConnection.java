package com.dappervision.wearscript;

import android.util.Log;

import com.codebutler.android_websockets.WebSocketClient;

import org.apache.http.message.BasicNameValuePair;
import org.msgpack.MessagePack;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.TreeMap;
import java.util.TreeSet;

import static org.msgpack.template.Templates.TValue;
import static org.msgpack.template.Templates.tList;

public abstract class WearScriptConnection {
    private static final String TAG = "WearScriptConnection";
    private static final String LISTEN_CHAN = "subscriptions";
    static MessagePack msgpack = new MessagePack();
    private WebSocketClient client;
    private LocalListener listener;
    private boolean shutdown;
    private URI uri;
    protected String device, group, groupDevice;
    private boolean connected;
    // deviceToChannels is always updated, then externalChannels is rebuilt
    private TreeMap<String, ArrayList<String>> deviceToChannels;
    private TreeSet<String> externalChannels;
    private TreeSet<String> scriptChannels;
    private boolean reconnecting;

    public WearScriptConnection() {
        shutdown = false;
        reconnecting = false;
        group = "glass";
        device = "TODOID"; // TODO(brandyn): Update
        groupDevice = channel(group, device);
        scriptChannels = new TreeSet<String>();
        resetExternalChannels();
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

    public abstract void onConnect();

    public abstract void onReceive(String channel, byte[] dataRaw, List<Value> data);

    public abstract void onDisconnect();

    private void resetExternalChannels() {
        deviceToChannels = new TreeMap<String, ArrayList<String>>();
        externalChannels = new TreeSet<String>();
    }

    public void publish(Object... data) {
        String channel = (String)data[0];
        if (client == null || !exists(channel) && !channel.equals(LISTEN_CHAN))
            return;
        byte[] outBytes = encode(data);
        if (outBytes != null)
            client.send(outBytes);
    }

    public void publish(String channel, byte[] outBytes) {
        if (client == null || !exists(channel) && !channel.equals(LISTEN_CHAN))
            return;
        if (outBytes != null)
            client.send(outBytes);
    }

    private Value oneStringArray(String channel) {
        Value[] array = new Value[1];
        array[0] = ValueFactory.createRawValue(channel);
        return ValueFactory.createArrayValue(array);
    }

    private Value channelsValue() {
        return listValue(scriptChannels);
    }

    private Value listValue(Iterable<String> channels) {
        ArrayList<Value> channelsArray = new ArrayList<Value>();
        for (String c : channels)
            channelsArray.add(ValueFactory.createRawValue(c));
        return ValueFactory.createArrayValue(channelsArray.toArray(new Value[channelsArray.size()]));
    }

    public void subscribe(String channel) {
        synchronized (this) {
            if (!scriptChannels.contains(channel)) {
                scriptChannels.add(channel);
                publish(LISTEN_CHAN, this.groupDevice, channelsValue());
            }
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
                publish(LISTEN_CHAN, this.device, channelsValue());
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
            for (String c : externalChannels)
                Log.d(TAG, "External: " + c);
        }
    }

    public void connect(URI uri) {
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
            List<BasicNameValuePair> extraHeaders = Arrays.asList();
            Log.i(TAG, "Lifecycle: Socket connecting");
            // TODO(brandyn): Add MAC address as ID
            if (client != null)
                client.disconnect();
            client = new WebSocketClient(uri, new LocalListener(), extraHeaders);
            reconnect();
        }
    }

    public String subchannel(String part) {
        return channel(part, this.groupDevice);
    }

    public TreeSet<String> channelsInternal() {
        return externalChannels;
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

    public boolean exists(String channel) {
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

    public void disconnect() {
        if (client != null)
            client.disconnect();
    }

    public void shutdown() {
        synchronized (this) {
            this.shutdown = true;
            disconnect();
            client.getHandlerThread().getLooper().quit();
        }
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
                    while (true) {
                        Log.w(TAG, "Lifecycle: Trying to reconnect...");
                        synchronized (WearScriptConnection.this) {
                            if (connected || shutdown) {
                                reconnecting = false;
                                break;
                            }
                            // NOTE(brandyn): Reset channelToDevices, server will refresh on connect
                            resetExternalChannels();
                            client.connect();
                        }
                        try {
                            Thread.sleep(500);
                        } catch (InterruptedException e) {
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
            Log.i(TAG, "Lifecycle: Calling server callback");
            publish(LISTEN_CHAN, groupDevice, channelsValue());
            WearScriptConnection.this.onConnect();
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
            }
            if (scriptChannels.contains(channel)) {
                Log.i(TAG, "ScriptChannel: " + channel);
                WearScriptConnection.this.onReceive(channel, message, input);
            }
        }
    }

}
