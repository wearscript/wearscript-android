package com.dappervision.wearscript.managers;

import android.content.Intent;
import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.activities.QRActivity;
import com.dappervision.wearscript.jsevents.BarcodeEvent;
import com.dappervision.wearscript.jsevents.CallbackRegistration;

public class BarcodeManager extends Manager {
    public BarcodeManager(BackgroundService bs) {
        super(bs);
        reset();
    }

    public void onEvent(CallbackRegistration e) {
        if (e.getManager().equals(this.getClass())) {
            registerCallback(e.getEvent(), e.getCallback());
            startActivity();
        }
    }

    public void onEvent(BarcodeEvent e) {
        makeCall(e.getResult().getBytes(), e.getFormat());
    }

    public void makeCall(byte[] data, String format) {
        makeCall(format, String.format("'%s','%s'", Base64.encodeToString(data, Base64.NO_WRAP), format));
    }

    public void startActivity() {
        Intent dialogIntent = new Intent(service.getBaseContext(), QRActivity.class);
        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        service.getApplication().startActivity(dialogIntent);
    }

}
