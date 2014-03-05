package com.dappervision.wearscript.managers;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.view.SurfaceView;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.WarpDrawEvent;
import com.dappervision.wearscript.events.WarpHEvent;
import com.dappervision.wearscript.events.WarpModeEvent;
import com.dappervision.wearscript.jsevents.ActivityEvent;
import com.dappervision.wearscript.jsevents.CameraEvents;

import org.json.simple.JSONArray;
import org.msgpack.type.ValueFactory;
import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

public class WarpManager extends Manager {
    public static final String SAMPLE = "sample";
    private double[] hGlassToSmall;

    public enum Mode {
        CAM2GLASS, SAMPLEWARPPLANE, SAMPLEWARPGLASS
    }
    public static final String TAG = "WarpManager";
    protected Mat hSmallToGlassMat;
    protected double[] hSmallToGlass;
    private Bitmap mCacheBitmap;
    private SurfaceView view;
    private Mat frameBGR;
    private Mat frameWarp;
    private boolean busy;
    private boolean captureSample;
    private boolean useSample;
    private Mode mode;
    private Mat sampleBGR;

    public WarpManager(BackgroundService bs) {
        super(bs);
        view = new SurfaceView(bs);
        reset();
    }

    @Override
    public void reset() {
        frameBGR = null;
        busy = false;
        captureSample = false;
        useSample = false;
        mode = Mode.CAM2GLASS;
        super.reset();
    }

    protected double[] ParseJSONDoubleArray(JSONArray a) {
        if (a == null)
            return null;
        double out[] = new double[a.size()];
        for (int i = 0; i < a.size(); ++i) {
            try {
                out[i] = (Double)a.get(i);
            } catch (ClassCastException e) {
                out[i] = ((Long)a.get(i)).doubleValue();
            }
        }
        return out;
    }

    protected Mat ImageBGRFromString(byte[] data) {
        Mat frame = new Mat(1, data.length, CvType.CV_8UC1);
        frame.put(0,  0, data);
        return Highgui.imdecode(frame, 1);
    }

    protected Mat HMatFromArray(double a[]) {
        Mat m = new Mat(3, 3, CvType.CV_64FC1);
        for (int i = 0; i < 3; ++i)
            for (int j = 0; j < 3; ++j)
                m.put(i, j, a[i * 3 + j]);
        return m;
    }

