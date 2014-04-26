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
import com.dappervision.wearscript.events.LiveCardAddItemsEvent;
import com.dappervision.wearscript.events.LiveCardMenuSelectedEvent;
import com.dappervision.wearscript.events.LiveCardSetMenuEvent;
import com.dappervision.wearscript.events.PebbleMessageEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.events.SensorJSEvent;
import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.util.PebbleDictionary;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class LiveCardManager extends Manager{
    private static final String TAG = "LiveCardManager";
    private ArrayList<String> menu;

    public LiveCardManager(BackgroundService service) {
        super(service);
        reset();
    }

    @Override
    public void reset() {
        super.reset();
        menu = new ArrayList<String>();
    }

    public void onEventBackgroundThread(LiveCardMenuSelectedEvent event) {
        makeCall("item:" + event.getPosition(), "");
        Log.d(TAG, "Position: " + event.getPosition());
    }

    public void onEventBackgroundThread(LiveCardSetMenuEvent event) {
        Log.d(TAG, "SetMenuActivity: " + event.getMenu());
        JSONArray data = (JSONArray)JSONValue.parse(event.getMenu());
        reset();
        for (Object item: data) {
            JSONObject itemJS = (JSONObject)item;
            registerCallback("item:" + menu.size(), (String)itemJS.get("callback"));
            menu.add((String)itemJS.get("label"));
        }
    }

    public void onEvent(LiveCardAddItemsEvent event) {
        Log.d(TAG, "AddMenuItems");
        event.getActivity().addMenuItems(menu);
    }
}
