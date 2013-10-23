package com.dappervision.wearscript;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.ViewGroup;
import android.view.WindowManager;

import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.Mat;

import java.lang.ref.WeakReference;

public class MainActivity extends Activity {
    protected static final String TAG = "WearScript";
    private static final String EXTRA_NAME = "extra";
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


                if (bs.webview != null) {
                    // Remove view's parent so that we can re-add it later to a new activity
                    ViewGroup parentViewGroup = (ViewGroup) bs.webview.getParent();
                    if (parentViewGroup != null)
                        parentViewGroup.removeAllViews();
                    bs.updateActivityView();
                    return;
                }

                byte[] wsUrlArray = bs.LoadData("", "qr.txt");
                if (wsUrlArray == null) {
                    bs.say("Must set URL using ADB");
                    finish();
                    return;
                }
                bs.reset();
                bs.wsUrl = (new String(wsUrlArray)).trim();
                bs.startDefaultScript();

                //Intent intent = new Intent("com.google.zxing.client.android.SCAN");
                //startActivityForResult(intent, 0);
            }

            public void onServiceDisconnected(ComponentName className) {
                Log.i(TAG, "Service Disconnected");

            }
        };
        Log.i(TAG, "Calling bindService");
        startService(new Intent(this, BackgroundService.class));
        bindService(new Intent(this,
                BackgroundService.class), mConnection, Context.BIND_AUTO_CREATE);


        // TODO(brandyn): Handle extras
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
        Log.i(TAG, "MainActivity: onPause");
        isForeground = false;
        super.onPause();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    @Override
    public void onResume() {
        Log.i(TAG, "MainActivity: onResume");
        isForeground = true;
        super.onResume();
        OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, this, mLoaderCallback);
    }

    public void onDestroy() {
        Log.i(TAG, "MainActivity: onDestroy");
        super.onDestroy();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (mConnection != null)
            unbindService(mConnection);

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
                byte[] contentsArray = bs.LoadData("", "qr.txt");
                if (contentsArray == null) {
                    bs.say("Please exit and scan the QR code");
                    return;
                }
                contents = (new String(contentsArray)).trim();
                // TODO: We want to allow reentry into a running app
            }
            // TODO(brandyn): Handle case where we want to re-enter webview and not reset it
            bs.reset();
            bs.wsUrl = contents;
            bs.runScript("<script>function s() {WS.say('Server connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script>");
        }
    }
}
