package com.dappervision.wearscript;

import android.util.Log;

import com.codebutler.android_websockets.WebSocketClient;

import org.apache.http.message.BasicNameValuePair;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SocketClient {
    private WebSocketClient client;
    private SocketListener listener;
    private String callback;
    private boolean connected;
    private boolean enabled;
    private ConcurrentLinkedQueue<String> stringBacklog;
    private ConcurrentLinkedQueue<byte[]> byteBacklog;
    private static List<BasicNameValuePair> extraHeaders = Arrays.asList();

    SocketClient(URI uri, SocketListener listener, String callback) {
        this.listener = listener;
        this.connected = false;
        this.enabled = false;
        this.callback = callback;
        this.stringBacklog = new ConcurrentLinkedQueue<String>();
        this.byteBacklog = new ConcurrentLinkedQueue<byte[]>();
        setURI(uri);
        client = new WebSocketClient(uri, new LocalListener(listener), extraHeaders);
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setURI(URI uri) {
        flush();
        disable();
        client = new WebSocketClient(uri, new LocalListener(listener), extraHeaders);
    }
    public void send(String payload) {
        if(!enabled)
            throw new RuntimeException("Socket not enabled");
        else if(connected)
            client.send(payload);
        else
            stringBacklog.add(payload);
    }

    public void send(byte[] payload) {
        if(!enabled)
            throw new RuntimeException("Socket not enabled");
        else if(connected)
            client.send(payload);
        else
            byteBacklog.add(payload);
    }

    public void disable() {
        if(!enabled)
            return;
        enabled = false;
        client.disconnect();
        squash();
    }

    public void enable() {
        if(enabled)
            return;
        enabled = true;
        client.connect();
    }

    public SocketListener getListener() {
        return listener;
    }

    public void reconnect() {
        Log.w(BackgroundService.TAG, "Reconnecting socket");

        if(!enabled)
            throw new RuntimeException("Socket not enabled");
        new Thread(new Runnable() {
            public void run() {
                while (!client.isConnected()) {
                    client.connect();
                    try {
                        Thread.sleep(1500);
                    } catch (InterruptedException e) {
                    }
                }
                flush();
            }
        }).start();
    }

    private void flush() {
        Log.i(BackgroundService.TAG, "Flushing socket backlog of " + backlog_size());
        while(!stringBacklog.isEmpty()){
            client.send(stringBacklog.poll());
        }
        while(!byteBacklog.isEmpty()){
            client.send(byteBacklog.poll());
        }
    }

    private void squash() {
        Log.i(BackgroundService.TAG, "Squashing socket backlog of " + backlog_size());
        stringBacklog.clear();
        byteBacklog.clear();
    }

    private int backlog_size(){
        return byteBacklog.size() + stringBacklog.size();
    }

    interface SocketListener {
        public void onSocketConnect(String callback);
        public void onSocketDisconnect(int i, String s);
        public void onSocketMessage(byte[] message);
        public void onSocketMessage(String message);
        public void onSocketError(Exception e);
    }

    private class LocalListener implements WebSocketClient.Listener {
        private SocketListener parent;

        LocalListener(SocketListener parent) {
            this.parent = parent;
        }

        @Override
        public void onConnect() {
            connected = true;
            parent.onSocketConnect(callback);
            flush();
        }

        @Override
        public void onMessage(byte[] b) {
            parent.onSocketMessage(b);
        }

        @Override
        public void onMessage(String s) {
            parent.onSocketMessage(s);
        }

        @Override
        public void onDisconnect(int i, String s) {
            connected = false;
            Log.w(BackgroundService.TAG, "Underlying socket disconnected");
            parent.onSocketDisconnect(i, s);
        }

        @Override
        public void onError(Exception e) {
            parent.onSocketError(e);
            client.disconnect();
        }
    }
}
