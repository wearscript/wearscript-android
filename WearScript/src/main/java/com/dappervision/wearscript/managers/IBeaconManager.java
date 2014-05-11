package com.dappervision.wearscript.managers;

import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.RemoteException;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.events.CallbackRegistration;
import com.radiusnetworks.ibeacon.IBeacon;
import com.radiusnetworks.ibeacon.IBeaconConsumer;
import com.radiusnetworks.ibeacon.RangeNotifier;
import com.radiusnetworks.ibeacon.Region;

import java.util.Collection;

import com.radiusnetworks.ibeacon.MonitorNotifier;

public class IBeaconManager extends Manager implements IBeaconConsumer{

    public static final String RANGE_NOTIFICATION = "RANGE_NOTIFICATION";
    public static final String ENTER_REGION = "ENTER_REGION";
    public static final String EXIT_REGION = "EXIT_REGION";
    private com.radiusnetworks.ibeacon.IBeaconManager iBeaconManager;

    Region MONITOR_REGION = new Region("myMonitoringUniqueId", null, null, null);
    Region RANGING_REGION = new Region("myRangingUniqueId", null, null, null);

    public IBeaconManager(BackgroundService bs) {
        super(bs);
    }

    @Override
    public void reset() {
        super.reset();
        ibeaconOff();
        ibeaconOn();
    }

    @Override
    public void shutdown() {
        super.shutdown();
        ibeaconOff();
    }

    public void ibeaconOn() {
        if(iBeaconManager == null)
            iBeaconManager = com.radiusnetworks.ibeacon.IBeaconManager.getInstanceForApplication(service);
        if(!iBeaconManager.isBound(this))
            iBeaconManager.bind(this);
    }

    public void ibeaconOff() {
        if(iBeaconManager == null)
            return;
        try {
            iBeaconManager.stopMonitoringBeaconsInRegion(MONITOR_REGION);
            iBeaconManager.stopRangingBeaconsInRegion(RANGING_REGION);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
        iBeaconManager.unBind(this);
        iBeaconManager = null;
    }

    protected void setupCallback(CallbackRegistration e) {
        super.setupCallback(e);
        ibeaconOn();
    }

    @Override
    public void onIBeaconServiceConnect() {
        iBeaconManager.setRangeNotifier(new RangeNotifier() {
            @Override
            public void didRangeBeaconsInRegion(Collection<IBeacon> iBeacons, Region region) {
                for(IBeacon myBeacon : iBeacons){
                    if(myBeacon.getAccuracy() >= 0)
                        makeCall(RANGE_NOTIFICATION, myBeacon.getProximityUuid(), String.valueOf(myBeacon.getRssi()), String.valueOf(myBeacon.getMajor()), String.valueOf(myBeacon.getMinor()));
                }
            }
        });

        try {
            iBeaconManager.startRangingBeaconsInRegion(RANGING_REGION);
        } catch (RemoteException e) {   }

        iBeaconManager.setMonitorNotifier(new MonitorNotifier() {
            @Override
            public void didEnterRegion(Region region) {
                makeCall(ENTER_REGION, region.getProximityUuid(), String.valueOf(region.getUniqueId()), String.valueOf(region.getMajor()), String.valueOf(region.getMinor()));
            }

            @Override
            public void didExitRegion(Region region) {
                makeCall(EXIT_REGION, region.getProximityUuid(), String.valueOf(region.getUniqueId()), String.valueOf(region.getMajor()), String.valueOf(region.getMinor()));
            }

            @Override
            public void didDetermineStateForRegion(int state, Region region) {
                Log.i(TAG, "I have just switched from seeing/not seeing iBeacons: "+state);
            }
        });

        try {
            iBeaconManager.startMonitoringBeaconsInRegion(MONITOR_REGION);
        } catch (RemoteException e) {   }
    }

    // Methods usually implemented by the activity
    @Override
    public boolean bindService(Intent intent, ServiceConnection connection, int mode) {
        return service.bindService(intent, connection, mode);
    }

    @Override
    public void unbindService(ServiceConnection connection) {
        service.unbindService(connection);
    }

    @Override
    public Context getApplicationContext() {
        return service;
    }
}
