package com.dappervision.wearscript.managers;

import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.HardwareDetector;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.WearScriptConnection;
import com.dappervision.wearscript.events.ChannelSubscribeEvent;
import com.dappervision.wearscript.events.ChannelUnsubscribeEvent;
import com.dappervision.wearscript.events.GistSyncEvent;
import com.dappervision.wearscript.events.LambdaEvent;
import com.dappervision.wearscript.events.SayEvent;
import com.dappervision.wearscript.events.ScriptEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.SendSubEvent;
import com.dappervision.wearscript.events.ServerConnectEvent;
import com.dappervision.wearscript.events.ShutdownEvent;
import com.dappervision.wearscript.events.WarpHEvent;

import org.msgpack.MessagePack;
import org.msgpack.type.Value;

import java.util.List;
import java.util.TreeMap;
import java.util.TreeSet;

public class ConnectionManager extends Manager {
    public static final String SENSORS_SUBCHAN = "sensors";
    public static final String IMAGE_SUBCHAN = "image";
    private static final String TAG = "ConnectionManager";
    private static final String ONCONNECT = "ONCONNECT";
    private static final String LISTEN_CHAN = "subscriptions";
    MessagePack msgpack = new MessagePack();
    private String GIST_LIST_SYNC_CHAN, GIST_GET_SYNC_CHAN;
    private WearScriptConnectionImpl connection;
    private TreeSet<String> testChannels;  // NOTE(brandyn): Hack until we normalize the Java lib
    private int gistSyncPending;


    public ConnectionManager(BackgroundService bs) {
        super(bs);
        connection = new WearScriptConnectionImpl();
        GIST_LIST_SYNC_CHAN = connection.channel(connection.groupDevice(), "gistListSync");
        GIST_GET_SYNC_CHAN = connection.channel(connection.groupDevice(), "gistGetSync");
        reset();
    }

    public String groupDevice() {
        if (connection == null)
            return null;
        return connection.groupDevice();
    }

    public String group() {
        if (connection == null)
            return null;
        return connection.group();
    }

    public String device() {
        if (connection == null)
            return null;
        return connection.device();
    }

    public void reset() {
        synchronized (this) {
            // TODO(brandyn): For each script channel unsubscribe
            for (String channel : connection.channelsInternal()) {
                unregisterCallback(channel);
            }
            connection.unsubscribe(new TreeSet<String>(connection.channelsInternal()));
            testChannels = new TreeSet<String>();
            String testChannel = "test:" + connection.groupDevice();
            testChannels.add(testChannel);
            connection.subscribe(testChannel);
            connection.subscribe(connection.group());
            connection.subscribe(connection.groupDevice());
            connection.subscribe(GIST_LIST_SYNC_CHAN);
            connection.subscribe(GIST_GET_SYNC_CHAN);
            connection.subscribe("warph"); // TODO: Specialize it for this group/device
        }
        super.reset();
    }

    private Object[] stringValuesToObjects(List<Value> data) {
        Object arr[] = new Object[data.size()];
        for (int i = 0; i < data.size(); i++) {
            // BUG(brandyn): Currently correct but publish may take non string args
            arr[i] = data.get(i).asRawValue().getString();
        }
        return arr;
    }

