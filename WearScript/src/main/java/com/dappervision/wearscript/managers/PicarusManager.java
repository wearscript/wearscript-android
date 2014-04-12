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
import com.dappervision.wearscript.events.CameraEvents;
import com.dappervision.wearscript.events.PicarusBenchmarkEvent;
import com.dappervision.wearscript.events.PicarusEvent;
import com.dappervision.wearscript.events.PicarusModelCreateEvent;
import com.dappervision.wearscript.events.PicarusModelProcessEvent;
import com.dappervision.wearscript.events.PicarusModelProcessStreamEvent;
import com.dappervision.wearscript.events.PicarusModelProcessWarpEvent;
import com.dappervision.wearscript.events.PicarusRegistrationSampleEvent;
import com.dappervision.wearscript.events.WarpHEvent;

import org.msgpack.MessagePack;
import org.msgpack.type.ArrayValue;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.TreeSet;

public class PicarusManager extends Manager {
    public static final String TAG = "PicarusManager";
    public static String MODEL_STREAM = "MODELSTREAM:";
    public static String MODEL_WARP = "MODELWARP:";
    private byte[] arModel;
    private byte[] registrationMatchModel;
    private byte[] registrationPointModel;
    private long registrationMatchModelCached, registrationPointModelCached, arModelCached;
    private ServiceConnection picarusConnection;
    private IBinder picarusService;
    private TreeMap<Integer, Long> modelCache;
    private TreeSet<Integer> modelStream;
    private TreeSet<Integer> modelWarp;

    private byte[] pointSample;

    public PicarusManager(BackgroundService service) {
        super(service);
        // TODO(brandyn): Verify that models are thread safe, if not then synchronize on the modelPointer
        // TODO(brandyn): Free all models in the cache on reset()
        registrationMatchModelCached = registrationMatchModelCached = 0;
        String model = "kYKia3eDrXBhdHRlcm5fc2NhbGXLP/AAAAAAAACmdGhyZXNoFKdvY3RhdmVzAqRuYW1lu3BpY2FydXMuQlJJU0tJbWFnZUZlYXR1cmUyZA==";
        registrationPointModel = Base64.decode(model.getBytes(), Base64.NO_WRAP);
        model = "kYKia3eDqG1heF9kaXN0eKttaW5faW5saWVycwqtcmVwcm9qX3RocmVzaMtAFAAAAAAAAKRuYW1l2gAkcGljYXJ1cy5JbWFnZUhvbW9ncmFwaHlSYW5zYWNIYW1taW5n";
        registrationMatchModel = Base64.decode(model.getBytes(), Base64.NO_WRAP);
        model = "kYKia3eApG5hbWW4cGljYXJ1cy5BUk1hcmtlckRldGVjdG9y";
        arModel = Base64.decode(model.getBytes(), Base64.NO_WRAP);

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
        reset();
    }

    @Override
    public void reset() {
        super.reset();
        if (modelCache != null && !modelCache.isEmpty()) {
            IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
            for (Integer id : modelCache.keySet()) {
                try {
                    picarus.deleteModel(id);
                } catch (RemoteException e1) {
                    Log.e(TAG, "Execution error");
                }
            }
        }
        modelCache = new TreeMap<Integer, Long>();
        modelStream = new TreeSet<Integer>();
        modelWarp = new TreeSet<Integer>();
    }

    public void makeCachedModels() {
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        if (registrationPointModelCached != 0 && registrationMatchModelCached != 0 && arModelCached != 0)
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
        try {
            arModelCached = picarus.createModel(arModel);
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

    public void onEventBackgroundThread(PicarusModelCreateEvent e) {
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        try {
            Long modelPointer = picarus.createModel(e.getModel());
            synchronized (this) {
                modelCache.put(e.getId(), modelPointer);
            }
            makeCallDirect(e.getCallback(), "");
        } catch (RemoteException e1) {
            Log.e(TAG, "Execution error");
        }
    }

    public void onEventBackgroundThread(PicarusModelProcessEvent e) {
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        Long modelPointer = modelCache.get(e.getId());
        if (modelPointer == null)
            return;
        try {
            byte[] output = picarus.processBinary(modelPointer, e.getInput());
            makeCallDirect(e.getCallback(), "'" + Base64.encodeToString(output, Base64.NO_WRAP) + "'");
        } catch (RemoteException exeption) {
            Log.w(TAG, "PicarusService closed");
        }
    }

    public void onEventBackgroundThread(PicarusModelProcessStreamEvent e) {
        synchronized (this) {
            modelStream.add(e.getId());
        }
    }

    public void onEventBackgroundThread(PicarusModelProcessWarpEvent e) {
        synchronized (this) {
            modelWarp.add(e.getId());
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

    public void onEventBackgroundThread(PicarusRegistrationSampleEvent e) {
        // TODO(brandyn): Look into whether this should be async
        synchronized (this) {
            IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
            makeCachedModels();
            Log.d(TAG, "Trying to call");
            byte [] input = e.getJPEG();
            try {
                pointSample = picarus.processBinary(registrationPointModelCached, input);
            } catch (RemoteException exeption) {
                Log.w(TAG, "PicarusService closed");
            }
            TreeSet<Integer> modelWarpCopy;
            synchronized (this) {
                modelWarpCopy = new TreeSet<Integer>(modelWarp);
            }
            for (Integer id : modelWarpCopy) {
                try {
                    Long modelPointer = modelCache.get(id);
                    byte [] output = picarus.processBinary(modelPointer, input);
                    Log.d(TAG, "Picarus calling warp model");
                    makeCall(MODEL_WARP + id, "'" + Base64.encodeToString(output, Base64.NO_WRAP) + "'");
                } catch (RemoteException exeption) {
                    Log.w(TAG, "PicarusService closed");
                }
            }
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
            Log.e(TAG, "Couldn't parse H");
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
            if (modelStream.isEmpty() && pointSample == null)
                return;
        }
        // TODO(brandyn): Benchmark this vs jpeg
        byte[] frameJPEG = frameEvent.getCameraFrame().getPPM();
        IPicarusService picarus = IPicarusService.Stub.asInterface(picarusService);
        Log.d(TAG, "CamPath: Pre Picarus");
        TreeSet<Integer> modelStreamCopy;
        synchronized (this) {
            modelStreamCopy = new TreeSet<Integer>(modelStream);
        }
        for (Integer id : modelStreamCopy) {
            try {
                Long modelPointer = modelCache.get(id);
                byte [] output = picarus.processBinary(modelPointer, frameJPEG);
                makeCall(MODEL_STREAM + id, "'" + Base64.encodeToString(output, Base64.NO_WRAP) + "'");
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