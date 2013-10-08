package com.dappervision.wearscript;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.SurfaceView;
import android.view.WindowManager;

import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.CameraBridgeViewBase;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.lang.ref.WeakReference;

public class MainActivity extends Activity implements CameraBridgeViewBase.CvCameraViewListener2 {
    protected static final String TAG = "WearScript";
    private static final String EXTRA_NAME = "extra";
    protected JavaCameraView view;
    public boolean isGlass = true, isForeground = true;
    protected BackgroundService bs;
    protected Mat hSmallToGlassMat;
    ServiceConnection mConnection;
    private String extra;
    private boolean mHadUrlExtra = false;
    private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(this) {
        @Override
        public void onManagerConnected(int status) {
            switch (status) {
                case LoaderCallbackInterface.SUCCESS: {
                    //if (isGlass)
                    view.enableView();
                    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
                break;
                default: {
                    super.onManagerConnected(status);
                }
                break;
            }
        }
    };

    public MainActivity() {
        Log.i(TAG, "Instantiated new " + this.getClass());
    }

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {

        // Bind Service
        super.onCreate(savedInstanceState);
        mConnection = new ServiceConnection() {
            public void onServiceConnected(ComponentName className, IBinder service) {

                Log.i(TAG, "Service Connected");
                bs = ((BackgroundService.LocalBinder) service).getService();
                bs.activity = new WeakReference<MainActivity>(MainActivity.this);
            }

            public void onServiceDisconnected(ComponentName className) {
                Log.i(TAG, "Service Disconnected");

            }
        };
        Log.i(TAG, "Calling bindService");
        startService(new Intent(this, BackgroundService.class));
        bindService(new Intent(this,
                BackgroundService.class), mConnection, Context.BIND_AUTO_CREATE);

        // Setup OpenCV/Surface View
        setContentView(R.layout.surface_view);
        view = (JavaCameraView) findViewById(R.id.activity_java_surface_view);
        view.setVisibility(SurfaceView.VISIBLE);
        view.setCvCameraViewListener(this);
        Intent intent = new Intent("com.google.zxing.client.android.SCAN");
        startActivityForResult(intent, 0);
        Intent thisIntent = getIntent();
        if (thisIntent.getStringExtra(EXTRA_NAME) != null) {
            mHadUrlExtra = true;
            extra = thisIntent.getStringExtra(EXTRA_NAME);
            Log.v(TAG, "Found extra: " + extra);
        } else {
            Log.v(TAG, "Did not find extra.");
        }
    }

    @Override
    public void onPause() {
        isForeground = false;
        super.onPause();
        if (view != null && isGlass) {
            view.disableView();
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }

    @Override
    public void onResume() {
        isForeground = true;
        super.onResume();
        OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, this, mLoaderCallback);
    }

    public void onDestroy() {
        super.onDestroy();
        if (view != null) {
            view.disableView();
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
        if (mConnection != null)
            unbindService(mConnection);

    }

    protected Mat ImageLike(Mat image) {
        if (image.channels() == 3)
            return new Mat(image.rows(), image.cols(), CvType.CV_8UC4);
        return new Mat(image.rows(), image.cols(), CvType.CV_8UC3);
    }

    public Mat cameraToBGR(CameraBridgeViewBase.CvCameraViewFrame inputFrame) {
        Mat frameRGBA = inputFrame.rgba();
        final Mat frame = new Mat(frameRGBA.rows(), frameRGBA.cols(), CvType.CV_8UC3);
        Imgproc.cvtColor(frameRGBA, frame, Imgproc.COLOR_RGBA2BGR);
        return frame;
    }

    public Mat onCameraFrame(CameraBridgeViewBase.CvCameraViewFrame inputFrame) {
        Mat frame = null;
        // If any of these are true then do not send
        boolean sendData = !bs.dataImage || (!bs.dataLocal && !bs.dataRemote) || (bs.dataRemote && bs.remoteImageCount - bs.remoteImageAckCount > 0) || System.nanoTime() - bs.lastImageSaveTime < bs.imagePeriod;
        sendData = !sendData;
        if (bs.webview != null && bs.imageCallback != null) {
            bs.webview.loadUrl("javascript:" + bs.imageCallback + "();");
        }
        if (sendData) {
            bs.lastSensorSaveTime = bs.lastImageSaveTime = System.nanoTime();
            frame = cameraToBGR(inputFrame);
            bs.saveDataPacket(frame);
        }
        if (bs.overlay != null)
            return bs.overlay;
        if (bs.previewWarp && hSmallToGlassMat != null) {
            frame = inputFrame.rgba();
            Mat frameWarp = ImageLike(frame);
            Imgproc.warpPerspective(frame, frameWarp, hSmallToGlassMat, new Size(frameWarp.width(), frameWarp.height()));
            return frameWarp;
        }
        return inputFrame.rgba();
    }

    public void onCameraViewStarted(int width, int height) {
    }

    public void onCameraViewStopped() {
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.i(TAG, "QR: Got activity result: V0");
        if (requestCode == 0) {
            String contents = null;
            if (resultCode == RESULT_OK) {
                contents = intent.getStringExtra("SCAN_RESULT");
                String format = intent.getStringExtra("SCAN_RESULT_FORMAT");
                Log.i(TAG, "QR: " + contents + " Format: " + format);
                bs.SaveData(contents.getBytes(), "", false, "qr.txt");
            } else if (resultCode == RESULT_CANCELED) {
                // Reuse local config
                Log.i(TAG, "QR: Canceled, using previous scan");
                contents = new String(bs.LoadData("", "qr.txt"));
                // TODO: We want to allow reentry into a running app
            }
            if (contents != null)
                bs.reset();
            if (contents.startsWith("ws")) {
                bs.serverConnect(contents, null);
            } else {
                if (mHadUrlExtra) {
                    Log.v(TAG, "Starting custom script from extras: " + extra);
                    bs.directStartScriptUrl(extra);
                } else {
                    bs.runScriptUrl(contents, null);
                }
            }
        }
    }
}
