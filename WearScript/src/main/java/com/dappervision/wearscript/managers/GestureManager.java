package com.dappervision.wearscript.managers;

import android.content.Context;
import android.content.IntentFilter;
import android.view.MotionEvent;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.dataproviders.EyeEventReceiver;
import com.google.android.glass.eye.EyeGesture;
import com.google.android.glass.eye.EyeGestureManager;
import com.google.android.glass.touchpad.Gesture;
import com.google.android.glass.touchpad.GestureDetector;

public class GestureManager extends Manager {
    private static final String TAG = "GestureManager";
    private final EyeGestureManager eyeGestureManager;
    private final EyeEventReceiver eyeEventReceiver;
    private MyGestureDetector detector;

    public GestureManager(Context activity, BackgroundService bs) {
        super(bs);
        detector = new MyGestureDetector(this, activity);
        eyeGestureManager = EyeGestureManager.from(activity);
        eyeEventReceiver = new EyeEventReceiver(detector);
        reset();
    }

    public void onEvent(MotionEvent e) {
        detector.onMotionEvent(e);
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
        setup();
    }

    private void teardown(){
        eyeGestureManager.stopDetector(EyeGesture.DOFF);
        eyeGestureManager.stopDetector(EyeGesture.DON);
        eyeGestureManager.stopDetector(EyeGesture.WINK);
        eyeGestureManager.stopDetector(EyeGesture.DOUBLE_WINK);
        eyeGestureManager.stopDetector(EyeGesture.DOUBLE_BLINK);
        try{
        service.getApplicationContext().unregisterReceiver(eyeEventReceiver);
        }catch (IllegalArgumentException e){

        }
    }

    private void setup(){
        eyeGestureManager.enableDetectorPersistently(EyeGesture.WINK, true);
        eyeGestureManager.enableDetectorPersistently(EyeGesture.DOUBLE_WINK, true);
        eyeGestureManager.enableDetectorPersistently(EyeGesture.DOUBLE_BLINK, true);
        eyeGestureManager.enableDetectorPersistently(EyeGesture.DOFF, true);
        eyeGestureManager.enableDetectorPersistently(EyeGesture.DON, true);
        IntentFilter eyeFilter;
        eyeFilter = new IntentFilter(
                "com.google.glass.action.EYE_GESTURE");
        service.getApplicationContext().registerReceiver(eyeEventReceiver, eyeFilter);
        eyeFilter = new IntentFilter(
                "com.google.glass.action.DON_STATE");
        service.getApplicationContext().registerReceiver(eyeEventReceiver, eyeFilter);
    }
}

class MyGestureDetector extends GestureDetector implements EyeEventReceiver.BaseListener, GestureDetector.BaseListener, GestureDetector.FingerListener, GestureDetector.ScrollListener, GestureDetector.TwoFingerScrollListener {
    private static final String TAG = "MyGestureDetector";
    private final EyeEventReceiver eyeEventReciever;
    private GestureManager parent;

    MyGestureDetector(GestureManager parent, Context context) {
        super(context);
        this.parent = parent;
        this.eyeEventReciever = new EyeEventReceiver(this);
        setBaseListener(this);
        setFingerListener(this);
        setScrollListener(this);
        setTwoFingerScrollListener(this);

    }

    @Override
    public boolean onGesture(Gesture gesture) {
        parent.makeCall("onGesture", String.format("'%s'", gesture.name()));
        return false;
    }

    @Override
    public void onFingerCountChanged(int i, int i2) {
        parent.makeCall("onFingerCountChanged", String.format("%d, %d", i, i2));
    }

    @Override
    public boolean onScroll(float v, float v2, float v3) {
        parent.makeCall("onScroll", String.format("%f, %f, %f", v, v2, v3));
        return false;
    }

    @Override
    public boolean onTwoFingerScroll(float v, float v2, float v3) {
        parent.makeCall("onTwoFingerScroll", String.format("%f, %f, %f", v, v2, v3));
        return false;
    }

    @Override
    public void onEyeGesture(EyeGesture gesture) {
        parent.makeCall("onEyeGesture", String.format("'%s'", gesture.name()));
    }
}



