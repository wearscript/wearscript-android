package com.dappervision.wearscript.managers;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.util.Base64;
import android.view.SurfaceView;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.jsevents.CameraEvents;
import com.dappervision.wearscript.jsevents.OpenGLEvent;
import com.dappervision.wearscript.jsevents.OpenGLRenderEvent;

import org.json.simple.JSONArray;
import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import java.util.concurrent.LinkedBlockingQueue;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public class WarpManager extends Manager {
    public static final String TAG = "WarpManager";
    private final boolean warp;
    protected Mat hSmallToGlassMat;
    private Bitmap mCacheBitmap;
    private SurfaceView view;

    public WarpManager(BackgroundService bs) {
        super(bs);
        view = new SurfaceView(bs);
        warp = true;
        reset();
    }

    @Override
    public void reset() {
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

    void setupMatrices() {
        double hSmallToBig[] = {3., 0., 304., 0., 3., 388., 0., 0., 1.};
        double hBigToGlass[] = {1.3960742363652061, -0.07945137930533697, -1104.2947209648783, 0.006275578662065556, 1.3523872016751255, -504.1266472917187, -1.9269902737e-05, -9.708578143e-05, 1};
        //double hBigToGlass[] = {1.4538965634675285, -0.10298433991228334, -1224.726117650959, 0.010066418722892632, 1.3287672714218164, -526.977020143425, -4.172194829863231e-05, -0.00012170226282961026, 1.0};
        double hSmallToGlass[] = HMult(hBigToGlass, hSmallToBig);
        hSmallToGlassMat = HMatFromArray(hSmallToGlass);
    }

    Mat imageLike(Mat image) {
        if (image.channels() == 3)
            return new Mat(image.rows(), image.cols(), CvType.CV_8UC4);
        return new Mat(image.rows(), image.cols(), CvType.CV_8UC3);
    }

    public void onEventAsync(CameraEvents.Frame frameEvent) {
        if (!warp)
            return;
        if (hSmallToGlassMat == null)
            setupMatrices();
        Mat frame = frameEvent.getCameraFrame().getRGB();
        Mat frameBGR = new Mat(frame.rows(), frame.cols(), CvType.CV_8UC3);
        Imgproc.cvtColor(frame, frameBGR, Imgproc.COLOR_RGB2BGR);
        Mat frameWarp = imageLike(frameBGR);
        Imgproc.warpPerspective(frameBGR, frameWarp, hSmallToGlassMat, new Size(frameWarp.width(), frameWarp.height()));
        drawFrame(frameWarp);
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
