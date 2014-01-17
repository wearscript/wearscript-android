package com.dappervision.wearscript.managers;

import android.util.Base64;

import com.codebutler.android_websockets.WebSocketClient;
import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.ChannelSubscribeEvent;
import com.dappervision.wearscript.events.ChannelUnsubscribeEvent;
import com.dappervision.wearscript.events.LambdaEvent;
import com.dappervision.wearscript.events.ScriptEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.SendSubEvent;
import com.dappervision.wearscript.events.ServerConnectEvent;
import com.dappervision.wearscript.jsevents.SayEvent;

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

public class ConnectionManager extends Manager {
    private static final String TAG = "ConnectionManager";
    private static final String ONCONNECT = "ONCONNECT";
    private static final String LISTEN_CHAN = "subscribe";
    public static final String SENSORS_SUBCHAN = "sensors";
    public static final String IMAGE_SUBCHAN = "image";
    MessagePack msgpack = new MessagePack();
    private WebSocketClient client;
    private LocalListener listener;
    private boolean shutdown;
    private URI uri;
    private String device;
    private boolean connected;
    // deviceToChannels is always updated, then externalChannels is rebuilt
    private TreeMap<String, ArrayList<String>> deviceToChannels;
    private TreeSet<String> externalChannels;
    private TreeSet<String> scriptChannels;
    private boolean reconnecting;

    public ConnectionManager(BackgroundService bs) {
        super(bs);
        shutdown = false;
        reconnecting = false;
        device = "glass:TODOID"; // TODO(brandyn): Update
        resetExternalChannels();
        reset();
    }

    public void reset() {
        synchronized (this) {
            scriptChannels = new TreeSet<String>();
            if (scriptChannels != null && scriptChannels.size() > 0)
                announceSubscriptions();
        }
        super.reset();
    }

    private void resetExternalChannels() {
        deviceToChannels = new TreeMap<String, ArrayList<String>>();
        externalChannels = new TreeSet<String>();
    }

