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
import android.view.MotionEvent;
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
        Log.i(TAG, "Lifecycle: Activity onCreate");
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
                bs.setMainActivity(MainActivity.this);

                // If we already have a view and aren't specifying a script to run, reuse the old script
                if (bs.webview != null && extra == null) {
                    // Remove view's parent so that we can re-add it later to a new activity
                    Log.i(TAG, "Lifecycle: Recycling webview");
                    bs.removeAllViews();
                    bs.refreshActivityView();
                    bs.getCameraManager().resume();
                    return;
                }
                Log.i(TAG, "Lifecycle: Creating new webview");

                bs.resetDefaultUrl();
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
        Log.i(TAG, "Lifecycle: MainActivity: onPause");
        isForeground = false;
        //if (bs != null)
        //    bs.getCameraManager().pause();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        super.onPause();
    }

    @Override
    public void onResume() {
        Log.i(TAG, "Lifecycle: MainActivity: onResume");
        isForeground = true;
        if (bs != null)
            bs.getCameraManager().resume();
        super.onResume();
    }

    public void onDestroy() {
        Log.i(TAG, "Lifecycle: MainActivity: onDestroy");
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (bs != null)
            bs.getCameraManager().pause();
        if (mConnection != null)
            unbindService(mConnection);
        super.onDestroy();
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

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.i(TAG, "Request code: " + requestCode + " Result code: " + resultCode);
        if (bs != null && bs.onActivityResult(requestCode, resultCode, intent))
            return;
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

    @Override
    public boolean onGenericMotionEvent(MotionEvent event) {
        if (bs == null)
            return false;
        GestureManager gm = bs.getGestureManager();
        if (gm == null)
            return false;
        // NOTE(brandyn): If you return true then the cardscroll won't get the gesture
        // TODO(brandyn): Consider registering overrides
        //return gm.onMotionEvent(event);
        gm.onMotionEvent(event);
        return false;
    }
}
