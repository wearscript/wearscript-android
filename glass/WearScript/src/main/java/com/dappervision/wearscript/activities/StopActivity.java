package com.dappervision.wearscript.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.dappervision.wearscript.BackgroundService;

public class StopActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        stopService(new Intent(this, BackgroundService.class));
        finish();
    }
}
