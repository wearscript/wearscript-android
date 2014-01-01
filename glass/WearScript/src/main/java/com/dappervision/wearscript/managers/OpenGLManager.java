package com.dappervision.wearscript.managers;

import android.opengl.GLES20;
import android.opengl.GLSurfaceView;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.jsevents.OpenGLEvent;
import com.dappervision.wearscript.jsevents.OpenGLRenderEvent;

import java.util.concurrent.LinkedBlockingQueue;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public class OpenGLManager extends Manager {
    public static final String OPENGL_DRAW_CALLBACK = "DRAW_CALLBACK";
    LinkedBlockingQueue<OpenGLEvent> openglCommandQueue;
    private GLSurfaceView glView;

    public OpenGLManager(BackgroundService bs) {
        super(bs);
        // TODO(brandyn): OpenGL state is not cleared between reset(),
        // need to fix Looper.prepare issue since we may not have an activity and reset()
        // is called in BS's shutdown()
        glView = new GLSurfaceView(service);
        glView.setEGLContextClientVersion(2);
        glView.setPreserveEGLContextOnPause(true);
        glView.setRenderer(new ClearRenderer());
        glView.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        reset();
    }

    @Override
    public void reset() {
        super.reset();
        openglCommandQueue = new LinkedBlockingQueue<OpenGLEvent>();
    }

    protected void registerCallback(String type, String jsFunction) {
        super.registerCallback(type, jsFunction);
        glView.requestRender();
    }

    public GLSurfaceView getView() {
        return glView;
    }

    public void onEvent(OpenGLEvent event) {
        try {
            openglCommandQueue.put(event);
        } catch (InterruptedException e) {
            // TODO(brandyn): Handle
        }
    }

    public void onEvent(OpenGLRenderEvent event) {
        glView.requestRender();
    }

    class ClearRenderer implements GLSurfaceView.Renderer {
        public void onSurfaceCreated(GL10 gl, EGLConfig config) {
            // Do nothing special.
            Log.d(TAG, "OpenGL onSurfaceCreated");
        }

        public void onSurfaceChanged(GL10 gl, int w, int h) {
            GLES20.glViewport(0, 0, w, h);
        }

        public void onDrawFrame(GL10 gl) {
            Log.d(TAG, "OpenGL onDrawFrame");
            if (jsCallbacks.containsKey(OPENGL_DRAW_CALLBACK))
                makeCall(OPENGL_DRAW_CALLBACK, "");
            OpenGLEvent statement;
            while (true) {
                try {
                    statement = (OpenGLEvent) openglCommandQueue.take();
                } catch (InterruptedException e) {
                    // TODO(brandyn): Handle
                    break;
                }
                if (statement.isDone()) {
                    Log.d(TAG, "OpenGL Done");
                    break;
                }
                statement.execute();
            }
        }
    }
}
