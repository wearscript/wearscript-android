package com.dappervision.wearscript.managers;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.WearScript;
import com.dappervision.wearscript.dataproviders.PebbleEventReceiver;
import com.dappervision.wearscript.events.PebbleMessageEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.SensorJSEvent;
import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.util.PebbleDictionary;

import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import de.greenrobot.event.Subscribe;

public class PebbleManager extends Manager{
    private static final String TAG = "PebbleManager";
    private final static UUID PEBBLE_APP_UUID = UUID.fromString("88c99af8-9512-4e23-b79e-ba437c788446");

    private PebbleEventReceiver dataReceiver;
    private PebbleKit.PebbleAckReceiver ackReceiver;
    private PebbleKit.PebbleNackReceiver nackReceiver;
    private final PebbleMessageManager pebbleMessageManager;

    public static final String ONPEBBLE = "onPebble";

    public static class Cmd {
        public static final int Cmd_setText = 0;
        public static final int Cmd_singleClick = 1;
        public static final int Cmd_longClick = 2;
        public static final int Cmd_accelTap = 3;
        public static final int Cmd_vibe = 4;
        public static final int Cmd_setScrollable = 5;
        public static final int Cmd_setStyle = 6;
        public static final int Cmd_setFullScreen = 7;
        public static final int Cmd_accelData = 8;
        public static final int Cmd_getAccelData = 9;
        public static final int Cmd_configAcceldata = 10;
        public static final int Cmd_configButtons = 11;
    }

    public static class Button {
        public static final int BACK = 0;
        public static final int UP = 1;
        public static final int SELECT = 2;
        public static final int DOWN = 3;
    }

    public static String parseButton(int button) {
        switch (button) {
            case Button.UP:
                return "UP";
            case Button.SELECT:
                return "SELECT";
            case Button.DOWN:
                return "DOWN";
            case Button.BACK:
                return "BACK";
            default:
                return null;
        }
    }

    public PebbleManager(Context context, BackgroundService bs) {
        super(bs);
        pebbleMessageManager = new PebbleMessageManager(context);
        reset();
    }

    @Override
    public void reset() {
        super.reset();
        teardown();
        setup();
    }

    @Override
    public void shutdown() {
        super.shutdown();
        pebbleAccelSensorOff();
        teardown();
    }

    /*
     * Methods to communicate with pebble
     */

    public void onPebbleSingleClick(String button) {
        makeCall("onPebbleSingleClick", String.format("'%s'", button));
        makeCall("onPebbleSingleClick" + button, "");
        String device = "TODO";
        Utils.eventBusPost(new SendEvent(String.format("gesture:pebble:singleClick:%s:%s", button, device), "singleClick", button));
    }

    public void onPebbleLongClick(String button) {
        makeCall("onPebbleLongClick", String.format("'%s'", button));
        makeCall("onPebbleLongClick" + button, "");
        String device = "TODO";
        Utils.eventBusPost(new SendEvent(String.format("gesture:pebble:longClick:%s:%s", button, device), "longClick", button));
    }

    public void onPebbleAccelTap(int axis, int direction) {
        makeCall("onPebbleAccelTap", String.format("'%d, %d'", axis, direction));
        String device = "TODO";
        Utils.eventBusPost(new SendEvent("gesture:pebble:accelTap:" + device, "accelTap", axis, direction));
    }

    public void pebbleSetTitle(String title, boolean clear) {
        PebbleDictionary data = new PebbleDictionary();
        data.addInt8(0, (byte) Cmd.Cmd_setText);
        data.addString(1, title);
        if(clear)
            data.addInt32(4, 1);
        pebbleMessageManager.offer(data);
    }

    public void pebbleSetBody(String body, boolean clear) {
        PebbleDictionary data = new PebbleDictionary();
        data.addInt8(0, (byte) Cmd.Cmd_setText);
        data.addString(3, body);
        if(clear)
            data.addInt32(4, 1);
        pebbleMessageManager.offer(data);
    }

    public void pebbleSetSubTitle(String subTitle, boolean clear) {
        PebbleDictionary data = new PebbleDictionary();
        data.addInt8(0, (byte) Cmd.Cmd_setText);
        data.addString(2, subTitle);
        if(clear)
            data.addInt32(4, 1);
        pebbleMessageManager.offer(data);
    }

    public void pebbleVibe(int type) {
        PebbleDictionary data = new PebbleDictionary();
        data.addInt8(0, (byte) Cmd.Cmd_vibe);
        data.addInt32(1, type);
        pebbleMessageManager.offer(data);
    }

    public void pebbleAccelSensorOn(int rate) {
        PebbleDictionary data = new PebbleDictionary();

        data.addInt8(0, (byte) Cmd.Cmd_configAcceldata);
        data.addInt32(1, rate); // Set rate 10 25 50 100
        data.addInt32(2, 1);    // Hard code 1 for data samples
        data.addInt32(3, 1);    // subscribe
        pebbleMessageManager.offer(data);
    }

