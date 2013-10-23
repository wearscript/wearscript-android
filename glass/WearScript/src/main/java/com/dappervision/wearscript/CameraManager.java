package com.dappervision.wearscript;

import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.util.Base64;
import android.util.Log;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class CameraManager implements Camera.PreviewCallback {
    private final BackgroundService bs;
    private static final String TAG = "CameraManager";
    private static final int MAGIC_TEXTURE_ID = 10;
    private Camera camera;
    private byte[] buffer;
    private SurfaceTexture surfaceTexture;
    private CameraFrame cameraFrame;
    ConcurrentHashMap<Integer, String> jsCallbacks;


    public class CameraFrame {
        private MatOfByte jpgFrame;
        private String jpgB64;
        private boolean frameRGBSet;
        private Mat frameRGB;
        private Mat frame;

        CameraFrame(int width, int height) {
            frame = new Mat(height + (height / 2), width, CvType.CV_8UC1);
            frameRGB = new Mat(width, height, CvType.CV_8UC3);
            jpgFrame = null;
            frameRGBSet = false;
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

        byte[] getJPEG() {
            if (jpgFrame != null)
                return jpgFrame.toArray();
            Mat frameRGB = getRGB();
            jpgFrame = new MatOfByte();
            Highgui.imencode(".jpg", frameRGB, jpgFrame);
            return jpgFrame.toArray();
        }
    }

    CameraManager(BackgroundService bs) {
        this.bs = bs;
        jsCallbacks = new ConcurrentHashMap<Integer, String>();
    }

    public void unregister() {
        synchronized (this) {
            if (camera != null) {
                camera.stopPreview();
                camera.setPreviewCallback(null);

                camera.release();
            }
            camera = null;
            jsCallbacks = new ConcurrentHashMap<Integer, String>();
        }
    }

    public void register() {
        synchronized (this) {
            for (int camIdx = 0; camIdx < Camera.getNumberOfCameras(); ++camIdx) {
                Log.d(TAG, "Trying to open camera with new open(" + Integer.valueOf(camIdx) + ")");
                try {
                    camera = Camera.open(camIdx);
                } catch (RuntimeException e) {
                    Log.e(TAG, "Camera #" + camIdx + "failed to open: " + e.getLocalizedMessage());
                }
                break;
            }
            try {
                Camera.Parameters params = camera.getParameters();
                Log.d(TAG, "getSupportedPresiewSizes()");
                List<Camera.Size> sizes = params.getSupportedPreviewSizes();

                if (sizes != null) {
                    // Select the size that fits surface considering maximum size allowed
                    //Size frameSize = calculateCameraFrameSize(sizes, new JavaCameraSizeAccessor(), width, height);
                    //Size frameSize = new Size(1920,1080);
                    Size frameSize = new Size(640, 360);
                    params.setPreviewFormat(ImageFormat.NV21);
                    Log.d(TAG, "Set preview size to " + Integer.valueOf((int) frameSize.width) + "x" + Integer.valueOf((int) frameSize.height));
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
                    Log.d(TAG, "startPreview");
                    camera.startPreview();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void registerCallback(Integer type, String jsFunction) {
        synchronized (this) {
            jsCallbacks.put(type, jsFunction);
        }
    }

    public String buildCallbackString(Integer type, byte[] frameJPEG) {
        synchronized (this) {
            if (frameJPEG == null || !jsCallbacks.containsKey(type))
                return null;
            return String.format("javascript:%s(\"%s\");", jsCallbacks.get(type), Base64.encodeToString(frameJPEG, Base64.NO_WRAP));
        }
    }

    public void onPreviewFrame(byte[] data, Camera camera) {
        synchronized (this) {
            if (camera == null) {
                return;
            }
            Log.d(TAG, "Preview Frame received. Frame size: " + data.length);
            cameraFrame.setFrame(data);
            bs.handleImage(cameraFrame);
            this.camera.addCallbackBuffer(buffer);
        }
    }

}
