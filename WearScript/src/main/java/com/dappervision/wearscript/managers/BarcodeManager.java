package com.dappervision.wearscript.managers;

import android.content.Intent;
import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.events.BarcodeEvent;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.ui.QRActivity;

import de.greenrobot.event.Subscribe;

public class BarcodeManager extends Manager {
    public static String QR_CODE = "QR_CODE";

    public BarcodeManager(BackgroundService bs) {
        super(bs);
        reset();
    }

    @Subscribe
    public void onEvent(CallbackRegistration e) {
        if (e.getManager().equals(this.getClass())) {
            registerCallback(e.getEvent(), e.getCallback());
            startActivity();
        }
    }

    @Subscribe
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
