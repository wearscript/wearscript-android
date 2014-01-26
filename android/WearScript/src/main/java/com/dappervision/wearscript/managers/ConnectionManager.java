package com.dappervision.wearscript.managers;

import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.WearScriptConnection;
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

import org.msgpack.MessagePack;
import org.msgpack.type.Value;

import java.util.List;

public class ConnectionManager extends Manager {
    public static final String SENSORS_SUBCHAN = "sensors";
    public static final String IMAGE_SUBCHAN = "image";
    private static final String TAG = "ConnectionManager";
    private static final String ONCONNECT = "ONCONNECT";
    private static final String LISTEN_CHAN = "subscriptions";
    MessagePack msgpack = new MessagePack();
    private WearScriptConnectionImpl connection;


    public ConnectionManager(BackgroundService bs) {
        super(bs);
        connection = new WearScriptConnectionImpl();
        reset();
    }

    public void reset() {
        synchronized (this) {
            // TODO(brandyn): For each script channel unsubscribe
            for (String channel : connection.channelsInternal()) {
                unregisterCallback(channel);
            }
            connection.unsubscribe(connection.channelsInternal());
            connection.subscribe(connection.group());
            connection.subscribe(connection.groupDevice());
        }
        super.reset();
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
            connection.shutdown();
        }
    }

    public String subchannel(String sensorsSubchan) {
        return connection.subchannel(sensorsSubchan);
    }

    public boolean exists(String channel) {
        return connection.exists(channel);
    }

    class WearScriptConnectionImpl extends WearScriptConnection {

        @Override
        public void onConnect() {
            makeCall(ONCONNECT, "");
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
                        if (name.equals("glass.html"))
                            path = pathCur;
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
                } else if (channel.equals("raven")) {
                    Log.setDsn(data.get(1).asRawValue().getString());
                }
            }
            makeCall(channel, Base64.encodeToString(dataRaw, Base64.NO_WRAP));
        }

        @Override
        public void onDisconnect() {

        }
    }
}
