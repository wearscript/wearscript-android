package com.dappervision.wearscript;

import android.util.Log;

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
    private URI uri;
    private boolean connected;

    SocketClient(URI uri, SocketListener listener, String callback) {
        this.listener = listener;
        this.uri = uri;
        this.callback = callback;
        List<BasicNameValuePair> extraHeaders = Arrays.asList();
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

    public void connect() {
        client.connect();
    }

    public SocketListener getListener() {
        return listener;
    }

    public void reconnect() {
        Log.w(BackgroundService.TAG, "Reconnecting socket");

        new Thread(new Runnable() {
            public void run() {
                while (!client.isConnected()) {
                    client.connect();
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                    }
                }
            }
        }).start();
    }

    interface SocketListener {
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
            connected = false;
            Log.w(BackgroundService.TAG, "Underlying socket disconnected");
            parent.onSocketDisconnect(i, s);
        }

        @Override
        public void onError(Exception e) {
            parent.onSocketError(e);
        }

        @Override
        public void onMessage(byte[] s) {
            parent.onSocketMessage(s);
        }
    }
}
