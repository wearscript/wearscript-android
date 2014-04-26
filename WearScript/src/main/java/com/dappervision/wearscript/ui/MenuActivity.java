/*
 * Copyright (C) 2013 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.dappervision.wearscript.ui;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.util.Base64;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.R;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.LiveCardAddItemsEvent;
import com.dappervision.wearscript.events.LiveCardMenuSelectedEvent;
import com.dappervision.wearscript.events.WarpSetAnnotationEvent;
import com.dappervision.wearscript.launcher.WearScriptInfo;
import com.kelsonprime.cardtree.DynamicMenu;

import java.util.ArrayList;
import java.util.TreeMap;

/**
 * Activity showing the options menu.
 */
public class MenuActivity extends Activity {

    private static final String TAG = "MenuActivity";
    private DynamicMenu menu;
    private boolean isAttached = false;
    private TreeMap<Integer, Integer> idToPos;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreate");
        idToPos = new TreeMap<Integer, Integer>();
        Utils.eventBusPost(new LiveCardAddItemsEvent(this));
        super.onCreate(savedInstanceState);
    }

    public void addMenuItems(ArrayList<String> labels) {
        menu = new DynamicMenu(R.menu.blank);
        synchronized (this) {
            for (String label: labels)
            idToPos.put(menu.add(label), idToPos.size());
        }
    }

    @Override
    public void onResume() {
        Log.d(TAG, "onResume");
        super.onResume();
        if (this.isAttached)
            openOptionsMenu();
    }

    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        this.isAttached = true;
        openOptionsMenu();
    }

    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        isAttached = false;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Log.d(TAG, "onOptionsItemSelectMenu");
        // Handle item selection.
        Utils.eventBusPost(new LiveCardMenuSelectedEvent(idToPos.get(item.getItemId())));
        closeOptionsMenu();
        return true;
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu optionsMenu) {
        android.util.Log.d(TAG, "Preparing Node menu");
        menu.build(getMenuInflater(), optionsMenu);
        return true;
    }

    @Override
    public void onOptionsMenuClosed(Menu menu) {
        super.onOptionsMenuClosed(menu);
        Log.d(TAG, "onOptionsMenuClosed");
        // Nothing else to do, closing the Activity.
        finish();
    }
}
