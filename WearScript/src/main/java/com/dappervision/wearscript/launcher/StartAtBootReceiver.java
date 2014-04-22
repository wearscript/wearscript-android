package com.dappervision.wearscript.launcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Created by scottgwald on 4/20/14.
 */
public class StartAtBootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Intent startIntent = new Intent(context, MainActivity.class);
            startIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startIntent.setAction(Intent.ACTION_MAIN);
            context.startActivity(startIntent);
        }
    }
}
