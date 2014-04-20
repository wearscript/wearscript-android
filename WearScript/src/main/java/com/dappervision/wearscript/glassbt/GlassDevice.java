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
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class GlassDevice {

    private static GlassDevice mInstance = null;
    private static final UUID SECURE_UUID = UUID.fromString("F15CC914-E4BC-45CE-9930-CB7695385850");
    private static final String TAG = "GlassDevice";
    private String mac;
    private BluetoothSocket mSocket;
    private BluetoothAdapter mBluetoothAdapter;

    private final ExecutorService mWriteThread = Executors.newSingleThreadExecutor();
    private final Object STREAM_WRITE_LOCK = new Object();
    private List<GlassConnectionListener> mListeners = new ArrayList<GlassConnectionListener>();
    private GlassReaderThread mGlassReaderThread;

    private GlassDevice() {
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        Log.d(TAG, "Creating GlassDevice");
        if (mBluetoothAdapter == null) {
            Log.e(TAG, "No bluetooth");
            return;
        }
        if (!mBluetoothAdapter.isEnabled()) {
            Log.e(TAG, "Bluetooth is not enabled");
        }

        mac = findMac();
        if (mac == null || mac.length() < 1)
            throw new RuntimeException("No Glass Paired");
        Log.d(TAG, "Using " + mac);

        BluetoothDevice bluetoothDevice = mBluetoothAdapter.getRemoteDevice(mac);

        try {
            mSocket = bluetoothDevice.createRfcommSocketToServiceRecord(SECURE_UUID);

        } catch (IOException e) {
            Log.e(TAG, "Connect Error: ", e);
            return;
        }

        // Cancel discovery because it will slow down the connection
        mBluetoothAdapter.cancelDiscovery();

        try {
            // Connect the device through the socket. This will block
            // until it succeeds or throws an exception
            mSocket.connect();
            Log.i(TAG, "Socket connected");
        } catch (IOException connectException) {
            // Unable to connect; close the socket and get out
            Log.e(TAG, "Didn't connect");
            try {
                mSocket.close();
            } catch (IOException closeException) {
            }
            return;
        }

        //mGlassReaderThread = new GlassReaderThread(mSocket, mListeners);
        //mGlassReaderThread.start();

    }

    public static GlassDevice getInstance() {
        if (mInstance == null) {
            mInstance = new GlassDevice();
        }
        return mInstance;
    }

    public void close() {
        if (mSocket != null) {
            try {
                mSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "Disconnect Error: ", e);
            }
            mSocket = null;
        }
        mInstance = null;
    }

    public String findMac() {
        Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
        if (pairedDevices.size() > 0) {
            for (BluetoothDevice d : pairedDevices) {
                if (d.getAddress().startsWith("F8:8F:CA")) {
                    return d.getAddress();
                }
            }
        }
        Log.w(TAG, "No Glass paired");
        return null;
    }

    public static boolean hasInstance() {
        return mInstance != null;
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

    // Native Interface commands send to Glass

    public void swipeLeft() {
        writeAsync(GlassMessagingUtil.getSwipeLeftEvents());
    }

    public void swipeRight() {
        writeAsync(GlassMessagingUtil.getSwipeRightEvents());
    }

    public void swipeDown() {
        writeAsync(GlassMessagingUtil.getSwipeDownEvents());
    }

    public void tap() {
        writeAsync(GlassMessagingUtil.getTapEvents());
    }

    public void postMessage(String text) {
        writeAsync(GlassMessagingUtil.createTimelineMessage(text));
    }

    public void requestScreenshot() {
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
                Log.e(TAG, "Write Error:", e);
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
}

class GlassReaderThread extends Thread {
    private static final String TAG = "GlassReaderThread";
    private final BluetoothSocket mmSocket;
    private final InputStream mmInStream;
    private final OutputStream mmOutStream;
    private final List<GlassDevice.GlassConnectionListener> mListeners;

    public GlassReaderThread(BluetoothSocket socket, List<GlassDevice.GlassConnectionListener> listeners) {
        mmSocket = socket;
        mListeners = listeners;
        InputStream tmpIn = null;
        OutputStream tmpOut = null;

        // Get the input and output streams, using temp objects because
        // member streams are final
        try {
            tmpIn = socket.getInputStream();
            tmpOut = socket.getOutputStream();
        } catch (IOException e) {
            Log.e(TAG, "Streams broke");
        }

        mmInStream = tmpIn;
        mmOutStream = tmpOut;
    }

    public void run() {
        while (true) {
            try {
                InputStream inStream = mmSocket.getInputStream();
                Proto.Envelope envelope = (Proto.Envelope) GlassProtocol.readMessage(new Proto.Envelope(), inStream);
                if (envelope.screenshot == null) {
                    Log.i(TAG, "RX'd from Glass: " + envelope.toString());
                } else {
                    Log.i(TAG, "RX'd Screenshot from Glass");
                }
                if (envelope != null) {
                    synchronized (mListeners) {
                        for (GlassDevice.GlassConnectionListener listener : mListeners) {
                            listener.onReceivedEnvelope(envelope);
                        }
                    }
                }
            }catch (IOException e){
                Log.e(TAG, "IOException");
                e.printStackTrace();
                break;
            }

        }
    }

    ;
}
