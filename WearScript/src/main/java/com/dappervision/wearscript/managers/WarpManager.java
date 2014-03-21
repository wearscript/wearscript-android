package com.dappervision.wearscript.managers;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.view.SurfaceView;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.events.ActivityEvent;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.dappervision.wearscript.events.CameraEvents;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.WarpDrawEvent;
import com.dappervision.wearscript.events.WarpHEvent;
import com.dappervision.wearscript.events.WarpModeEvent;
import com.dappervision.wearscript.events.WarpSetAnnotationEvent;
import com.dappervision.wearscript.events.WarpSetupHomographyEvent;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
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
    public static final String TAG = "WarpManager";
    public static final String GLASS2PREVIEWH = "GLASS2PREVIEWH";
    private Bitmap mCacheBitmap;
    private SurfaceView view;
    private Mat frameBGR;
    private Mat frameWarp;
    private boolean busy;
    private boolean captureSample;
    private boolean useSample;
    private Mode mode;
    private Mat sampleBGR;
    private double[] hSmallToGlass1280x720;
    private double[] hSmallToGlass640x360;
    private double[] hSmallToGlass256x144;

    private Mat hSmallToGlassMat1280x720;
    private Mat hSmallToGlassMat640x360;
    private Mat hSmallToGlassMat256x144;

    private double[] hGlassToSmall1280x720;
    private double[] hGlassToSmall640x360;
    private double[] hGlassToSmall256x144;

    private boolean isSetup;

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
                out[i] = (Double) a.get(i);
            } catch (ClassCastException e) {
                out[i] = ((Long) a.get(i)).doubleValue();
            }
        }
        return out;
    }

    protected JSONArray StringifyJSONDoubleArray(double[] a) {
        if (a == null)
            return null;
        JSONArray array = new JSONArray();
        for (int i = 0; i < a.length; ++i) {
            array.add(a[i]);
        }
        return array;
    }

    protected Mat ImageBGRFromString(byte[] data) {
        Mat frame = new Mat(1, data.length, CvType.CV_8UC1);
        frame.put(0, 0, data);
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
        return HMult(a, b, new double[9]);
    }

    protected double[] HMult(double a[], double b[], double c[]) {
        if (a == null || b == null || c == null)
            return null;
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
        double hSmallToGlass1280x720[] = {4.068402956851528, 0.02581555954274611, -1839.9618670575708, 0.07867908839387755, 3.7789295020616938, 0.6031318288709527, 0.00022875171829161314, 0.0002162888504563211, 0.9999999999999999};
        setupMatrices(hSmallToGlass1280x720);
    }

    void setupMatrices(double hSmallToGlass1280x720[]) {

        // NOTE(brandyn): Tried 256x144, seems to be wrong crop, 320x180 doesn't exist as a preview image
        //double hSmallToBig1280x720[] = {1.99853342e+00, -8.39095836e-03, -2.69490153e+01, -7.20812551e-03, 1.98930643e+00, 4.32612839e+02, -9.35128058e-06, -1.43562513e-05, 1.00000000e+00};
        //double hSmallToBig640x360[] = {3.99706685e+00, -1.67819167e-02, -2.69490153e+01, -1.44162510e-02, 3.97861285e+00, 4.32612839e+02, -1.87025612e-05, -2.87125025e-05, 1.00000000e+00};
        //double hBigToGlass[] = {1.49968460e+00, -9.18421959e-02, -1.26498024e+03, -1.28142821e-02, 1.44983279e+00, -5.69960334e+02, -3.04188513e-05, -1.34763662e-04, 1.00000000e+00}; // XE-B Sky
                                            //﻿[3.213396134909824, 0.23575402234991535, -1448.727351309495, 0.020696946973589182, 3.3321732396583297, 12.008678935898468, -0.0001695980726513356, 0.0009244035979599825, 1.0

        hGlassToSmall1280x720 = new double[9];
        hGlassToSmall640x360 = new double[9];
        hGlassToSmall256x144 = new double[9];

        this.hSmallToGlass1280x720 = hSmallToGlass1280x720;
        hSmallToGlass640x360 = new double[9];
        hSmallToGlass256x144 = new double[9];

        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++) {
                if (j < 2)
                    hSmallToGlass640x360[i * 3 + j] = hSmallToGlass1280x720[i * 3 + j] * 2;
                else
                    hSmallToGlass640x360[i * 3 + j] = hSmallToGlass1280x720[i * 3 + j];
            }
        hSmallToGlassMat1280x720 = setupMatrix(hSmallToGlass1280x720, hGlassToSmall1280x720);
        hSmallToGlassMat640x360 = setupMatrix(hSmallToGlass640x360, hGlassToSmall640x360);

        //hSmallToGlassMat1280x720 = HMatFromArray(hSmallToGlass1280x720NEW);
        //hSmallToGlassMat640x360 = setupMatrix(hSmallToBig640x360, hBigToGlass, hSmallToGlass640x360, hGlassToSmall640x360);
        frameWarp = new Mat(360, 640, CvType.CV_8UC3);
        isSetup = true;
    }

    protected void setupCallback(CallbackRegistration e) {
        super.setupCallback(e);
        if (e.getEvent().equals(GLASS2PREVIEWH)) {
            synchronized (this) {
                if (!isSetup)
                    setupMatrices();
                JSONObject hs = new JSONObject();
                hs.put("h", StringifyJSONDoubleArray(hGlassToSmall1280x720));
                hs.put("hinv", StringifyJSONDoubleArray(hSmallToGlass1280x720));
                makeCall(GLASS2PREVIEWH, "'" + hs.toJSONString() + "'");
            }
        }
    }

    Mat setupMatrix(double hSmallToGlass[], double hGlassToSmall[]) {
        Mat hSmallToGlassMat = HMatFromArray(hSmallToGlass);
        Mat hGlassToSmallMat = hSmallToGlassMat.inv();
        double denominator = hGlassToSmallMat.get(2, 2)[0];
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                hGlassToSmall[i * 3 + j] = hGlassToSmallMat.get(i, j)[0] / denominator;
        return hSmallToGlassMat;
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

    public void onEvent(WarpSetAnnotationEvent event) {
        synchronized (this) {
            sampleBGR = ImageBGRFromString(event.getImage());
            useSample = true;
        }
    }

    public void onEvent(WarpSetupHomographyEvent event) {
        synchronized (this) {
            setupMatrices(ParseJSONDoubleArray((JSONArray)(JSONValue.parse(event.getHomography()))));
        }
    }

    public void onEvent(WarpDrawEvent event) {
        synchronized (this) {
            if ((mode == Mode.SAMPLEWARPPLANE || mode == Mode.SAMPLEWARPGLASS) && useSample) {
                if (!isSetup)
                    setupMatrices();
                double hGlassToSmall[] = getHGlassToSmall(sampleBGR.height(), sampleBGR.width());
                if (hGlassToSmall == null) {
                    Log.w(TAG, "Warp: Bad size");
                    return;
                }
                double circleCenter[] = {event.getX(), event.getY(), 1};
                double circleCenterSmall[] = HMultPoint(hGlassToSmall, circleCenter);
                Core.circle(sampleBGR, new Point(circleCenterSmall[0], circleCenterSmall[1]), event.getRadius(), new Scalar(event.getR(), event.getG(), event.getB()));
            }
        }
    }

    double[] getHSmallToGlass(int height, int width) {
        if (width == 1280 && height == 720)
            return hSmallToGlass1280x720;
        else if (width == 640 && height == 360)
            return hSmallToGlass640x360;
        //else if (width == 256 && height == 144)
        //    return hSmallToGlass256x144;
        return null;
    }

    double[] getHGlassToSmall(int height, int width) {
        if (width == 1280 && height == 720)
            return hGlassToSmall1280x720;
        else if (width == 640 && height == 360)
            return hGlassToSmall640x360;
        //else if (width == 256 && height == 144)
        //    return hGlassToSmall256x144;
        return null;
    }

    Mat getHSmallToGlassMat(int height, int width) {
        if (width == 1280 && height == 720)
            return hSmallToGlassMat1280x720;
        else if (width == 640 && height == 360)
            return hSmallToGlassMat640x360;
        //else if (width == 256 && height == 144)
        //    return hSmallToGlassMat256x144;
        return null;
    }

    public void onEventAsync(WarpHEvent event) {
        double[] h = event.getH();
        synchronized (this) {
            if ((mode == Mode.SAMPLEWARPPLANE || mode == Mode.SAMPLEWARPGLASS) && useSample) {
                if (!isSetup)
                    setupMatrices();
                double hSmallToGlass[] = getHSmallToGlass(sampleBGR.height(), sampleBGR.width());
                if (hSmallToGlass == null) {
                    Log.w(TAG, "Warp: Bad size");
                    return;
                }
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
                if (!isSetup)
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
            if (!isSetup)
                setupMatrices();
            if (mode == Mode.CAM2GLASS) {
                Mat inputBGR;
                Mat frame = frameEvent.getCameraFrame().getRGB();
                if (frameBGR == null || frameBGR.height() != frame.height() || frameBGR.width() != frame.width())
                    frameBGR = new Mat(frame.rows(), frame.cols(), CvType.CV_8UC3);
                Mat hSmallToGlassMat = getHSmallToGlassMat(frame.rows(), frame.cols());
                if (hSmallToGlassMat == null) {
                    Log.w(TAG, "Warp: Bad size");
                    busy = false;
                    return;
                }
                Imgproc.cvtColor(frame, frameBGR, Imgproc.COLOR_RGB2BGR);
                inputBGR = frameBGR;
                Imgproc.warpPerspective(inputBGR, frameWarp, hSmallToGlassMat, new Size(frameWarp.width(), frameWarp.height()));
                drawFrame(frameWarp);
            }
            busy = false;
        }
    }

    void drawFrame(Mat modified) {
        // Partly from OpenCV CameraBridgeViewBase.java
        if (mCacheBitmap == null) {
            mCacheBitmap = Bitmap.createBitmap(modified.width(), modified.height(), Bitmap.Config.ARGB_8888);
        }
        boolean bmpValid = true;
        if (modified != null) {
            try {
                Utils.matToBitmap(modified, mCacheBitmap);
            } catch (Exception e) {
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
                canvas.drawBitmap(mCacheBitmap, new Rect(0, 0, mCacheBitmap.getWidth(), mCacheBitmap.getHeight()),
                        new Rect((canvas.getWidth() - mCacheBitmap.getWidth()) / 2,
                                (canvas.getHeight() - mCacheBitmap.getHeight()) / 2,
                                (canvas.getWidth() - mCacheBitmap.getWidth()) / 2 + mCacheBitmap.getWidth(),
                                (canvas.getHeight() - mCacheBitmap.getHeight()) / 2 + mCacheBitmap.getHeight()), null
                );

                view.getHolder().unlockCanvasAndPost(canvas);
            }
        }
    }

    public SurfaceView getView() {
        return view;
    }

    public enum Mode {
        CAM2GLASS, SAMPLEWARPPLANE, SAMPLEWARPGLASS
    }
}
