package com.dappervision.wearscript.dataproviders;

import android.content.Context;
import android.os.Handler;
import android.util.Log;

import com.dappervision.wearscript.managers.PebbleManager;
import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.util.PebbleDictionary;

import java.util.UUID;


public class PebbleEventReciever extends PebbleKit.PebbleDataReceiver{
    private static final String TAG = "PebbleEventReciever";

    private final static int CMD_KEY = 0x00;
    private final static int CMD_SELECT = 0x00;
    private final static int CMD_UP = 0x01;
    private final static int CMD_DOWN = 0x02;
    private final static int CMD_MULTI_SELECT = 0x03;

    private static final String SELECT = "SELECT";
    private static final String UP = "UP";
    private static final String DOWN = "DOWN";
    private static final String MULTI_SELECT = "MULTI_SELECT";


    private Handler mHandler;
    private PebbleManager mPebbleManager;


    public PebbleEventReciever(UUID PEBBLE_APP_UUID, PebbleManager pebbleManager) {
        super(PEBBLE_APP_UUID);
        mHandler = new Handler();
        mPebbleManager = pebbleManager;
    }

    @Override
    public void receiveData(final Context context, final int transactionId, final PebbleDictionary data) {
        final int cmd = data.getUnsignedInteger(CMD_KEY).intValue();

        mHandler.post(new Runnable() {
            @Override
            public void run() {
                // All data received from the Pebble must be ACK'd, otherwise you'll hit time-outs in the
                // watch-app which will cause the watch to feel "laggy" during periods of frequent
                // communication.
                PebbleKit.sendAckToPebble(context, transactionId);
                switch (cmd) {
                    case CMD_UP:
                        Log.v(TAG, UP);
                        mPebbleManager.onClick(UP);
                        break;
                    case CMD_DOWN:
                        Log.v(TAG, DOWN);
                        mPebbleManager.onClick(DOWN);
                        break;
                    case CMD_SELECT:
                        Log.v(TAG, SELECT);
                        mPebbleManager.onClick(SELECT);
                        break;
                    case CMD_MULTI_SELECT:
                        Log.v(TAG, MULTI_SELECT);
                        mPebbleManager.onClick(MULTI_SELECT);
                        break;
                    default:
                        break;
                }
            }
        });
    }
}
