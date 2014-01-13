package com.dappervision.wearscript.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.jsevents.BarcodeEvent;

public class QRActivity extends Activity {
    private static final String TAG = "QRActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = new Intent("com.google.zxing.client.android.SCAN");
        startActivityForResult(intent, 0);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == 0) {
            if (resultCode == RESULT_OK) {
                Utils.eventBusPost(new BarcodeEvent(intent.getStringExtra("SCAN_RESULT_FORMAT"), intent.getStringExtra("SCAN_RESULT")));
            }
        }
        finish();
    }
}
