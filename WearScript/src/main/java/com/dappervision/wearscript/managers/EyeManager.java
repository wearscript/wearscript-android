package com.dappervision.wearscript.managers;

import android.content.Context;
import android.content.IntentFilter;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.dataproviders.EyeEventReceiver;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.google.android.glass.eye.EyeGesture;
import com.google.android.glass.eye.EyeGestureManager;

public class EyeManager extends Manager {
    private final EyeGestureManager eyeGestureManager;
    private final EyeGestureDetector detector;
    private final EyeEventReceiver eyeEventReceiver;
    private boolean[] detectorState = new boolean[5];
    private boolean systemWide;

    public EyeManager(Context activity, BackgroundService bs) {
        super(bs);
        systemWide = false;
        detector = new EyeGestureDetector(this);
        eyeGestureManager = EyeGestureManager.from(activity);
        eyeEventReceiver = new EyeEventReceiver(detector);
        reset();
    }

    private void teardown() {
        if(!detectorState[EyeGesture.DOFF.getId()])
            eyeGestureManager.stopDetector(EyeGesture.DOFF);
        if(!detectorState[EyeGesture.DON.getId()])
            eyeGestureManager.stopDetector(EyeGesture.DON);
        if(!detectorState[EyeGesture.WINK.getId()])
            eyeGestureManager.stopDetector(EyeGesture.WINK);
        if(!detectorState[EyeGesture.DOUBLE_WINK.getId()])
            eyeGestureManager.stopDetector(EyeGesture.DOUBLE_WINK);
        if(!detectorState[EyeGesture.DOUBLE_BLINK.getId()])
            eyeGestureManager.stopDetector(EyeGesture.DOUBLE_BLINK);

        try {
            service.getApplicationContext().unregisterReceiver(eyeEventReceiver);
        } catch (IllegalArgumentException e) {
            //we were not registered
        }
    }

    private void setup(boolean systemWide){
        detectorState[EyeGesture.DOFF.getId()] = eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DOFF);
        detectorState[EyeGesture.DON.getId()] = eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DON);
        detectorState[EyeGesture.WINK.getId()] = eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.WINK);
        detectorState[EyeGesture.DOUBLE_WINK.getId()] = eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DOUBLE_WINK);
        detectorState[EyeGesture.DOUBLE_BLINK.getId()] = eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DOUBLE_BLINK);

        if(systemWide){
            eyeGestureManager.enableDetectorPersistently(EyeGesture.WINK, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DOUBLE_WINK, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DOUBLE_BLINK, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DOFF, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DON, true);
        }else {
            eyeGestureManager.startDetector(EyeGesture.WINK, true);
            eyeGestureManager.startDetector(EyeGesture.DOUBLE_WINK, true);
            eyeGestureManager.startDetector(EyeGesture.DOUBLE_BLINK, true);
            eyeGestureManager.startDetector(EyeGesture.DOFF, true);
            eyeGestureManager.startDetector(EyeGesture.DON, true);
        }

        IntentFilter eyeFilter;
        eyeFilter = new IntentFilter(
                "com.google.glass.action.EYE_GESTURE");
        service.getApplicationContext().registerReceiver(eyeEventReceiver, eyeFilter);
        eyeFilter = new IntentFilter(
                "com.google.glass.action.DON_STATE");
        service.getApplicationContext().registerReceiver(eyeEventReceiver, eyeFilter);
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
        setup(systemWide);
    }
}

class EyeGestureDetector implements EyeEventReceiver.BaseListener {
    private final EyeManager parent;
    private final EyeEventReceiver eyeEventReciever;

    EyeGestureDetector(EyeManager parent) {
        this.parent = parent;
        this.eyeEventReciever = new EyeEventReceiver(this);
    }

    @Override
    public void onEyeGesture(EyeGesture gesture) {
        parent.makeCall("onEyeGesture", String.format("'%s'", gesture.name()));
    }
}
