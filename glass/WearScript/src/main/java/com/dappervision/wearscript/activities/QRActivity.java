package com.dappervision.wearscript.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

public class QRActivity extends Activity {
    private static final String TAG = "QRActivity";
    public static final String ACTION_RESULT = "QRResults";

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
                Log.d(TAG, "Sending QR broadcast");
                intent.setAction(ACTION_RESULT);
                LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
            }
        }
        finish();
    }
}
