package com.dappervision.wearscript.managers;

import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.RemoteException;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.SendEvent;
import com.radiusnetworks.ibeacon.IBeacon;
import com.radiusnetworks.ibeacon.IBeaconConsumer;
import com.radiusnetworks.ibeacon.RangeNotifier;
import com.radiusnetworks.ibeacon.Region;

import java.util.Collection;

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
        iBeaconManager.setRangeNotifier(new RangeNotifier() {
            @Override
            public void didRangeBeaconsInRegion(Collection<IBeacon> iBeacons, Region region) {
                if (iBeacons.size() > 0) {
                    Log.i(TAG, "A beacon is " + iBeacons.iterator().next().getAccuracy() + " meters away.");
                    Utils.eventBusPost(new SendEvent("ibeacon", iBeacons.iterator().next().getAccuracy()));
                }
            }
        });

        try {
            iBeaconManager.startRangingBeaconsInRegion(new Region("myRangingUniqueId", null, null, null));
        } catch (RemoteException e) {   }
    }

    // Methods usually implemented by the activity
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
