package com.dappervision.wearscript.managers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.activities.QRActivity;
import com.dappervision.wearscript.jsevents.BarcodeCallbackEvent;

import de.greenrobot.event.EventBus;

public class BarcodeManager extends Manager {
    public BarcodeManager(BackgroundService bs) {
        super(bs);
        IntentFilter QRIntentFilter = new IntentFilter(QRActivity.ACTION_RESULT);
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String format = intent.getStringExtra("SCAN_RESULT_FORMAT");
                String contents = intent.getStringExtra("SCAN_RESULT");
                makeCall(contents.getBytes(), format);
            }
        };
        LocalBroadcastManager.getInstance(service).registerReceiver(receiver, QRIntentFilter);

       EventBus.getDefault().register(this);
    }

    public void onEvent(BarcodeCallbackEvent e){
        registerCallback(e.getType(), e.getCallback());
        startActivity();
    }

    public void makeCall(byte[] data, String format) {
        makeCall(format, Base64.encodeToString(data, Base64.NO_WRAP) + "," + format);
    }

    public void startActivity() {
        Intent dialogIntent = new Intent(service.getBaseContext(), QRActivity.class);
        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        service.getApplication().startActivity(dialogIntent);
    }

}
