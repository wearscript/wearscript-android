package com.dappervision.wearscript.managers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.events.CallbackRegistration;

public class RecordingManager extends Manager {
    BroadcastReceiver broadcastReceiver;
    public static String TAG = "RecordingManager";
    public static String SAVED = "SAVED";

    public RecordingManager(BackgroundService service) {
        super(service);
        reset();
    }

    public void onEvent(CallbackRegistration e) {
        if (e.getManager().equals(this.getClass())) {
            registerCallback(e.getEvent(), e.getCallback());
            //startActivity();
            Log.d(TAG, "in onEvent(CallbackRegistration e)!");

            Log.d(TAG, "registering for callback");
            broadcastReceiver = new RecordingBroadcastReceiver();
            IntentFilter intentFilter = new IntentFilter("com.wearscript.record.FILE_WRITTEN_VIDEO");
            intentFilter.addAction("com.wearscript.record.FILE_WRITTEN_AUDIO");
            service.registerReceiver(broadcastReceiver, intentFilter);
        }
    }

    protected void makeCall(String key, String data) {
        super.makeCall(key, "'" + data + "'");
    }

    public static class RecordingBroadcastReceiver extends BroadcastReceiver {
        RecordingManager rm;

        public RecordingBroadcastReceiver() {
            super();
            this.rm = (RecordingManager) ManagerManager.get().get(RecordingManager.class);
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "in onReceive()");
            if (intent.getAction().equals("com.wearscript.record.FILE_WRITTEN_AUDIO")) {
                Log.d(TAG, "in RecordingBroadcastReceiver");
                rm.makeCall(SAVED, intent.getStringExtra("filepath"));
                rm.jsCallbacks.remove(SAVED);
            }
        }
    }
}