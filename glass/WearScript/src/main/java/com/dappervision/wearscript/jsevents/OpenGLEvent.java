package com.dappervision.wearscript.jsevents;

import android.opengl.GLES20;
import android.util.Log;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.concurrent.Semaphore;

public class OpenGLEvent {
    String TAG = "OpenGLEvent";
    Method method;
    Object[] args;
    Object returnValue;
    boolean done;
    boolean ret;
    Semaphore semaphore;

    public OpenGLEvent() {
        done = true;
    }

    public OpenGLEvent(String command) {
    }

    public OpenGLEvent(Method m, boolean ret, Object... a) {
        method = m;
        args = a;
        this.ret = ret;
        done = false;
        semaphore = new Semaphore(1);
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public boolean isDone() {
        return done;
    }

    public boolean hasReturn() {
        return ret;
    }

    public Object getReturn() {
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            // TODO(brandyn): Return error
        }
        return returnValue;
    }

    public void execute() {
        try {
            try {
                returnValue = method.invoke(GLES20.class, args);
            } catch (IllegalArgumentException e) {
                Log.e(TAG, String.format("IllegalArgumentException: %s %d: %s", method.getName(), args.length, e.getLocalizedMessage()));
                // TODO(brandyn): Shutdown loop here
                return;
            }
            semaphore.release();
        } catch (IllegalAccessException e) {
            Log.w(TAG, "Illegal access");
        } catch (InvocationTargetException e) {
            Log.w(TAG, "Bad invocation target");
        }
    }
}