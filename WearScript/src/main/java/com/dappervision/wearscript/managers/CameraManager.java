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

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.ActivityResultEvent;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.events.CameraEvents;
import com.dappervision.wearscript.events.OpenCVLoadEvent;
import com.dappervision.wearscript.events.OpenCVLoadedEvent;
import com.dappervision.wearscript.events.StartActivityEvent;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class CameraManager extends Manager implements Camera.PreviewCallback {
    /* To Test this code, check the following conditions and all combinations
    * 1. Stream on/off
    * 2. Background on/off
    * 3. Camera photo button pressed
    * 4. Media called inside wearscript (cameraPhoto or cameraVideo)
    * */
    public static final String LOCAL = "0";
    public static final String PHOTO = "PHOTO";
    public static final String PHOTO_PATH = "PHOTO_PATH";
    public static final String VIDEO = "VIDEO";
    public static final String VIDEO_PATH = "VIDEO_PATH";
    private static final boolean DBG = false;
    private static final String TAG = "CameraManager";
    private static final int MAGIC_TEXTURE_ID = 10;
    private Camera camera;
    private byte[] buffer;
    private SurfaceTexture surfaceTexture;
    private CameraFrame cameraFrame;
    private long imagePeriod;
    private double lastImageSaveTime;
    private FileObserver mFileObserver;
    private Handler mHandler;
    private boolean background;
    private int maxWidth, maxHeight;
    private int numSkip;
    private boolean streamOn = false;
    private boolean screenIsOn = true;
    private boolean activityVisible = true;
    private int mediaPauseCount = 0;

    public CameraManager(BackgroundService bs) {
        super(bs);
        reset();
    }

    public void setupCallback(CallbackRegistration r) {
        // Entry point for capturing photos/videos
        super.setupCallback(r);
        Log.d(TAG, "setupCallback");
        if (r.getEvent().equals(PHOTO) || r.getEvent().equals(PHOTO_PATH)) {
            cameraPhoto();
        } else if (r.getEvent().equals(VIDEO) || r.getEvent().equals(VIDEO_PATH)) {
            cameraVideo();
        }
    }

    public void onEventAsync(OpenCVLoadedEvent event) {
        // State: Called after OpenCV is loaded, note this may happen when another module requests it
        synchronized (this) {
            // BUG(brandyn): We should check the conditions again here
            if (streamOn && camera == null)
                setupCamera();
        }
    }

    public void onEvent(CameraEvents.Start e) {
        // State: Called after WS.cameraOn
        Log.d(TAG, "camflow: Start");
        synchronized (this) {
            cameraStreamStop();
            imagePeriod = Math.round(e.getPeriod() * 1000000000L);
            background = e.getBackground();
            maxWidth = e.getMaxWidth();
            maxHeight = e.getMaxHeight();

            lastImageSaveTime = 0.;

            if (imagePeriod > 0) {
                if (screenIsOn && activityVisible) {
                    Log.d(TAG, "camflow: Registering");
                    streamOn = true;
                } else {
                    Log.d(TAG, "camflow: Starting as paused");
                    streamOn = false;
                }
                stateChange();
            } else {
                Log.d(TAG, "camflow: Resetting");
                reset();
            }
        }
    }

    public void onEvent(ActivityResultEvent event) {
        int requestCode = event.getRequestCode(), resultCode = event.getResultCode();
        Intent intent = event.getIntent();
        Log.d(TAG, "Got request code: " + requestCode);
        if (requestCode == 1000) {
            synchronized (this) {
                mediaPauseCount -= 1;
                stateChange();
            }
            if (resultCode == Activity.RESULT_OK) {
                final String pictureFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_PICTURE_FILE_PATH);
                String thumbnailFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_THUMBNAIL_FILE_PATH);
                Log.d(TAG, "CameraManager: " + jsCallbacks.toString());
                if (jsCallbacks.containsKey(PHOTO) || jsCallbacks.containsKey(PHOTO_PATH)) {
                    // create empty file if it doesn't exist
                    // else FileObserver won't work (as per documentation)
                    File pictureFile = new File(pictureFilePath);
                    if (!pictureFile.exists()) {
                        try {
                            Log.d(TAG, "Creating file at " + pictureFilePath);
                            pictureFile.createNewFile();
                        } catch (IOException e) {
                            Log.e(TAG, "Couldn't create pictureFile.", e);
                        }
                    }
                    // use a Handler to keep WebView method from being called
                    // on FileObserver thread (bad form, elicits warning)
                    mHandler = new Handler();
                    mFileObserver = new FileObserver(pictureFilePath) {
                        @Override
                        protected void finalize() {
                            super.finalize();
                            if (DBG) Log.d(TAG, "FileObserver finalized.");
                        }

                        @Override
                        public void onEvent(int event, String path) {
                            if (DBG) Log.d(TAG, "FileObserver got event " + event);
                            if (event == FileObserver.CLOSE_WRITE) {
                                Log.d(TAG, "Detected photo file write. "
                                        + "Now I'll hit the callbacks and quit.");
                                byte imageData[] = Utils.LoadFile(new File(pictureFilePath));
                                mHandler.post(
                                        new Runnable() {
                                            @Override
                                            public void run() {
                                                photoCallback(pictureFilePath);
                                            }
                                        }
                                );
                                this.stopWatching();
                            }
                        }
                    };
                    Log.d(TAG, "Starting FileObserver.");
                    mFileObserver.startWatching();
                }
            }
        } else if (requestCode == 1001) {
            synchronized (this) {
                mediaPauseCount -= 1;
                stateChange();
            }
            if (resultCode == Activity.RESULT_OK) {
                String thumbnailFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_THUMBNAIL_FILE_PATH);
                String videoFilePath = intent.getStringExtra(com.google.android.glass.media.CameraManager.EXTRA_VIDEO_FILE_PATH);
                if (jsCallbacks.containsKey(VIDEO_PATH)) {
                    makeCall(VIDEO_PATH, "'" + videoFilePath + "'");
                    jsCallbacks.remove(VIDEO_PATH);
                }
            }
        }
    }

    // Called when FileObserver sees that the picture has been written
    private void photoCallback(String pictureFilePath) {
        byte imageData[] = Utils.LoadFile(new File(pictureFilePath));
        if (imageData == null) {
            Log.w(TAG, "No image after FileObserver saw write?");
            return;
        }
        if (jsCallbacks.containsKey(PHOTO)) {
            makeCall(PHOTO, imageData);
            jsCallbacks.remove(PHOTO);
        }

        if (jsCallbacks.containsKey(PHOTO_PATH)) {
            makeCall(PHOTO_PATH, "'" + pictureFilePath + "'");
            jsCallbacks.remove(PHOTO_PATH);
        }
    }

    public void reset() {
        synchronized (this) {
            super.reset();
            background = false;
            lastImageSaveTime = 0.;
            imagePeriod = 0;
            streamOn = false;
            stateChange();
        }
    }

    public void shutdown() {
        reset();
        super.shutdown();
    }

    public void cameraStreamStop() {
        synchronized (this) {
            if (camera != null) {
                camera.stopPreview();
                camera.setPreviewCallback(null);
                camera.release();
                Log.d(TAG, "Lifecycle: Camera released: camflow");
            }
            camera = null;
        }
    }

    public void onCameraButtonPressed() {
        cameraStreamStop();
    }

    public void activityOnPause() {
        synchronized (this) {
            activityVisible = false;
            stateChange();
        }
    }

    public void activityOnResume() {
        synchronized (this) {
            activityVisible = true;
            stateChange();
        }
    }

    public void screenOn() {
        synchronized (this) {
            screenIsOn = true;
            stateChange();
        }
    }

    public void stateChange() {
        synchronized (this) {
            Log.d(TAG, String.format("stateChange: mediaPauseCount: %d screenIsOn: %s activityVisible: %s streamOn: %s background: %s", mediaPauseCount , screenIsOn, activityVisible, streamOn, background));
            boolean cameraStream = streamOn && mediaPauseCount == 0;
            if (screenIsOn) {
                if (activityVisible) {
                    if (cameraStream)
                        cameraStreamStart();
                    else
                        cameraStreamStop();
                } else {
                    cameraStreamStop();
                }
            } else {
                if (background) {
                    if (cameraStream)
                        cameraStreamStart();
                    else
                        cameraStreamStop();
                } else {
                    cameraStreamStop();
                }
            }
        }
    }

    public void screenOff() {
        synchronized (this) {
            screenIsOn = false;
            stateChange();
        }
    }

    public void cameraStreamStart() {
        Utils.eventBusPost(new OpenCVLoadEvent());
    }

    private void setupCamera() {
        synchronized (this) {
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
                Log.w(TAG, "No camera available, sleeping 1 sec...: camflow");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                }
            }

            try {
                Camera.Parameters params = camera.getParameters();
                Log.d(TAG, "getSupportedPresiewSizes(): camflow");
                List<Camera.Size> sizes = params.getSupportedPreviewSizes();
                for (Camera.Size size : sizes) {
                    Log.d(TAG, "Supported Preview Size: " + size.height + " " + size.width);
                }
                if (sizes != null) {
                    Size frameSize = null;
                    Camera.Size sizeNearest = null;
                    for (Camera.Size size : sizes) {
                        sizeNearest = size;
                        if (size.width <= this.maxWidth && size.height <= this.maxHeight) {
                            break;
                        }
                    }
                    if (sizeNearest == null)
                        return;
                    Log.d(TAG, "Selected: " + sizeNearest.width + " " + sizeNearest.height + " Max: " + this.maxWidth + " " + this.maxHeight);
                    frameSize = new Size(sizeNearest.width, sizeNearest.height);
                    params.setPreviewFormat(ImageFormat.NV21);
                    Log.d(TAG, "Set preview size to " + Integer.valueOf((int) frameSize.width) + "x" + Integer.valueOf((int) frameSize.height) + ": camflow");
                    params.setPreviewSize((int) frameSize.width, (int) frameSize.height);
                    List<String> FocusModes = params.getSupportedFocusModes();
                    if (FocusModes != null && FocusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO)) {
                        params.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO);
                    }
                    params.setPreviewFpsRange(30000, 30000);
                    camera.setParameters(params);
                    int frameWidth = params.getPreviewSize().width;
                    int frameHeight = params.getPreviewSize().height;
                    Log.d(TAG, "Frame Width" + frameWidth + " Frame Height: " + frameHeight + " camflow");
                    cameraFrame = new CameraFrame(frameWidth, frameHeight);
                    int size = frameWidth * frameHeight;
                    size = size * ImageFormat.getBitsPerPixel(params.getPreviewFormat()) / 8;
                    buffer = new byte[size];

                    camera.addCallbackBuffer(buffer);
                    camera.setPreviewCallbackWithBuffer(this);
                    surfaceTexture = new SurfaceTexture(MAGIC_TEXTURE_ID);
                    camera.setPreviewTexture(surfaceTexture);
                    // NOTE(brandyn): Hack to not output the broken first couple of images
                    numSkip = 2;
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
            if (numSkip > 0) {
                numSkip -= 1;
                addCallbackBuffer();
                return;
            }
            if (System.nanoTime() - lastImageSaveTime < imagePeriod) {
                Log.d(TAG, "Frame skipping: " + (System.nanoTime() - lastImageSaveTime) + " < " + imagePeriod);
                addCallbackBuffer();
                return;
            }
            Log.d(TAG, "CamPath: Got frame");
            lastImageSaveTime = System.nanoTime();
            cameraFrame.setFrame(data);
            if (jsCallbacks.containsKey(CameraManager.LOCAL)) {
                Log.d(TAG, "Image JS Callback");
                makeCall(CameraManager.LOCAL, cameraFrame.getJPEG());
            }
            Log.d(TAG, "CameraFrame Sent: " + System.nanoTime());
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

    private void cameraPhoto() {
        synchronized (this) {
            mediaPauseCount += 1;
            stateChange();
        }
        Log.d(TAG, "Taking photo");
        Utils.eventBusPost(new StartActivityEvent(new Intent(MediaStore.ACTION_IMAGE_CAPTURE), 1000));
    }

    private void cameraVideo() {
        synchronized (this) {
            mediaPauseCount += 1;
            stateChange();
        }
        Utils.eventBusPost(new StartActivityEvent(new Intent(MediaStore.ACTION_VIDEO_CAPTURE), 1001));
    }

    public class CameraFrame {
        private MatOfByte jpgFrame;
        private byte[] ppm;
        private boolean frameRGBSet;
        private Mat frameRGB;
        private Mat frame;

        CameraFrame(int width, int height) {
            jpgFrame = null;
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
            frameRGBSet = true;
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

        public byte[] getPPM() {
            Mat frameRGB = getRGB();
            MatOfByte ppmFrame = new MatOfByte();
            Highgui.imencode(".ppm", frameRGB, ppmFrame);
            return ppmFrame.toArray();
        }
    }

}