    public void pebbleAccelSensorOff() {
        PebbleDictionary data = new PebbleDictionary();

        data.addInt8(0, (byte) Cmd.Cmd_configAcceldata);
        data.addInt32(3, 0);
        pebbleMessageManager.offer(data);
    }

    public void pebbleconfigGesture(boolean up, boolean down, boolean back, boolean select) {
        PebbleDictionary data = new PebbleDictionary();
        // set up all buttons
        data.addInt32(1, up ? 1 : 0);
        data.addInt32(2, select ? 1 : 0);
        data.addInt32(3, down ? 1 : 0);
        data.addInt32(4, back ? 1 : 0);
    }

    @Subscribe
    public void onEvent(PebbleMessageEvent event) {
        String type = event.getType();
        Log.i("manager on event", type);
        if(type.equals("setTitle"))
            pebbleSetTitle(event.getText(), event.getClear());
        if(type.equals("setSubtitle"))
            pebbleSetSubTitle(event.getText(), event.getClear());
        if(type.equals("setBody"))
            pebbleSetBody(event.getText(), event.getClear());
        if(type.equals("vibe")) {
            pebbleVibe(event.getVibeType());
        }
    }

    @Subscribe
    public void onEvent(SensorJSEvent event) {
        int type = event.getType();
        if(event.getStatus()) {
            if (type == WearScript.SENSOR.PEBBLE_ACCELEROMETER.id())
                pebbleAccelSensorOn((int) event.getSampleTime());
        }
        else {
            pebbleAccelSensorOff();
        }
    }


    private void teardown() {
        if(dataReceiver != null) {
            service.getApplicationContext().unregisterReceiver(dataReceiver);
            dataReceiver = null;
        }
        if (ackReceiver != null) {
            service.getApplicationContext().unregisterReceiver(ackReceiver);
            ackReceiver = null;
        }
        if (nackReceiver != null) {
            service.getApplicationContext().unregisterReceiver(nackReceiver);
            nackReceiver = null;
        }
    }

    private void setup() {
        // Start thread for sending messages
        new Thread(pebbleMessageManager).start();

        // Set up broadcast receivers
        dataReceiver = new PebbleEventReceiver(PEBBLE_APP_UUID, this);
        PebbleKit.registerReceivedDataHandler(service.getApplicationContext(), dataReceiver);

        ackReceiver = new PebbleKit.PebbleAckReceiver(PEBBLE_APP_UUID) {
            @Override
            public void receiveAck(Context context, int transactionId) {
                pebbleMessageManager.notifyAckReceivedAsync();
                Log.i("receiveAck", " " + transactionId);
            }
        };

        PebbleKit.registerReceivedAckHandler(service.getApplicationContext(), ackReceiver);

        nackReceiver = new PebbleKit.PebbleNackReceiver(PEBBLE_APP_UUID) {
            @Override
            public void receiveNack(Context context, int transactionId) {
                pebbleMessageManager.notifyNackReceivedAsync();
                Log.i("receiveNack", " " + transactionId);
            }
        };

        PebbleKit.registerReceivedNackHandler(service.getApplicationContext(), nackReceiver);
    }

    /*
        Class to handle pebble messaging
     */
    public class PebbleMessageManager implements Runnable {
        public Handler messageHandler;
        private final BlockingQueue<PebbleDictionary> messageQueue = new LinkedBlockingQueue<PebbleDictionary>();
        private Boolean isMessagePending = Boolean.valueOf(false);
        private Context context;

        public PebbleMessageManager(Context context) {
            this.context = context;
        }

        @Override
        public void run() {
            Looper.prepare();
            messageHandler = new Handler() {
                @Override
                public void handleMessage(Message msg) {
                    Log.w(this.getClass().getSimpleName(), "Please post() your blocking runnables to Mr Manager, " +
                            "don't use sendMessage()");
                }

            };
            Looper.loop();
        }

        private void consumeAsync() {
            messageHandler.post(new Runnable() {
                @Override
                public void run() {
                    synchronized (isMessagePending) {
                        if (isMessagePending.booleanValue()) {
                            return;
                        }

                        synchronized (messageQueue) {
                            if (messageQueue.size() == 0) {
                                return;
                            }
                            PebbleKit.sendDataToPebble(context, PEBBLE_APP_UUID, messageQueue.peek());
                        }

                        isMessagePending = Boolean.valueOf(true);
                    }
                }
            });
        }

        public void notifyAckReceivedAsync() {
            messageHandler.post(new Runnable() {
                @Override
                public void run() {
                    synchronized (isMessagePending) {
                        isMessagePending = Boolean.valueOf(false);
                    }
                    if(!messageQueue.isEmpty())
                        messageQueue.remove();
                }
            });
            consumeAsync();
        }

        public void notifyNackReceivedAsync() {
            messageHandler.post(new Runnable() {
                @Override
                public void run() {
                    synchronized (isMessagePending) {
                        isMessagePending = Boolean.valueOf(false);
                    }
                }
            });
            consumeAsync();
        }

        public boolean offer(final PebbleDictionary data) {
            final boolean success = messageQueue.offer(data);

            if (success) {
                consumeAsync();
            }

            return success;
        }
    }



}