    private void testHandler(List<Value> data) {
        Log.d(TAG, "TestHandler");
        String command = data.get(1).asRawValue().getString();
        String chanArg = data.get(2).asRawValue().getString();
        Log.d(TAG, "TestHandler: " + command + " " + chanArg);
        if (command.equals("subscribe")) {
            testChannels.add(chanArg);
            connection.subscribe(chanArg);
        } else if (command.equals("unsubscribe")) {
            testChannels.remove(chanArg);
            connection.unsubscribe(chanArg);
        } else if (command.equals("channelsInternal")) {
            connection.publish(chanArg, connection.listValue(connection.channelsInternal()));
        } else if (command.equals("channelsExternal")) {
            connection.publish(chanArg, connection.mapValue(connection.channelsExternal()));
        } else if (command.equals("group")) {
            connection.publish(chanArg, connection.group());
        } else if (command.equals("device")) {
            connection.publish(chanArg, connection.device());
        } else if (command.equals("groupDevice")) {
            connection.publish(chanArg, connection.groupDevice());
        } else if (command.equals("exists")) {
            connection.publish(chanArg, connection.exists(data.get(3).asRawValue().getString()));
        } else if (command.equals("publish")) {
            connection.publish(stringValuesToObjects(data.subList(2, data.size())));
        } else if (command.equals("channel")) {
            String channel = connection.channel(stringValuesToObjects(data.subList(2, data.size())));
            connection.publish(chanArg, channel);
        } else if (command.equals("subchannel")) {
            connection.publish(chanArg, connection.subchannel(data.get(3).asRawValue().getString()));
        } else if (command.equals("ackchannel")) {
            connection.publish(chanArg, connection.ackchannel(data.get(3).asRawValue().getString()));
        }
    }

    public void onEvent(SendEvent e) {
        String channel = e.getChannel();
        Log.d(TAG, "Sending Channel: " + channel);
        if (!connection.exists(channel)) {
            Log.d(TAG, "Channel doesn't exist: " + channel);
            return;
        }
        connection.publish(channel, e.getData());
    }

    public void onEvent(ServerConnectEvent e) {
        registerCallback(ONCONNECT, e.getCallback());
        connection.connect(e.getServer());
    }

    public void onEvent(SendSubEvent e) {
        String channel = connection.subchannel(e.getSubChannel());
        Log.d(TAG, "Sending Channel: " + channel);
        if (!connection.exists(channel)) {
            Log.d(TAG, "Channel doesn't exist: " + channel);
            return;
        }
        onEvent(new SendEvent(channel, e.getData()));
    }

    public void onEvent(ChannelSubscribeEvent e) {
        synchronized (this) {
            registerCallback(e.getChannel(), e.getCallback());
            connection.subscribe(e.getChannel());
        }
    }

    public void onEvent(GistSyncEvent e) {
        Utils.eventBusPost(new SendEvent("gist", "list", GIST_LIST_SYNC_CHAN));
    }

    public void onEvent(ChannelUnsubscribeEvent e) {
        synchronized (this) {
            for (String channel : e.getChannels()) {
                unregisterCallback(channel);
                // NOTE(brandyn): Ensures a script can stop getting callbacks but won't break the java side
                if (!channel.equals(connection.groupDevice()) && !channel.equals(connection.group()))
                    connection.unsubscribe(channel);
            }
        }
    }

    public void shutdown() {
        synchronized (this) {
            super.shutdown();
            connection.shutdown();
        }
    }

    public String subchannel(String subchan) {
        return connection.subchannel(subchan);
    }

    public boolean exists(String channel) {
        return connection.exists(channel);
    }

    class WearScriptConnectionImpl extends WearScriptConnection {

        WearScriptConnectionImpl() {
            super(HardwareDetector.isGlass ? "glass" : "phone", ((WifiManager) service.getManager(WifiManager.class)).getMacAddress().replace(":", ""));
        }

        @Override
        public void onConnect() {
            makeCall(ONCONNECT, "");
            // NOTE(brandyn): This ensures that we are only calling the function once
            unregisterCallback(ONCONNECT);
        }


        private TreeMap toMap(Value map) {
            TreeMap<String, Value> mapOut = new TreeMap<String, Value>();
            Value[] kv = map.asMapValue().getKeyValueArray();
            for (int i = 0; i < kv.length / 2; i++) {
                mapOut.put(kv[i * 2].asRawValue().getString(), kv[i * 2 + 1]);
            }
            return mapOut;
        }

