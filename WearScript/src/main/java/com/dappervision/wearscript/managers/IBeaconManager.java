package com.dappervision.wearscript.managers;

import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.RemoteException;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.radiusnetworks.ibeacon.IBeaconConsumer;
import com.radiusnetworks.ibeacon.MonitorNotifier;
import com.radiusnetworks.ibeacon.Region;

public class IBeaconManager extends Manager implements IBeaconConsumer{

    com.radiusnetworks.ibeacon.IBeaconManager iBeaconManager;
    Context context;

    public IBeaconManager(Context context, BackgroundService bs) {
        super(bs);
        this.context = context;
        iBeaconManager = com.radiusnetworks.ibeacon.IBeaconManager.getInstanceForApplication(context);
        iBeaconManager.bind(this);
    }

    @Override
    public void reset() {
        super.reset();
        iBeaconManager.unBind(this);
        iBeaconManager.bind(this);
    }

    @Override
    public void shutdown() {
        super.shutdown();
        iBeaconManager.unBind(this);
    }

    @Override
    public void onIBeaconServiceConnect() {
        iBeaconManager.setMonitorNotifier(new MonitorNotifier() {
            @Override
            public void didEnterRegion(Region region) {
                Log.i(TAG, "I just saw an iBeacon for the firt time!");
            }

            @Override
            public void didExitRegion(Region region) {
                Log.i(TAG, "I no longer see an iBeacon");
            }

            @Override
            public void didDetermineStateForRegion(int state, Region region) {
                Log.i(TAG, "I have just switched from seeing/not seeing iBeacons: "+state);
            }
        });

        try {
            iBeaconManager.startMonitoringBeaconsInRegion(new Region("myMonitoringUniqueId", null, null, null));
        } catch (RemoteException e) {   }
    }

    @Override
    public boolean bindService(Intent intent, ServiceConnection connection, int mode) {
        return context.bindService(intent, connection, mode);
    }

    @Override
    public void unbindService(ServiceConnection connection) {
        context.unbindService(connection);
    }

    @Override
    public Context getApplicationContext() {
        return context;
    }
}
