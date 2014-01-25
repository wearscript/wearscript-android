package com.dappervision.wearscript.activities;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.WindowManager;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.jsevents.ActivityResultEvent;
import com.dappervision.wearscript.jsevents.StartActivityEvent;
import com.dappervision.wearscript.managers.CameraManager;
import com.dappervision.wearscript.managers.OpenGLManager;

public class MainActivity extends Activity {
    protected static final String TAG = "WearScript";
    private static final String EXTRA_NAME = "extra";
    public boolean isGlass = true, isForeground = true;
    public BackgroundService bs;
    ServiceConnection mConnection;
    private String extra;
    private boolean mHadUrlExtra = false;

    public MainActivity() {
    }

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.register(this);
        Utils.getEventBus().register(this);
        Log.i(TAG, "Lifecycle: Activity onCreate");
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        Intent thisIntent = getIntent();
        if (thisIntent.getStringExtra(EXTRA_NAME) != null) {
            mHadUrlExtra = true;
            extra = thisIntent.getStringExtra(EXTRA_NAME);
            Log.d(TAG, "Found extra: " + extra);
        } else {
            Log.d(TAG, "Did not find extra.");
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
                    ((CameraManager)bs.getManager(CameraManager.class)).resume();
                    return;
                }
                Log.i(TAG, "Lifecycle: Creating new webview");

                if (extra != null) {
                    Log.i(TAG, "Extra script: " + extra);
                    // TODO(brandyn): Get launcher scripts working again
                    //bs.runScriptUrl(extra);
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
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (bs != null) {
            ((OpenGLManager)bs.getManager(OpenGLManager.class)).getView().onPause();
        }
        super.onPause();
    }

    @Override
    public void onResume() {
        Log.i(TAG, "Lifecycle: MainActivity: onResume");
        isForeground = true;
        if (bs != null) {
            ((CameraManager)bs.getManager(CameraManager.class)).resume();
            ((OpenGLManager)bs.getManager(OpenGLManager.class)).getView().onResume();
        }
        super.onResume();
    }

    public void onDestroy() {
        Log.i(TAG, "Lifecycle: MainActivity: onDestroy");
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (mConnection != null) {
            unbindService(mConnection);
            mConnection = null;
        }
        Utils.getEventBus().unregister(this);
        super.onDestroy();
    }

    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_CAMERA) {
            if (bs != null)
                ((CameraManager)bs.getManager(CameraManager.class)).pause();
            return false;
        } else {
            return super.onKeyDown(keyCode, event);
        }
    }

    public void onEvent(StartActivityEvent event) {
        startActivityForResult(event.getIntent(), event.getRequestCode());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.i(TAG, "Request code: " + requestCode + " Result code: " + resultCode);
        Utils.eventBusPost(new ActivityResultEvent(requestCode, resultCode, intent));
    }

    @Override
    public boolean onGenericMotionEvent(MotionEvent event) {
        // NOTE(brandyn): If you return true then the cardscroll won't get the gesture
        // TODO(brandyn): Consider registering overrides
        // TODO(brandyn): We may need the return value here
        //return gm.onMotionEvent(event);
        Utils.eventBusPost(event);
        return false;
    }
}