        @Override
        public void onReceive(String channel, byte[] dataRaw, List<Value> data) {
            if (channel.equals(this.groupDevice) || channel.equals(this.group)) {
                String command = data.get(1).asRawValue().getString();
                Log.d(TAG, String.format("Got %s %s", channel, command));
                if (command.equals("script")) {
                    Value[] files = data.get(2).asMapValue().getKeyValueArray();
                    // TODO(brandyn): Verify that writing a script here isn't going to break anything while the old script is running
                    String path = null;
                    for (int i = 0; i < files.length / 2; i++) {
                        String name = files[i * 2].asRawValue().getString();
                        String pathCur = Utils.SaveData(files[i * 2 + 1].asRawValue().getByteArray(), "scripting/", false, name);
                        if (name.equals("glass.html") && (path == null || HardwareDetector.isGlass))
                            path = pathCur;
                        else if (name.equals("phone.html") && !HardwareDetector.isGlass)
                            name = pathCur;
                    }
                    if (path != null) {
                        Utils.eventBusPost(new ScriptEvent(path));
                    } else {
                        Log.w(TAG, "Got script event but not glass.html, not running");
                    }
                } else if (command.equals("lambda")) {
                    Utils.eventBusPost(new LambdaEvent(data.get(2).asRawValue().getString()));
                } else if (command.equals("error")) {
                    shutdown();
                    String error = data.get(2).asRawValue().getString();
                    Log.e(TAG, "Lifecycle: Got server error: " + error);
                    Utils.eventBusPost(new SayEvent(error, true));
                } else if (command.equals("version")) {
                    int versionExpected = 1;
                    int version = data.get(2).asIntegerValue().getInt();
                    if (version != versionExpected) {
                        Utils.eventBusPost(new SayEvent("Version mismatch!  Got " + version + " and expected " + versionExpected + ".  Visit wear script .com for information.", true));
                    }
                }
            }
            if (channel.equals(GIST_LIST_SYNC_CHAN)) {
                /*
                1. TODO: Remove old scripts
                2. Publish request to get each gist
                 */
                Log.d(TAG, "Gist:" + data.get(1).toString());
                gistSyncPending = data.get(1).asArrayValue().size();
                for (Value v : data.get(1).asArrayValue()) {
                    Value gistid = (Value) toMap(v).get("id");

                    if (gistid != null) {
                        Log.d(TAG, "GistID: " + gistid);
                        Utils.eventBusPost(new SendEvent("gist", "get", GIST_GET_SYNC_CHAN, gistid.asRawValue().getString()));
                    }
                }
            }
            Log.d(TAG, "Got Channel: " + channel);
            // HACK(brandyn): This isn't 100%, just until we normalize lib

            for (String testChannel : testChannels) {
                if (channel.startsWith(testChannel)) {
                    testHandler(data);
                    break;
                }
            }
            if (channel.equals(GIST_GET_SYNC_CHAN)) {
                /*
                1. Make directory for script
                2. Save script content
                 */
                Log.d(TAG, "GistGet:" + data.get(1).toString());
                TreeMap<String, Value> gist = toMap(data.get(1));
                TreeMap<String, Value> files = toMap(gist.get("files"));
                String gistid = gist.get("id").asRawValue().getString();
                for (Value v : files.values()) {
                    TreeMap<String, Value> file = toMap(v);
                    byte[] content = file.get("content").asRawValue().getByteArray();
                    String filename = file.get("filename").asRawValue().getString();
                    String pathCur = Utils.SaveData(content, "gists/" + gistid, false, filename);
                    Log.d(TAG, "File:" + filename + " : " + gistid);
                }
                // Shutdown after sync
                if (--gistSyncPending == 0)
                    Utils.eventBusPost(new ShutdownEvent());
            }
            // TODO: Specialize it for this group/device
            if (channel.startsWith("warph:")) {
                double h[] = new double[9];
                int cnt = 0;
                for (Value v : data.get(1).asArrayValue()) {
                    h[cnt++] = v.asFloatValue().getDouble();
                }
                Utils.eventBusPost(new WarpHEvent(h));
            }
            // BUG(brandyn): If the channel should go to a subchannel now it won't make it,
            // we should modify channel name before this call
            makeCall(channel, "'" + Base64.encodeToString(dataRaw, Base64.NO_WRAP) + "'");
        }

        @Override
        public void onDisconnect() {

        }
    }
}
