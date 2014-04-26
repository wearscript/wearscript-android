package com.dappervision.wearscript.managers;

import android.app.Activity;
import android.content.Intent;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.os.FileObserver;
import android.os.Handler;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.WindowManager;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.ActivityResultEvent;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.events.CameraEvents;
import com.dappervision.wearscript.events.OpenCVLoadEvent;
import com.dappervision.wearscript.events.OpenCVLoadedEvent;
import com.dappervision.wearscript.events.SayEvent;
import com.dappervision.wearscript.events.StartActivityEvent;

import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class OpenCVManager extends Manager {
    private static final String TAG = "OpenCVManager";
    public static final String LOAD = "LOAD";
    public enum State {
        UNLOADED, LOADING, LOADED
    }
    private State state = State.UNLOADED;

    public OpenCVManager(BackgroundService bs) {
        super(bs);
        reset();
    }

    public void onEventBackgroundThread(OpenCVLoadEvent event) {
        synchronized (this) {
            loadOpenCV();
        }
    }

    public void setupCallback(CallbackRegistration r) {
        // Entry point for capturing photos/videos
        super.setupCallback(r);
        Log.d(TAG, "setupCallback");
        if (r.getEvent().equals(LOAD)) {
            loadOpenCV();
        }
    }

    public void callLoaded() {
        synchronized (this) {
            makeCall(LOAD, "");
            unregisterCallback(LOAD);
            Utils.eventBusPost(new OpenCVLoadedEvent());
        }
    }

    public void loadOpenCV() {
        synchronized (this) {
            if (state == State.LOADED) {
                Log.w(TAG, "Already Loaded: camflow");
                callLoaded();
                return;
            }
            if (state != State.UNLOADED) {
                return;
            }
            state = State.LOADING;
            BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(service) {
                @Override
                public void onManagerConnected(int status) {
                    switch (status) {
                        case LoaderCallbackInterface.SUCCESS: {
                            Log.i(TAG, "Lifecycle: OpenCV loaded successfully: camflow");
                            synchronized (this) {
                                state = State.LOADED;
                                callLoaded();
                            }
                        }
                        break;
                        default: {
                            super.onManagerConnected(status);
                        }
                        break;
                    }
                }
            };
            try {
                OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, service, mLoaderCallback);
            } catch (WindowManager.BadTokenException e) {
                Log.w(TAG, "OpenCV apk not installed");
                Utils.eventBusPost(new SayEvent("Please install open CV.  See wearscript.com for details"));
            }
        }
    }
}
