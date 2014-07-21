package com.dappervision.wearscript.managers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.events.CallbackRegistration;

public class EyeManager extends Manager {
    private static final String ACTION_ON_HEAD_STATE_CHANGED = "com.google.android.glass.action.ON_HEAD_STATE_CHANGED";
    private boolean isSetup;

    public EyeManager(BackgroundService bs) {
        super(bs);
        isSetup = false;
        reset();
    }

    public void onEvent(CallbackRegistration r) {
        if (r.getManager().equals(this.getClass()) && !isSetup) {
            setup();
            isSetup = true;
        }
        super.onEvent(r);
    }

    private void teardown() {
        if (!isSetup)
            return;
        isSetup = false;
    }

    private void setup() {
        if (isSetup)
            return;
        IntentFilter eyeFilter = new IntentFilter(ACTION_ON_HEAD_STATE_CHANGED);
        service.getApplicationContext().registerReceiver(new OnHeadChangedReceiver(this), eyeFilter);
    }

    @Override
    public void shutdown() {
        super.shutdown();
        teardown();
    }

    @Override
    public void reset() {
        super.reset();
        teardown();
    }
}

class OnHeadChangedReceiver extends BroadcastReceiver {
    private static final String EXTRA_IS_ON_HEAD = "is_on_head";
    private final Manager mParent;

    OnHeadChangedReceiver(Manager parent){
        mParent = parent;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        boolean onHead = intent.getBooleanExtra(EXTRA_IS_ON_HEAD, false);
        mParent.makeCall("onHead", onHead ? "true" : "false");
    }
}
