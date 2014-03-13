package com.dappervision.wearscript.managers;

import android.content.Context;
import android.content.IntentFilter;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.dataproviders.EyeEventReceiver;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.google.android.glass.eye.EyeGesture;
import com.google.android.glass.eye.EyeGestureManager;

import java.util.TreeMap;
import java.util.TreeSet;

public class EyeManager extends Manager {
    private final EyeGestureManager eyeGestureManager;
    private final EyeGestureDetector detector;
    private final EyeEventReceiver eyeEventReceiver;
    private boolean isSetup;
    private TreeSet<Integer> detectorState;
    private boolean systemWide;

    public EyeManager(Context activity, BackgroundService bs) {
        super(bs);
        detectorState = new TreeSet<Integer>();
        systemWide = true;
        isSetup = false;
        detector = new EyeGestureDetector(this);
        eyeGestureManager = EyeGestureManager.from(activity);
        eyeEventReceiver = new EyeEventReceiver(detector);
        initial();
        reset();
    }

    public void onEvent(CallbackRegistration r) {
        if (r.getManager().equals(this.getClass()) && !isSetup) {
            setup(systemWide);
            isSetup = true;
        }
        super.onEvent(r);
    }

    private void teardown() {
        if (!isSetup)
            return;
        isSetup = false;
        if (!detectorState.contains(EyeGesture.WINK.getId()))
            eyeGestureManager.stopDetector(EyeGesture.WINK);
        if (!detectorState.contains(EyeGesture.DOUBLE_WINK.getId()))
            eyeGestureManager.stopDetector(EyeGesture.DOUBLE_WINK);
        if (!detectorState.contains(EyeGesture.DOUBLE_BLINK.getId())) {
            Log.d(TAG, "Stopping double_blink");
            eyeGestureManager.stopDetector(EyeGesture.DOUBLE_BLINK);
        }
        if (!detectorState.contains(EyeGesture.DOFF.getId()))
            eyeGestureManager.stopDetector(EyeGesture.DOFF);
        if (!detectorState.contains(EyeGesture.DON.getId()))
            eyeGestureManager.stopDetector(EyeGesture.DON);
        try {
            service.getApplicationContext().unregisterReceiver(eyeEventReceiver);
        } catch (IllegalArgumentException e) {
            Log.e(TAG, "Could not unregister receiver");
        }
    }

    private void initial() {
        if (eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.WINK))
            detectorState.add(EyeGesture.WINK.getId());
        if (eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DOUBLE_WINK))
            detectorState.add(EyeGesture.DOUBLE_WINK.getId());
        if (eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DOUBLE_BLINK))
            detectorState.add(EyeGesture.DOUBLE_BLINK.getId());
        if (eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DOFF))
            detectorState.add(EyeGesture.DOFF.getId());
        if (eyeGestureManager.isDetectorPersistentlyEnabled(EyeGesture.DON))
            detectorState.add(EyeGesture.DON.getId());
        for (Integer id : detectorState)
            Log.d(TAG, "State: " + id);
    }

    private void setup(boolean systemWide) {
        if (isSetup)
            return;
        if (systemWide) {
            eyeGestureManager.enableDetectorPersistently(EyeGesture.WINK, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DOUBLE_WINK, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DOUBLE_BLINK, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DOFF, true);
            eyeGestureManager.enableDetectorPersistently(EyeGesture.DON, true);
        } else {
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
