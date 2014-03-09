package com.google.android.glass.eye;

import android.content.Context;

public class EyeGestureManager {
    public static final int INFINITE_TIMEOUT = -1;
    public static final String SERVICE_NAME = "eye_gesture";

    public static EyeGestureManager from(Context paramContext) {
        return null;
    }

    public void activateGazeLogging(boolean paramBoolean) {
    }

    public boolean applyAndSaveCalibration(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean clearCalibration(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean enableDetectorPersistently(EyeGesture paramEyeGesture, boolean paramBoolean) {
        return false;
    }

    public boolean enableDetectorPersistently(EyeGesture paramEyeGesture, boolean paramBoolean1, boolean paramBoolean2) {
        return false;
    }

    public void enableGazeService(boolean paramBoolean) {
    }

    public boolean endCalibrationInterval(EyeGesture paramEyeGesture) {
        return false;
    }

    public void forceGlasshubResetHack() {
    }

    public boolean isCalibrationComplete(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean isDetectorPersistentlyEnabled(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean isDetectorRunning(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean isGazeLogging() {
        return false;
    }

    public boolean isSupported(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean loadCalibration(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean startCalibrationInterval(EyeGesture paramEyeGesture) {
        return false;
    }

    public boolean startDetector(EyeGesture paramEyeGesture, boolean paramBoolean) {
        return false;
    }

    public boolean startDetector(EyeGesture paramEyeGesture, boolean paramBoolean, int paramInt) {
        return false;
    }

    public boolean stopDetector(EyeGesture paramEyeGesture) {
        return false;
    }
}