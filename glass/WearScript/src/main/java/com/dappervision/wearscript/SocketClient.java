package com.dappervision.wearscript;

import com.codebutler.android_websockets.WebSocketClient;

import org.apache.http.message.BasicNameValuePair;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

public class SocketClient {
    private WebSocketClient client;
    private SocketListener listener;
    private String callback;
    private URI uri;
    private boolean connected;

    SocketClient(URI uri, SocketListener listener, String callback) {
        this.listener = listener;
        this.uri = uri;
        List<BasicNameValuePair> extraHeaders = Arrays.asList();
        client = new WebSocketClient(uri, new LocalListener(listener), extraHeaders);
    }

    public boolean isConnected() {
        return connected;
    }

    public void send(String payload) {
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
        }

        @Override
        public void onMessage(String s) {
            parent.onSocketMessage(s);
        }

        @Override
        public void onDisconnect(int i, String s) {
            connected = false;
            parent.onSocketDisconnect(i, s);
        }

        @Override
        public void onError(Exception e) {
            parent.onSocketError(e);
        }

        @Override
        public void onMessage(byte[] arg0) {
            // unused
        }
    }
}
