package com.dappervision.wearscript.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.ShutdownEvent;

public class StopActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Utils.getEventBus().post(new ShutdownEvent());
        finish();
    }
}
