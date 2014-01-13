package com.dappervision.wearscript.managers;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Base64;

import com.dappervision.picarus.IPicarusService;
import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;

public class PicarusManager extends Manager {
    public PicarusManager(BackgroundService service) {
        super(service);


        // Bind Service
        ServiceConnection picarusConnection = new ServiceConnection() {
            public void onServiceConnected(ComponentName className, IBinder service) {
                Log.i(TAG, "Service Connected");
                IPicarusService picarus = IPicarusService.Stub.asInterface(service);
                byte[] config = Base64.decode("koKia3eDpHNpemVAq2NvbXByZXNzaW9uo2pwZ6ZtZXRob2SuZm9yY2VfbWF4X3NpZGWkbmFtZblwaWNhcnVzLkltYWdlUHJlcHJvY2Vzc29ygqJrd4OmbGV2ZWxzAaRtb2Rlo2xhYqhudW1fYmluc5MEBASkbmFtZb1waWNhcnVzLkhpc3RvZ3JhbUltYWdlRmVhdHVyZQ==", Base64.NO_WRAP);

                byte[] input = Base64.decode("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAFAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9iKKKK/5/z9UP/9k=", Base64.NO_WRAP);

                try {
                    Log.i("Picarus", "picarus :" + Base64.encodeToString(picarus.processBinary(config, input), Base64.NO_WRAP));
                } catch (RemoteException e) {
                    Log.w(TAG, "PicarusService closed");
                }
            }

            public void onServiceDisconnected(ComponentName className) {
                Log.i(TAG, "Service Disconnected");

            }
        };
        Log.i(TAG, "Calling bindService");
        service.bindService(new Intent("com.dappervision.picarus.PicarusService"), picarusConnection, Context.BIND_AUTO_CREATE);
        reset();
    }
}
