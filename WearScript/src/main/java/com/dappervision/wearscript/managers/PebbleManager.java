package com.dappervision.wearscript.managers;

import android.content.Context;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.dataproviders.PebbleEventReceiver;
import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.util.PebbleDictionary;

import java.util.UUID;

public class PebbleManager extends Manager{
    private static final String TAG = "PebbleManager";
    private static final String CLICK = "onPebbleClick";

    private final static UUID PEBBLE_APP_UUID = UUID.fromString("88c99af8-9512-4e23-b79e-ba437c788446");

    private PebbleEventReceiver dataReceiver;

    public PebbleManager(Context activity, BackgroundService bs) {
        super(bs);
        dataReceiver = new PebbleEventReceiver(PEBBLE_APP_UUID, this);
        PebbleKit.registerReceivedDataHandler(activity, dataReceiver);
    }

    public void onPebbleClick(String button) {
        registerCallback(CLICK, CLICK);
        makeCall("onPebbleClick", String.format("'%s'", button));
    }

}
