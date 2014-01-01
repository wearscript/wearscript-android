package com.dappervision.wearscript.managers;

import android.app.Activity;
import android.content.Intent;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.provider.MediaStore;
import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.jsevents.ActivityResultEvent;
import com.dappervision.wearscript.jsevents.CallbackRegistration;
import com.dappervision.wearscript.jsevents.CameraEvents;
import com.dappervision.wearscript.jsevents.OpenCVLoadedEvent;
import com.dappervision.wearscript.jsevents.StartActivityEvent;

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
import java.util.List;

public class CameraManager extends Manager implements Camera.PreviewCallback {
    private static final String TAG = "CameraManager";
    private static final int MAGIC_TEXTURE_ID = 10;
    public static final String LOCAL = "0";
    public static final String REMOTE = "1";
    public static final String PHOTO = "PHOTO";
    public static final String PHOTO_PATH = "PHOTO_PATH";
    public static final String VIDEO = "VIDEO";
    private Camera camera;
    private byte[] buffer;
    private SurfaceTexture surfaceTexture;
    private CameraFrame cameraFrame;
    private boolean paused;
    private long imagePeriod;
    private double lastImageSaveTime;
    private boolean openCVLoaded;

    public class CameraFrame {
        private MatOfByte jpgFrame;
        private String jpgB64;
        private boolean frameRGBSet;
        private Mat frameRGB;
        private Mat frame;

        CameraFrame(int width, int height) {
            jpgFrame = null;
            jpgB64 = null;
            frameRGBSet = false;
            frameRGB = new Mat(width, height, CvType.CV_8UC3);
            frame = new Mat(height + (height / 2), width, CvType.CV_8UC1);
        }

        void setFrame(byte[] data) {
            frame.put(0, 0, data);
            jpgFrame = null;
            frameRGBSet = false;
        }

        Mat getRGB() {
            if (frameRGBSet)
                return frameRGB;
            Imgproc.cvtColor(frame, frameRGB, Imgproc.COLOR_YUV2RGB_NV12);
            return frameRGB;
        }

        public byte[] getJPEG() {
            if (jpgFrame != null)
                return jpgFrame.toArray();
            Mat frameRGB = getRGB();
            jpgFrame = new MatOfByte();
            Highgui.imencode(".jpg", frameRGB, jpgFrame);
            return jpgFrame.toArray();
        }
    }

    public CameraManager(BackgroundService bs) {
        super(bs);
        reset();
    }

    public void setupCallback(CallbackRegistration r) {
        super.setupCallback(r);
        if (r.getEvent().equals(PHOTO) || r.getEvent().equals(PHOTO_PATH)) {
            cameraPhoto();
        } else if (r.getEvent().equals(VIDEO)) {
            cameraVideo();
        }
    }

    public void onEventAsync(OpenCVLoadedEvent event) {
        synchronized (this) {
            setupCamera();
        }
    }

    public void onEvent(CameraEvents.Start e) {
        imagePeriod = Math.round(e.getPeriod() * 1000000000L);
        lastImageSaveTime = 0.;

        if (imagePeriod > 0) {
            register();
        } else {
            shutdown();
        }
    }

