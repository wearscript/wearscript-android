package com.dappervision.wearscript;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.view.WindowManager;
import java.lang.ref.WeakReference;

public class MainActivity extends Activity {
    protected static final String TAG = "WearScript";
    private static final String EXTRA_NAME = "extra";
    public boolean isGlass = true, isForeground = true;
    protected BackgroundService bs;
    ServiceConnection mConnection;
    private String extra;
    private boolean mHadUrlExtra = false;

    public MainActivity() {
        Log.i(TAG, "Instantiated new " + this.getClass());
    }

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        Intent thisIntent = getIntent();
        if (thisIntent.getStringExtra(EXTRA_NAME) != null) {
            mHadUrlExtra = true;
            extra = thisIntent.getStringExtra(EXTRA_NAME);
            Log.v(TAG, "Found extra: " + extra);
        } else {
            Log.v(TAG, "Did not find extra.");
        }
        // Bind Service
        super.onCreate(savedInstanceState);
        mConnection = new ServiceConnection() {
            public void onServiceConnected(ComponentName className, IBinder service) {
                Log.i(TAG, "Service Connected");
                bs = ((BackgroundService.LocalBinder) service).getService();
                if (bs.activity != null) {
                    MainActivity activity = bs.activity.get();
                    if (activity != null)
                        activity.finish();
                }
                bs.activity = new WeakReference<MainActivity>(MainActivity.this);

                // If we already have a view and aren't specifying a script to run, reuse the old script
                if (bs.webview != null && extra == null) {
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
                if (extra != null) {
                    Log.i(TAG, "Extra script");
                    bs.runScriptUrl(extra);
                } else {
                    Log.i(TAG, "Default script");
                    bs.startDefaultScript();
                }
            }

            public void onServiceDisconnected(ComponentName className) {
                Log.i(TAG, "Service Disconnected");

            }
        };
        Log.i(TAG, "Calling bindService");
        startService(new Intent(this, BackgroundService.class));
        bindService(new Intent(this,
                BackgroundService.class), mConnection, Context.BIND_AUTO_CREATE);
    }

    @Override
    public void onPause() {
        Log.i(TAG, "MainActivity: onPause");
        isForeground = false;
        bs.getCameraManager().pause();
        super.onPause();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    @Override
    public void onResume() {
        Log.i(TAG, "MainActivity: onResume");
        isForeground = true;
        super.onResume();
        if (bs != null)
            bs.getCameraManager().resume();
    }

    public void onDestroy() {
        Log.i(TAG, "MainActivity: onDestroy");
        super.onDestroy();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (mConnection != null)
            unbindService(mConnection);

    }

    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_CAMERA) {
            if (bs != null)
                bs.getCameraManager().pause();
            return false;
        } else {
            return super.onKeyDown(keyCode, event);
        }
    }
}
