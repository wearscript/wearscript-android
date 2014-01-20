package com.dappervision.wearscript.core.jsevents;

import android.content.Intent;

import com.dappervision.wearscript.core.jsevents.JSBusEvent;

public class ActivityResultEvent implements JSBusEvent {
    private int requestCode;
    private int resultCode;
    private Intent intent;


    public ActivityResultEvent(int requestCode, int resultCode, Intent intent) {
        this.requestCode = requestCode;
        this.resultCode = resultCode;
        this.intent = intent;
    }

    public int getRequestCode() {
        return requestCode;
    }

    public int getResultCode() {
        return resultCode;
    }

    public Intent getIntent() {
        return intent;
    }
}
