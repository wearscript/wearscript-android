package com.dappervision.wearscript;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Base64;

import com.dappervision.wearscript.jsevents.QREvent;

import de.greenrobot.event.EventBus;

public class QRManager extends Manager{
    private String callback;

    QRManager(BackgroundService bs) {
        super(bs);
        IntentFilter QRIntentFilter = new IntentFilter(QRActivity.ACTION_RESULT);
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String format = intent.getStringExtra("SCAN_RESULT_FORMAT");
                String contents = intent.getStringExtra("SCAN_RESULT");
                processResults(contents.getBytes(), format);
            }
        };
        LocalBroadcastManager.getInstance(service).registerReceiver(receiver, QRIntentFilter);

       EventBus.getDefault().register(this);
    }

    public void onEvent(QREvent e){
        registerCallback(e.getCallback());
        startActivity();
    }

    public void registerCallback(String cb) {
        callback = cb;
    }

    public void processResults(byte[] data, String format) {
        if (callback != null && service.webview != null)
            service.webview.loadUrl(String.format("javascript:%s(\"%s\",\"%s\");",
                    callback, Base64.encodeToString(data, Base64.NO_WRAP), format));
    }

    public void startActivity() {
        Intent dialogIntent = new Intent(service.getBaseContext(), QRActivity.class);
        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        service.getApplication().startActivity(dialogIntent);
    }

}
