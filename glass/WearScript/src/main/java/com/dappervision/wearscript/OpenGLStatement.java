package com.dappervision.wearscript;

import android.opengl.GLES20;
import android.util.Log;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * Created by brandynwhite on 11/25/13.
 */
public class OpenGLStatement {
    String TAG = "OpenGLStatement";
    Method method;
    Object[] args;
    boolean done;
    boolean ret;
    OpenGLStatement() {
        done = true;
    }

    OpenGLStatement(Method m, boolean ret, Object... a) {
        method = m;
        args = a;
        this.ret = ret;
        done = false;
    }

    public boolean isDone() {
        return done;
    }

    public boolean hasReturn() {
        return ret;
    }

    public Object execute() {
        try {
            Log.i(TAG, method.getName());
            return method.invoke(GLES20.class, args);
        } catch (IllegalAccessException e) {
            Log.w(TAG, "Illegal access");
        } catch (InvocationTargetException e) {
            Log.w(TAG, "Bad invocation target");
        }
        Log.w(TAG, "Not returning anything");
        return null;
    }
}
