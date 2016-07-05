package com.dappervision.wearscript.managers;

import android.content.Context;
import android.view.MotionEvent;

import com.dappervision.wearscript.BackgroundService;
import com.google.android.glass.touchpad.Gesture;
import com.google.android.glass.touchpad.GestureDetector;

import de.greenrobot.event.Subscribe;

public class GestureManager extends Manager {
    private static final String TAG = "GestureManager";
    private MyGestureDetector detector;

    public GestureManager(Context activity, BackgroundService bs) {
        super(bs);
        detector = new MyGestureDetector(this, activity);
        reset();
    }

    @Subscribe
    public void onEvent(MotionEvent e) {
        detector.onMotionEvent(e);
    }
}

class MyGestureDetector extends GestureDetector implements GestureDetector.BaseListener, GestureDetector.FingerListener, GestureDetector.ScrollListener, GestureDetector.TwoFingerScrollListener {
    private static final String TAG = "MyGestureDetector";
    private GestureManager parent;

    MyGestureDetector(GestureManager parent, Context context) {
        super(context);
        this.parent = parent;
        setBaseListener(this);
        setFingerListener(this);
        setScrollListener(this);
        setTwoFingerScrollListener(this);
    }

    @Override
    public boolean onGesture(Gesture gesture) {
        parent.makeCall("onGesture", String.format("'%s'", gesture.name()));
        parent.makeCall("onGesture" + gesture.name(), "");
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
}