    private void announceSubscriptions() {
        ArrayList<Value> channelsArray = new ArrayList<Value>();
        for (String channel : scriptChannels)
            channelsArray.add(ValueFactory.createRawValue(channel));
        Value channelsValue = ValueFactory.createArrayValue(channelsArray.toArray(new Value[channelsArray.size()]));
        Utils.eventBusPost(new SendEvent(LISTEN_CHAN, this.device, channelsValue));
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

    private void connect(URI uri) {
        synchronized (this) {
            Log.i(TAG, uri.toString());
            if (uri.equals(this.uri) && client.isConnected()) {
                makeCall(ONCONNECT, "");
                return;
            }
            this.uri = uri;
            List<BasicNameValuePair> extraHeaders = Arrays.asList();
            Log.i(TAG, "Lifecycle: Socket connecting");
            // TODO(brandyn): Add MAC address as ID
            if (client != null)
                client.disconnect();
            client = new WebSocketClient(uri, new LocalListener(this.device), extraHeaders);
            reconnect();
        }
    }

    public boolean isConnected() {
        return connected;
    }

    public String getChannelFromSubChannel(String subchannel) {
        return String.format("%s:%s", this.device, subchannel);
    }

    public boolean channelExists(String channel) {
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

    public void onEvent(SendEvent e) {
        String channel = e.getChannel();
        if (!channelExists(channel))
            return;
        client.send(e.getData());
    }

    public void onEvent(ServerConnectEvent e) {
        registerCallback(ONCONNECT, e.getCallback());
        connect(e.getServer());
    }

    public void onEvent(SendSubEvent e) {
        onEvent(new SendEvent(String.format("%s:%s", this.device, e.getSubChannel()), e.getData()));
    }

    public void onEvent(ChannelSubscribeEvent e) {
        // Register the channel + callback, call announceSubscriptions to update
        registerCallback(e.getChannel(), e.getCallback());
        synchronized (this) {
            scriptChannels.add(e.getChannel());
            announceSubscriptions();
        }
    }

    public void onEvent(ChannelUnsubscribeEvent e) {
        synchronized (this) {
            scriptChannels.removeAll(e.getChannels());
        }
    }

    private void disconnect() {
        if (client != null)
            client.disconnect();
    }

    public void shutdown() {
        synchronized (this) {
            this.shutdown = true;
            disconnect();
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
                        synchronized (ConnectionManager.this) {
                            if (client.isConnected() || shutdown) {
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
                    synchronized (ConnectionManager.this) {
                        reconnecting = false;
                        // NOTE(brandyn): This ensures that we at least leave this thread with one of...
                        // 1.) socket connected (disconnect after this would trigger a reconnect)
                        // 2.) another thread that will try again
                        if (!client.isConnected() && !shutdown)
                            reconnect();
                    }
                }
            }
        }).start();
    }

    private class LocalListener implements WebSocketClient.Listener {
        private final String device;
        private final String group;

        LocalListener(String device) {
            this.device = device;
            this.group = device.split(":")[0];
        }

        @Override
        public void onConnect() {
            if (shutdown)
                return;
            connected = true;
            Log.i(TAG, "Lifecycle: Calling server callback");
            makeCall(ONCONNECT, "");
        }

        @Override
        public void onMessage(String s) {
            // Unused
        }

        @Override
        public void onDisconnect(int i, String s) {
            Log.w(TAG, "Lifecycle: Underlying socket disconnected: i: " + i + " s: " + s);
            if (shutdown)
                return;
            connected = false;
            reconnect();
        }

        @Override
        public void onError(Exception e) {
            Log.w(TAG, "Lifecycle: Underlying socket errored: " + e.getLocalizedMessage());
            if (shutdown)
                return;
            connected = false;
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
                String device = input.get(1).asRawValue().getString();
                Value[] channels = input.get(2).asArrayValue().getElementArray();
                setDeviceChannels(device, channels);
            } else if (channel.equals("error")) {
                shutdown();
                String error = input.get(1).asRawValue().getString();
                Log.e(TAG, "Lifecycle: Got server error: " + error);
                Utils.eventBusPost(new SayEvent(error, true));
            } else if (channel.equals("version")) {
                int versionExpected = 1;
                int version = input.get(1).asIntegerValue().getInt();
                if (version != versionExpected) {
                    Utils.eventBusPost(new SayEvent("Version mismatch!  Got " + version + " and expected " + versionExpected + ".  Visit wear script .com for information.", true));
                }
            } else if (channel.equals("raven")) {
                Log.setDsn(input.get(1).asRawValue().getString());
            } else if (channel.equals(this.device) || channel.equals(this.group)) {
                String command = input.get(1).asRawValue().getString();
                Log.d(TAG, String.format("Got %s %s", channel, command));
                if (command.equals("script")) {
                    Value[] files = input.get(2).asMapValue().getKeyValueArray();
                    // TODO(brandyn): Verify that writing a script here isn't going to break anything while the old script is running
                    String path = null;
                    for (int i = 0; i < files.length / 2; i++) {
                        String name = files[i * 2].asRawValue().getString();
                        String pathCur = Utils.SaveData(files[i * 2 + 1].asRawValue().getByteArray(), "scripting/", false, name);
                        if (name.equals("glass.html"))
                            path = pathCur;
                    }
                    if (path != null) {
                        Utils.eventBusPost(new ScriptEvent(path));
                    } else {
                        Log.w(TAG, "Got script event but not glass.html, not running");
                    }
                } else if (command.equals("lambda")) {
                    Utils.eventBusPost(new LambdaEvent(input.get(2).asRawValue().getString()));
                }
            }
            if (scriptChannels.contains(channel)) {
                Log.i(TAG, "ScriptChannel: " + channel);
                makeCall(channel, String.format("'%s'", Base64.encodeToString(message, Base64.NO_WRAP)));
            }
        }
    }
}