    public void onEvent(ActivityResultEvent event) {
        int requestCode = event.getRequestCode(), resultCode = event.getResultCode();
        Intent intent = event.getIntent();
        Log.d(TAG, "Got request code: " + requestCode);
        if (requestCode == 1000) {
            resume();
            if (resultCode == Activity.RESULT_OK) {
                String pictureFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_PICTURE_FILE_PATH);
                String thumbnailFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_THUMBNAIL_FILE_PATH);
                Log.d(TAG, jsCallbacks.toString());
                if (jsCallbacks.containsKey(PHOTO) || jsCallbacks.containsKey(PHOTO_PATH)) {
                    byte imageData[] = null;
                    // TODO(brandyn): Change to use FileObserver
                    for (int i = 0; i < 100; i++) {
                        imageData = Utils.LoadFile(new File(pictureFilePath));
                        if (imageData == null) {
                            Log.w(TAG, "Waiting for photo...");
                            try {
                                Thread.sleep(250);
                            } catch (InterruptedException e) {
                            }
                        }
                    }
                    if (imageData == null)
                        return;
                    if (jsCallbacks.containsKey(PHOTO)) {
                        makeCall(PHOTO, imageData);
                        jsCallbacks.remove(PHOTO);
                    }
                    if (jsCallbacks.containsKey(PHOTO_PATH)) {
                        makeCall(PHOTO_PATH, "'" + pictureFilePath + "'");
                        jsCallbacks.remove(PHOTO_PATH);
                    }
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {

            }
        } else if (requestCode == 1001) {
            resume();
            if (resultCode == Activity.RESULT_OK) {
                String thumbnailFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_THUMBNAIL_FILE_PATH);
                String videoFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_VIDEO_FILE_PATH);
            } else if (resultCode == Activity.RESULT_CANCELED) {

            }
        }
    }

    public void reset() {
        stop();
        super.reset();
        lastImageSaveTime = 0.;
        imagePeriod = 0;
        paused = false;
    }

    public void shutdown() {
        reset();
        super.shutdown();
    }

    public void stop() {
        synchronized (this) {
            if (camera != null) {
                camera.stopPreview();
                camera.setPreviewCallback(null);
                camera.release();
                Log.d(TAG, "Lifecycle: Camera released: camflow");
            }
            camera = null;
            // NOTE(brandyn): This is to ensure it is loaded first, there may be a better way
            openCVLoaded = false;
        }
    }

    public void pause() {
        synchronized (this) {
            if (camera != null)
                paused = true;
            stop();
        }
    }

    public void resume() {
        synchronized (this) {
            if (paused) {
                paused = false;
                register();
            }
        }
    }

    public void register() {
        synchronized (this) {
            if (openCVLoaded) {
                Log.w(TAG, "OpenCV Already Loaded: camflow");
                return;
            }
            openCVLoaded = true;
            if (camera != null) {
                Log.w(TAG, "Camera already registered: camflow");
            }
            BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(service) {
                @Override
                public void onManagerConnected(int status) {
                    switch (status) {
                        case LoaderCallbackInterface.SUCCESS: {
                            Log.i(TAG, "Lifecycle: OpenCV loaded successfully: camflow");
                            Utils.eventBusPost(new OpenCVLoadedEvent());
                        }
                        break;
                        default: {
                            super.onManagerConnected(status);
                        }
                        break;
                    }
                }
            };
            OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, service, mLoaderCallback);
        }
    }

    private void setupCamera() {
        synchronized (this) {
            if (camera != null) {
                Log.w(TAG, "Camera already setup: camflow");
                return;
            }
            while (camera == null) {
                for (int camIdx = 0; camIdx < Camera.getNumberOfCameras(); ++camIdx) {
                    Log.d(TAG, "Trying to open camera with new open(" + Integer.valueOf(camIdx) + "): camflow");
                    try {
                        Log.d(TAG, "Lifecycle: Camera attempting open: " + camIdx + "Thread: " + Thread.currentThread().getName() + " Hashcode: " + this.hashCode() + ": camflow");
                        camera = Camera.open(camIdx);
                        Log.d(TAG, "Lifecycle: Camera opened: " + camIdx);
                    } catch (RuntimeException e) {
                        Log.e(TAG, "Lifecycle: Camera #" + camIdx + "failed to open: " + e.getLocalizedMessage());
                    }
                    break;
                }
                if (camera != null) {
                    break;
                }
                Log.w(TAG, "No camera available, sleeping 5 sec...: camflow");
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                }
            }

            try {
                Camera.Parameters params = camera.getParameters();
                Log.d(TAG, "getSupportedPresiewSizes(): camflow");
                List<Camera.Size> sizes = params.getSupportedPreviewSizes();

                if (sizes != null) {
                    // Select the size that fits surface considering maximum size allowed
                    //Size frameSize = calculateCameraFrameSize(sizes, new JavaCameraSizeAccessor(), width, height);
                    //Size frameSize = new Size(1920,1080);
                    Size frameSize = new Size(640, 360);
                    params.setPreviewFormat(ImageFormat.NV21);
                    Log.d(TAG, "Set preview size to " + Integer.valueOf((int) frameSize.width) + "x" + Integer.valueOf((int) frameSize.height) + ": camflow");
                    params.setPreviewSize((int) frameSize.width, (int) frameSize.height);
                    List<String> FocusModes = params.getSupportedFocusModes();
                    if (FocusModes != null && FocusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO)) {
                        params.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO);
                    }
                    // NOTE(conner): Sets correct values for camera in XE10
                    params = camera.getParameters();
                    params.setPreviewFpsRange(30000, 30000);
                    camera.setParameters(params);
                    int frameWidth = params.getPreviewSize().width;
                    int frameHeight = params.getPreviewSize().height;
                    cameraFrame = new CameraFrame(frameWidth, frameHeight);
                    int size = frameWidth * frameHeight;
                    size = size * ImageFormat.getBitsPerPixel(params.getPreviewFormat()) / 8;
                    buffer = new byte[size];

                    camera.addCallbackBuffer(buffer);
                    camera.setPreviewCallbackWithBuffer(this);
                    surfaceTexture = new SurfaceTexture(MAGIC_TEXTURE_ID);
                    camera.setPreviewTexture(surfaceTexture);
                    Log.d(TAG, "startPreview: camflow");
                    camera.startPreview();
                } else {
                    Log.e(TAG, "getSupportedPreviewSizes is null!: camflow");
                    camera = null;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    protected void makeCall(String key, byte[] frameJPEG) {
        makeCall(key, "'" + Base64.encodeToString(frameJPEG, Base64.NO_WRAP) + "'");
    }

    public void onPreviewFrame(byte[] data, Camera camera) {
        synchronized (this) {
            if (this.camera == null) {
                return;
            }
            Log.d(TAG, "Preview Frame received. Frame size: " + data.length + ": camflow");
            if (System.nanoTime() - lastImageSaveTime < imagePeriod) {
                Log.d(TAG, "Frame skipping: " + (System.nanoTime() - lastImageSaveTime) + " < " + imagePeriod);
                addCallbackBuffer();
                return;
            }
            lastImageSaveTime = System.nanoTime();
            cameraFrame.setFrame(data);
            Log.d(TAG, "Frame on bus");
            if (jsCallbacks.containsKey(CameraManager.LOCAL)) {
                Log.d(TAG, "Image JS Callback");
                makeCall(CameraManager.LOCAL, cameraFrame.getJPEG());
            }
            Utils.eventBusPost(new CameraEvents.Frame(cameraFrame, this));
        }
    }

    public void addCallbackBuffer() {
        synchronized (this) {
            Log.d(TAG, "Frame addCallbackBuffer: camflow");
            if (camera != null)
                camera.addCallbackBuffer(buffer);
        }
    }

    public void remoteImage(byte[] frameJPEG) {
        makeCall(CameraManager.REMOTE, frameJPEG);
    }

    private void cameraPhoto() {
        pause();
        Utils.eventBusPost(new StartActivityEvent(new Intent(MediaStore.ACTION_IMAGE_CAPTURE), 1000));
    }

    private void cameraVideo() {
        pause();
        Utils.eventBusPost(new StartActivityEvent(new Intent(MediaStore.ACTION_VIDEO_CAPTURE), 1001));
    }

}
