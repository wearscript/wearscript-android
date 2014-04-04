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
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.ActivityEvent;
import com.dappervision.wearscript.events.CameraEvents;
import com.dappervision.wearscript.events.PicarusBenchmarkEvent;
import com.dappervision.wearscript.events.PicarusEvent;
import com.dappervision.wearscript.events.PicarusRegistrationSampleEvent;
import com.dappervision.wearscript.events.PicarusStreamEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.WarpHEvent;

import org.msgpack.MessagePack;
import org.msgpack.type.ArrayValue;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import static org.msgpack.template.Templates.TValue;
import static org.msgpack.template.Templates.tList;

public class PicarusManager extends Manager {
    public static final String TAG = "PicarusManager";
    private byte[] registrationMatchModel;
    private byte[] registrationPointModel;
    private long registrationMatchModelCached, registrationPointModelCached;
    private ServiceConnection picarusConnection;
    private IBinder picarusService;
    private TreeMap<String, byte[]> streamModels;
    private byte[] pointSample;

    public PicarusManager(BackgroundService service) {
        super(service);
        registrationMatchModelCached = registrationMatchModelCached = 0;
        streamModels = new TreeMap<String, byte[]>();
        String model = "kYKia3eDrXBhdHRlcm5fc2NhbGXLP/AAAAAAAACmdGhyZXNoFKdvY3RhdmVzAqRuYW1lu3BpY2FydXMuQlJJU0tJbWFnZUZlYXR1cmUyZA==";
        registrationPointModel = Base64.decode(model.getBytes(), Base64.NO_WRAP);
        model = "kYKia3eDqG1heF9kaXN0eKttaW5faW5saWVycwqtcmVwcm9qX3RocmVzaMtAFAAAAAAAAKRuYW1l2gAkcGljYXJ1cy5JbWFnZUhvbW9ncmFwaHlSYW5zYWNIYW1taW5n";
        registrationMatchModel = Base64.decode(model.getBytes(), Base64.NO_WRAP);

        // Bind Service
        picarusConnection = new ServiceConnection() {
            public void onServiceConnected(ComponentName className, IBinder service) {
                Log.i(TAG, "Service Connected");
                picarusService = service;
            }

            public void onServiceDisconnected(ComponentName className) {
                Log.i(TAG, "Service Disconnected");
            }
        };
        Log.i(TAG, "Calling bindService");
        service.bindService(new Intent("com.dappervision.picarus.PicarusService"), picarusConnection, Context.BIND_AUTO_CREATE);
    }

    public void makeCachedModels() {
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        if (registrationPointModelCached != 0 && registrationMatchModelCached != 0)
            return;
        try {
            registrationPointModelCached = picarus.createModel(registrationPointModel);
        } catch (RemoteException e1) {
            Log.e(TAG, "Execution error");
            return;
        }
        try {
            registrationMatchModelCached = picarus.createModel(registrationMatchModel);
        } catch (RemoteException e1) {
            Log.e(TAG, "Execution error");
            return;
        }
    }

    public void onEventBackgroundThread(PicarusBenchmarkEvent e) {
        File dir = new File(Utils.dataPath() + "/samples/");
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        long model = 0;
        try {
            model = picarus.createModel(registrationPointModel);
        } catch (RemoteException e1) {
            Log.e(TAG, "Execution error");
            return;
        }
        for (File f : dir.listFiles()) {
            Log.d(TAG, "Benchmark Dir: " + f.getName());
            File[] fns = f.listFiles();
            Arrays.sort(fns);
            for (File f2 : fns) {
                Log.d(TAG, "Bench: Pre File: " + f2.getName());
                byte data[] = Utils.LoadFile(f2);
                Log.d(TAG, "Bench: File: " + f2.getName());
                try {
                    byte imagePoints[] = picarus.processBinary(model, data);
                    Log.d(TAG, "Bench: Points: " + imagePoints.length);
                } catch (RemoteException e1) {
                    Log.e(TAG, "Execution error");
                }
            }
        }
    }

    public void onEventBackgroundThread(PicarusEvent e) {
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        try {
            makeCall(e.getCallback(), "'" + Base64.encodeToString(picarus.processBinaryOld(e.getModel(), e.getInput()), Base64.NO_WRAP) + "'");
        } catch (RemoteException exeption) {
            Log.w(TAG, "PicarusService closed");
        }
        Log.d(TAG, "Called");
        unregisterCallback(e.getCallback());
    }

    public void onEvent(PicarusStreamEvent e) {
        synchronized (this) {
            streamModels.put(e.getCallback(), e.getModel());
        }
    }

    public void onEventBackgroundThread(PicarusRegistrationSampleEvent e) {
        synchronized (this) {
            IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
            makeCachedModels();
            Log.d(TAG, "Trying to call");
            try {
                pointSample = picarus.processBinary(registrationPointModelCached, e.getJPEG());
            } catch (RemoteException exeption) {
                Log.w(TAG, "PicarusService closed");
            }
            Log.d(TAG, "Point sample: " + Base64.encodeToString(pointSample, Base64.NO_WRAP));
        }
    }

    public byte[] msgpackPoints(byte[] points0, byte[] points1) {
        List<Value> data = new ArrayList<Value>();
        MessagePack msgpack = new MessagePack();

        data.add(ValueFactory.createRawValue(points0));
        data.add(ValueFactory.createRawValue(points1));
        try {
            return msgpack.write(data);
        } catch (IOException e) {
            // TODO(brandyn): Handle
        }
        return null;
    }

    public double[] msgpackParseH(byte[] match) {
        double [] h = new double[9];
        MessagePack msgpack = new MessagePack();
        ArrayValue hArray = null;
        try {
            hArray = msgpack.read(match).asArrayValue().get(0).asArrayValue();
        } catch (IOException e) {
            return null;
        }
        for (int i = 0; i < 9; i++) {
            h[i] = hArray.get(i).asFloatValue().getDouble();
            Log.d(TAG, String.format("H[%d]: %f", i, h[i]));
        }
        return h;
    }

    public void processFrame(CameraEvents.Frame frameEvent) {
        synchronized (this) {
            if (streamModels.isEmpty() && pointSample == null)
                return;
        }
        byte[] frameJPEG = frameEvent.getCameraFrame().getPPM();
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        Log.d(TAG, "CamPath: Pre Picarus");
        for (Map.Entry<String, byte[]> entry : streamModels.entrySet()) {
            Log.d(TAG, "CamPath: Picarus Trying to call");
            try {
                makeCall(entry.getKey(), "'" + Base64.encodeToString(picarus.processBinaryOld(entry.getValue(), frameJPEG), Base64.NO_WRAP) + "'");
            } catch (RemoteException exeption) {
                Log.w(TAG, "PicarusService closed");
            }
        }
        if (pointSample != null) {
            byte imagePoints[];
            makeCachedModels();
            try {
                Log.d(TAG, "CamPath: Picarus points");
                imagePoints = picarus.processBinary(registrationPointModelCached, frameJPEG);
                Log.d(TAG, "CamPath: Picarus match");
                byte match[] = picarus.processBinary(registrationMatchModelCached, msgpackPoints(pointSample, imagePoints));
                if (match != null) {
                    Log.d(TAG, "CamPath: Match: " + match.length);
                    Utils.eventBusPost(new WarpHEvent(msgpackParseH(match)));
                }
            } catch (RemoteException exeption) {
                Log.w(TAG, "PicarusService closed");
            }
        }
        Log.d(TAG, "CamPath: Post Picarus");
    }
}