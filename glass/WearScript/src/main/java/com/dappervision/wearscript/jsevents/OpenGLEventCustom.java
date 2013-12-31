package com.dappervision.wearscript.jsevents;

import android.opengl.GLES20;
import android.util.Log;

import java.lang.reflect.InvocationTargetException;

public class OpenGLEventCustom extends OpenGLEvent {
    String customCommand;

    public OpenGLEventCustom(String name, boolean ret, Object... a) {
        super(null, ret, a);
        customCommand = name;
    }
    public void execute() {
        Log.d(TAG, "Custom command: " + customCommand);
        if (customCommand.equals("glCreateBuffer")) {
            int array[] = new int[1];
            GLES20.glGenBuffers(1, array, 0);
            returnValue = array[0];
        } else {
            Log.e(TAG, "Unknown custom command: " + customCommand);
        }
        semaphore.release();
    }
}
