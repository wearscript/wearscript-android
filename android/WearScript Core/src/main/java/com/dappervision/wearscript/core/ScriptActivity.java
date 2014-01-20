package com.dappervision.wearscript.core;

import android.app.Activity;
import android.content.ServiceConnection;
import android.os.Bundle;

public abstract class ScriptActivity extends Activity {
    protected static final String TAG = "ScriptActivity";
    public ScriptService bs;
    protected ServiceConnection mConnection;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.register(this);
        Utils.getEventBus().register(this);
        Log.i(TAG, "Lifecycle: Activity onCreate");
    }
}
