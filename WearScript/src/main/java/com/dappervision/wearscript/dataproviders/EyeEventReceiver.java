package com.dappervision.wearscript.dataproviders;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.dappervision.wearscript.Log;
import com.google.android.glass.eye.EyeGesture;

public class EyeEventReceiver extends BroadcastReceiver {
    private static final String TAG = "EyeEventReceiver";

    private static final String WINK = "WINK";
    private static final String DON = "DON";
    private static final String DOFF = "DOFF";
    private static final String DOUBLE_BLINK = "DOUBLE_BLINK";
    private static final String DOUBLE_WINK = "DOUBLE_WINK";

    /**
     * An interface for a listener to capture wink and double blinks
     */
    public static interface BaseListener {
        public void onEyeGesture(EyeGesture gesture);
    }

    private BaseListener mListener;

    public EyeEventReceiver(BaseListener listener) {
        mListener = listener;
    }

    public void setEyeEventListener(BaseListener listener) {

        mListener = listener;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (mListener == null)
            return;
        Bundle extras = intent.getExtras();
        if (intent.getAction().equals("com.google.glass.action.DON_STATE")) {
            boolean don = extras.getBoolean("is_donned");
            Log.d(TAG, "DON detected: " + don);
            if (don) {
                mListener.onEyeGesture(EyeGesture.DON);
            } else {
                mListener.onEyeGesture(EyeGesture.DOFF);
            }
        } else {
            String eyeEvent = extras.getString("gesture");
            Log.d(TAG, eyeEvent + " is detected");
            if (eyeEvent.equals(WINK)) {
                mListener.onEyeGesture(EyeGesture.WINK);
            } else if (eyeEvent.equals(DOUBLE_BLINK)) {
                mListener.onEyeGesture(EyeGesture.DOUBLE_BLINK);
            } else if (eyeEvent.equals(DOUBLE_WINK)) {
                mListener.onEyeGesture(EyeGesture.DOUBLE_WINK);
            } else if (eyeEvent.equals(DON)) {
                mListener.onEyeGesture(EyeGesture.DON);
            } else if (eyeEvent.equals(DOFF)) {
                mListener.onEyeGesture(EyeGesture.DOFF);
            }
        }


        //abortBroadcast();
    }

}
