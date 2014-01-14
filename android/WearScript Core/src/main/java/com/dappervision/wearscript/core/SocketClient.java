package com.dappervision.wearscript.core;

import com.codebutler.android_websockets.WebSocketClient;

import org.apache.http.message.BasicNameValuePair;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

public class SocketClient {
    private static final String TAG = "SocketClient";
    private WebSocketClient client;
    private SocketListener listener;
    private String callback;
    private boolean shutdown;
    private URI uri;
    private boolean connected;

    public SocketClient(URI uri, SocketListener listener, String callback) {
        this.listener = listener;
        this.uri = uri;
        this.callback = callback;
        this.shutdown = false;
        List<BasicNameValuePair> extraHeaders = Arrays.asList();
        Log.i(TAG, "Lifecycle: Socket connecting");
        client = new WebSocketClient(uri, new LocalListener(listener), extraHeaders);
    }

    public boolean isConnected() {
        return connected;
    }

    public void send(String payload) {
        client.send(payload);
    }

    public void send(byte[] payload) {
        client.send(payload);
    }

    public void disconnect() {
        client.disconnect();
    }

    public SocketListener getListener() {
        return listener;
    }

    public void shutdown() {
        synchronized (this) {
            this.shutdown = true;
            disconnect();
        }
    }

    public void reconnect() {
        synchronized (this) {
            if (shutdown)
                return;
        }
        Log.w(TAG, "Lifecycle: Reconnecting socket");

        new Thread(new Runnable() {
            public void run() {
                synchronized (this) {
                    while (!client.isConnected() && !shutdown) {
                        client.connect();
                        try {
                            Thread.sleep(500);
                        } catch (InterruptedException e) {
                        }
                    }
                }
            }
        }).start();
    }

    public interface SocketListener {
        public void onSocketConnect(String callback);

        public void onSocketDisconnect(int i, String s);

        public void onSocketMessage(byte[] message);

        public void onSocketError(Exception e);
    }

    private class LocalListener implements WebSocketClient.Listener {
        private SocketListener parent;

        LocalListener(SocketListener parent) {
            this.parent = parent;
        }

        @Override
        public void onConnect() {
            if (shutdown)
                return;
            connected = true;
            Log.i(TAG, "Lifecycle: Calling server callback");
            parent.onSocketConnect(callback);
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
            parent.onSocketDisconnect(i, s);
        }

        @Override
        public void onError(Exception e) {
            Log.w(TAG, "Lifecycle: Underlying socket errored: " + e.getLocalizedMessage());
            if (shutdown)
                return;
            parent.onSocketError(e);
        }

        @Override
        public void onMessage(byte[] s) {
            if (shutdown)
                return;
            parent.onSocketMessage(s);
        }
    }
}