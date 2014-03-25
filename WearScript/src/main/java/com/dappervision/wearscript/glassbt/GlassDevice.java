package com.dappervision.wearscript.glassbt;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.util.Log;

import com.google.glass.companion.CompanionMessagingUtil;
import com.google.glass.companion.GlassProtocol;
import com.google.glass.companion.Proto;

import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class GlassDevice {

    private static GlassDevice mInstance = null;
    private static final UUID SECURE_UUID = UUID.fromString("F15CC914-E4BC-45CE-9930-CB7695385850");
    private static final String TAG = "GlassDevice";
    private final String mac;
    private BluetoothSocket mSocket;
    private BluetoothAdapter mBluetoothAdapter;

    private final ExecutorService mWriteThread = Executors.newSingleThreadExecutor();
    private final Object STREAM_WRITE_LOCK = new Object();
    private List<GlassConnectionListener> mListeners = new ArrayList<GlassConnectionListener>();
    private GlassReaderThread mGlassReaderThread;

    /*
     * Private initializer
     * Currently connects to hard-coded Glass device (TODO - make this better)
     */
    private GlassDevice(){
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        mac = findMac();
        // TODO - enable searching for and listing Glass Devices
        BluetoothDevice bluetoothDevice = mBluetoothAdapter.getRemoteDevice(mac);
        try {
            mSocket = bluetoothDevice.createRfcommSocketToServiceRecord(SECURE_UUID);
            mSocket.connect();
        } catch (IOException e) {
            Log.e(TAG, "Connect Error: ", e);
        }

        // Spin up the thread to read messages from Glass
        // TODO: Check for problems starting the thread
        mGlassReaderThread = new GlassReaderThread();
        mGlassReaderThread.start();

    }

    public static GlassDevice getInstance(){
        if(mInstance == null){
            mInstance = new GlassDevice();
        }
        return mInstance;
    }

    public void close(){
        try {
            mSocket.close();
        } catch (IOException e){
            Log.e(TAG, "Disconnect Error: ", e);
        }

    }

    public String findMac() {
        for(BluetoothDevice d : mBluetoothAdapter.getBondedDevices()){
            if(d.getAddress().startsWith("F8:8F:CA"))
                return d.getAddress();
        }
        return null;
    }

    public interface GlassConnectionListener {

        public abstract void onReceivedEnvelope(Proto.Envelope envelope);

    }

    public void registerListener(GlassConnectionListener glassConnectionListener) {
        if (glassConnectionListener == null) {
            return;
        }
        synchronized (mListeners) {
            final int size = mListeners.size();
            for (int i = 0; i < size; i++) {
                GlassConnectionListener listener = mListeners.get(i);
                if (listener == glassConnectionListener) {
                    return;
                }
            }
            this.mListeners.add(glassConnectionListener);
        }
    }

    public void unregisterListener(GlassConnectionListener glassConnectionListener) {
        if (glassConnectionListener == null) {
            return;
        }
        synchronized (mListeners) {
            final int size = mListeners.size();
            for (int i = 0; i < size; i++) {
                GlassConnectionListener listener = mListeners.get(i);
                if (listener == glassConnectionListener) {
                    mListeners.remove(i);
                    break;
                }
            }
        }
    }


    // Start search for Glass Devices
    public void startSearch(){

    }

    // Native Interface commands send to Glass

    public void swipeLeft(){
        writeAsync(GlassMessagingUtil.getSwipeLeftEvents());
    }

    public void swipeRight(){
        writeAsync(GlassMessagingUtil.getSwipeRightEvents());
    }

    public void swipeDown(){
        writeAsync(GlassMessagingUtil.getSwipeDownEvents());
    }

    public void tap(){
        writeAsync(GlassMessagingUtil.getTapEvents());
    }

    public void postMessage(String text){
        writeAsync(GlassMessagingUtil.createTimelineMessage(text));
    }

    public void requestScreenshot(){
        Proto.Envelope envelope = CompanionMessagingUtil.newEnvelope();
        Proto.ScreenShot screenShot = new Proto.ScreenShot();
        screenShot.startScreenshotRequestC2G = true;
        envelope.screenshot = screenShot;
        writeAsync(envelope);
    }



    public void write(Proto.Envelope envelope) {
        synchronized (STREAM_WRITE_LOCK) {
            try {
                OutputStream outStream = mSocket.getOutputStream();
                if (mSocket != null) {
                    GlassProtocol.writeMessage(envelope, outStream);
                }
            } catch (IOException e) {
                Log.e(TAG,"Write Error:",e);
            }
        }
    }

    public void writeAsync(final Proto.Envelope envelope) {
        mWriteThread.execute(new Runnable() {
            @Override
            public void run() {
                write(envelope);
            }
        });
    }

    public void writeAsync(final List<Proto.Envelope> envelopes) {
        mWriteThread.execute(new Runnable() {
            @Override
            public void run() {
                for (Proto.Envelope envelope : envelopes) {
                    write(envelope);
                }
            }
        });
    }

    private class GlassReaderThread extends Thread {
        public void run() {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    try {
                        InputStream inStream = mSocket.getInputStream();
                        Proto.Envelope envelope = (Proto.Envelope) GlassProtocol.readMessage(new Proto.Envelope(), inStream);
                        if (envelope.screenshot == null) {
                            Log.i(TAG,"RX'd from Glass: "+envelope.toString());
                        }
                        else{
                            Log.i(TAG,"RX'd Screenshot from Glass");
                        }
                        if (envelope != null) {
                            synchronized (mListeners) {
                                for (GlassConnectionListener listener : mListeners) {
                                    listener.onReceivedEnvelope(envelope);
                                }
                            }
                        }
                    } catch (InterruptedIOException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
                Log.i(TAG,"Reader Thread Finished");
            } catch (IOException e) {
                e.printStackTrace();
            }
        };
    };



}