    protected double[] HMult(double a[], double b[]) {
        if (a == null || b == null)
            return null;
        double c[] = new double[9];
        c[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
        c[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
        c[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
        c[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
        c[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
        c[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
        c[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
        c[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
        c[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
        return c;
    }

    protected double[] HMultPoint(double a[], double b[]) {
        if (a == null || b == null)
            return null;
        double c[] = new double[3];
        c[2] = a[6] * b[0] + a[7] * b[1] + a[8] * b[2];
        c[0] = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / c[2];
        c[1] = (a[3] * b[0] + a[4] * b[1] + a[5] * b[2]) / c[2];
        c[2] = 1.;

        return c;
    }

    void setupMatrices() {
        double hSmallToBig[] = {3.99706685e+00, -1.67819167e-02, -2.69490153e+01,
                -1.44162510e-02, 3.97861285e+00, 4.32612839e+02,
                -1.87025612e-05, -2.87125025e-05, 1.00000000e+00};
                //{3.95, 0., 0, 0., 3.95, 434, 0., 0., 1.};


        double hBigToGlass[] = {1.49968460e+00, -9.18421959e-02, -1.26498024e+03, -1.28142821e-02, 1.44983279e+00, -5.69960334e+02,-3.04188513e-05, -1.34763662e-04, 1.00000000e+00}; // XE-B Sky


        //double hBigToGlass[] = {1.3960742363652061, -0.07945137930533697, -1104.2947209648783, 0.006275578662065556, 1.3523872016751255, -504.1266472917187, -1.9269902737e-05, -9.708578143e-05, 1};
        //double hBigToGlass[] = {1.4538965634675285, -0.10298433991228334, -1224.726117650959, 0.010066418722892632, 1.3287672714218164, -526.977020143425, -4.172194829863231e-05, -0.00012170226282961026, 1.0};
        hSmallToGlass = HMult(hBigToGlass, hSmallToBig);
        hSmallToGlassMat = HMatFromArray(hSmallToGlass);
        hGlassToSmall = new double[9];
        Mat hGlassToSmallMat = hSmallToGlassMat.inv();
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++) {
                hGlassToSmall[i * 3 + j] = hGlassToSmallMat.get(i, j)[0];
                Log.d(TAG, "hGlassToSmall:" + (i * 3 + j) + " " + hGlassToSmall[i * 3 + j]);
            }
    }

    Mat imageLike(Mat image) {
        if (image.channels() == 3)
            return new Mat(image.rows(), image.cols(), CvType.CV_8UC4);
        return new Mat(image.rows(), image.cols(), CvType.CV_8UC3);
    }

    public void onEvent(WarpModeEvent event) {
        synchronized (this) {
            mode = event.getMode();
            Log.d(TAG, "Warp: Setting Mode: " + event.getMode().name());
            if (mode == Mode.SAMPLEWARPPLANE || mode == Mode.SAMPLEWARPGLASS) {
                useSample = false;
                captureSample = true;
            }
        }
    }

    public void onEvent(WarpDrawEvent event) {
        synchronized (this) {
            if ((mode == Mode.SAMPLEWARPPLANE || mode == Mode.SAMPLEWARPGLASS) && useSample) {
                double circleCenter[] = {event.getX(), event.getY(), 1};
                double circleCenterSmall[] = HMultPoint(hGlassToSmall, circleCenter);
                Core.circle(sampleBGR, new Point(circleCenterSmall[0], circleCenterSmall[1]), event.getRadius(), new Scalar(event.getB(), event.getG(), event.getR()));
            }
        }
    }

    public void onEventAsync(WarpHEvent event) {
        double[] h = event.getH();
        synchronized (this) {
            if ((mode == Mode.SAMPLEWARPPLANE || mode == Mode.SAMPLEWARPGLASS) && useSample) {
                if (hSmallToGlassMat == null)
                    setupMatrices();
                if (frameWarp == null)
                    frameWarp = new Mat(360, 640, CvType.CV_8UC3);
                Log.d(TAG, "Warp: WarpHEvent");
                if (mode == Mode.SAMPLEWARPGLASS) {
                    h = HMult(hSmallToGlass, h);
                }
                Mat hMat = HMatFromArray(h);

                Imgproc.warpPerspective(sampleBGR, frameWarp, hMat, new Size(frameWarp.width(), frameWarp.height()));
                drawFrame(frameWarp);
            }
        }
    }

    public void processFrame(CameraEvents.Frame frameEvent) {
        if (service.getActivityMode() != ActivityEvent.Mode.WARP)
            return;
        if (mode == Mode.SAMPLEWARPPLANE || mode == Mode.SAMPLEWARPGLASS) {
            synchronized (this) {
                if (hSmallToGlassMat == null)
                    setupMatrices();
                if (captureSample) {
                    captureSample = false;
                    Log.d(TAG, "Warp: Capturing Sample");
                    Mat frame = frameEvent.getCameraFrame().getRGB();
                    byte[] frameJPEG = frameEvent.getCameraFrame().getJPEG();
                    if (sampleBGR == null || sampleBGR.height() != frame.height() || sampleBGR.width() != frame.width())
                        sampleBGR = new Mat(frame.rows(), frame.cols(), CvType.CV_8UC3);
                    Imgproc.cvtColor(frame, sampleBGR, Imgproc.COLOR_RGB2BGR);
                    useSample = true;
                    // TODO: Specialize it for this group/device
                    com.dappervision.wearscript.Utils.eventBusPost(new SendEvent("warpsample", "", ValueFactory.createRawValue(frameJPEG)));
                }
            }
        }

        if (busy)
            return;
        synchronized (this) {
            busy = true;
            if (hSmallToGlassMat == null)
                setupMatrices();
            if (frameWarp == null)
                frameWarp = new Mat(360, 640, CvType.CV_8UC3);
            if (mode == Mode.CAM2GLASS) {
                Mat inputBGR;
                Mat frame = frameEvent.getCameraFrame().getRGB();
                if (frameBGR == null || frameBGR.height() != frame.height() || frameBGR.width() != frame.width())
                    frameBGR = new Mat(frame.rows(), frame.cols(), CvType.CV_8UC3);
                Imgproc.cvtColor(frame, frameBGR, Imgproc.COLOR_RGB2BGR);
                inputBGR = frameBGR;

                // TODO: Change matrix we are warping based on size
                Imgproc.warpPerspective(inputBGR, frameWarp, hSmallToGlassMat, new Size(frameWarp.width(), frameWarp.height()));
                drawFrame(frameWarp);
            }
            busy = false;
        }
    }

    void drawFrame (Mat modified) {
        // Partly from OpenCV CameraBridgeViewBase.java
        if (mCacheBitmap == null) {
            mCacheBitmap = Bitmap.createBitmap(modified.width(), modified.height(), Bitmap.Config.ARGB_8888);
        }
        boolean bmpValid = true;
        if (modified != null) {
            try {
                Utils.matToBitmap(modified, mCacheBitmap);
            } catch(Exception e) {
                Log.e(TAG, "Mat type: " + modified);
                Log.e(TAG, "Bitmap type: " + mCacheBitmap.getWidth() + "*" + mCacheBitmap.getHeight());
                Log.e(TAG, "Utils.matToBitmap() throws an exception: " + e.getMessage());
                bmpValid = false;
            }
        }
        if (bmpValid && mCacheBitmap != null) {
            Canvas canvas = view.getHolder().lockCanvas();
            if (canvas != null) {
                canvas.drawColor(0, android.graphics.PorterDuff.Mode.CLEAR);
                canvas.drawBitmap(mCacheBitmap, new Rect(0,0,mCacheBitmap.getWidth(), mCacheBitmap.getHeight()),
                          new Rect((canvas.getWidth() - mCacheBitmap.getWidth()) / 2,
                                    (canvas.getHeight() - mCacheBitmap.getHeight()) / 2,
                                    (canvas.getWidth() - mCacheBitmap.getWidth()) / 2 + mCacheBitmap.getWidth(),
                                    (canvas.getHeight() - mCacheBitmap.getHeight()) / 2 + mCacheBitmap.getHeight()), null);

                view.getHolder().unlockCanvasAndPost(canvas);
            }
        }
    }

    public SurfaceView getView() {
        return view;
    }
}
