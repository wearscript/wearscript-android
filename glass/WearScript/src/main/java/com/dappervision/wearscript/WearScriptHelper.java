/*
 * Copyright (C) 2007 The Android Open Source Project 
 * Copyright (C) 2013 Michael DiGiovanni Licensed
 * under the Apache License, Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in
 * writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */
// Original code snipped from the Android Home SDK Sample app
package com.dappervision.wearscript;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class WearScriptHelper {
    private static final String TAG = "WearScriptHelper";
    private static final String WEARSCRIPT_PATH = Utils.dataPath() + "scripts/";
    ;
    public static final String WS_PKG = "com.dappervision.wearscript";
    public static final String WS_ACTIVITY = "com.dappervision.wearscript.activities.MainActivity";

    private Activity mActivity;
    private IntentFilter mfilter;

    private ListView mListView;

    private Typeface mRobotoLight;
    private static ArrayList<ApplicationInfo> mApplications;
    private static ArrayList<WearScriptInfo> mWearScripts;


    private final ArrayList<String> mExcludedApps = new ArrayList<String>();

    public WearScriptHelper(Activity activity) {
        mActivity = activity;

        mRobotoLight = Typeface.createFromAsset(activity.getAssets(), "fonts/Roboto-Light.ttf");

        setupExclusions();

        ((TextView) activity.findViewById(android.R.id.text1)).setTypeface(mRobotoLight);
    }

    private void setupExclusions() {
        mExcludedApps.add("com.google.glass.home");
        mExcludedApps.add(mActivity.getPackageName());
    }

    /**
     * Creates a new appplications adapter for the grid view and registers it.
     */

    public void bindWearScripts() {
        // TODO(swgreen)
        if (mListView == null) {
            mListView = (ListView) mActivity.findViewById(android.R.id.list);
        }
        mListView.setAdapter(new WearScriptsAdapter(mActivity, mWearScripts));
        mListView.setSelection(0);

        mListView.setOnItemClickListener(new WearScriptLauncher());
    }

    /**
     * Loads the list of installed applications in mApplications.
     */
    public void loadApplications(boolean isLaunching) {
        if (isLaunching && mApplications != null) {
            return;
        }

        PackageManager manager = mActivity.getPackageManager();

        Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);

        final List<ResolveInfo> apps = manager.queryIntentActivities(mainIntent, 0);
        Collections.sort(apps, new ResolveInfo.DisplayNameComparator(manager));

        if (apps != null) {
            final int count = apps.size();

            if (mApplications == null) {
                mApplications = new ArrayList<ApplicationInfo>(count);
            }
            mApplications.clear();

            // Create a launcher for Glass Settings or we have no way to hit that
            createGlassSettingsAppInfo();

            for (int i = 0; i < count; i++) {
                ApplicationInfo application = new ApplicationInfo();
                ResolveInfo info = apps.get(i);
                Log.d("Launchyi", info.activityInfo.applicationInfo.packageName);
                // Let's filter out this app
                if (!mExcludedApps.contains(info.activityInfo.applicationInfo.packageName)) {
                    application.title = info.loadLabel(manager);
                    application.setActivity(new ComponentName(
                            info.activityInfo.applicationInfo.packageName, info.activityInfo.name),
                            Intent.FLAG_ACTIVITY_NEW_TASK
                                    | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                    application.icon = info.activityInfo.loadIcon(manager);

                    mApplications.add(application);
                }
            }

            // FIXME: should make a way to clear defaults
            // PackageManagerclearPackagePreferredActivities in special case
            // This needs to always be last?
        }
    }

    private void createGlassSettingsAppInfo() {
        ApplicationInfo application = new ApplicationInfo();

        application.title = "Glass Settings";
        application.setActivity(new ComponentName("com.google.glass.home",
                "com.google.glass.home.settings.SettingsTimelineActivity"),
                Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        // application.icon = info.activityInfo.loadIcon(manager);

        mApplications.add(application);
    }

    private ArrayList<String> HTMLFileList() {
        //File extStorageDir = mActivity.getExternalFilesDir(null);
        File extStorageDir = new File(WEARSCRIPT_PATH);
        Log.i(TAG, "WSFiles: the directory: " + extStorageDir);
        String[] flArray = extStorageDir.list();
        ArrayList<String> fl = new ArrayList<String>();
        if (flArray == null)
            return fl;
        for (String file : flArray) {
            if (file.matches(".*\\.html")) {
                fl.add(file);
            }
        }
        return fl;
    }

    public void loadWearScripts(boolean b) {
        ArrayList<String> mFiles = HTMLFileList();
        if (mWearScripts == null) {
            mWearScripts = new ArrayList<WearScriptInfo>(mFiles.size());
        }
        mWearScripts.clear();
        for (String file : mFiles) {
            String filePath = "file://" + WEARSCRIPT_PATH + file;
            WearScriptInfo wsInfo = new WearScriptInfo();
            wsInfo.setActivity(new ComponentName(WS_PKG, WS_ACTIVITY),
                    Intent.FLAG_ACTIVITY_CLEAR_TOP, filePath);
            wsInfo.title = file;
            mWearScripts.add(wsInfo);
        }
    }

    public void registerIntentReceiversWS() {
        // TODO(swgreen)
    }

    /**
     * Receives notifications when wearscripts are added/removed.
     */
    private class WearScriptsIntentReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            loadWearScripts(false);
            bindWearScripts();
        }
    }


    /**
     * GridView adapter to show the list of all installed applications.
     */
    private class WearScriptsAdapter extends ArrayAdapter<WearScriptInfo> {
        private static final int TYPE_SPACE = 0;
        private static final int TYPE_ITEM = 1;
        private Rect mOldBounds = new Rect();

        public WearScriptsAdapter(Context context, ArrayList<WearScriptInfo> scripts) {
            super(context, 0, scripts);
        }

        @Override
        public int getCount() {
            return super.getCount() + 1;
        }

        @Override
        public boolean isEnabled(int position) {
            return getItemViewType(position) == TYPE_ITEM;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (getItemViewType(position) == TYPE_ITEM) {
                final WearScriptInfo info = mWearScripts.get(position);
                if (convertView == null) {
                    final LayoutInflater inflater = mActivity.getLayoutInflater();
                    convertView = inflater.inflate(R.layout.item_app, parent, false);
                    ((TextView) convertView.findViewById(android.R.id.text1))
                            .setTypeface(mRobotoLight);
                }

                final TextView textView = (TextView) convertView.findViewById(android.R.id.text1);
                // textView.setCompoundDrawablesWithIntrinsicBounds(null, icon, null, null);
                textView.setText(info.title);
            } else {
                if (convertView == null) {
                    final LayoutInflater inflater = mActivity.getLayoutInflater();
                    convertView = inflater.inflate(R.layout.item_empty, parent, false);
                }
            }
            return convertView;
        }

        @Override
        public int getItemViewType(int position) {
            if (position == getCount() - 1) {
                return TYPE_SPACE;
            } else {
                return TYPE_ITEM;
            }
        }

        @Override
        public int getViewTypeCount() {
            return 2; // 1 is the standard, the second is just a holder
        }
    }

    /**
     * GridView adapter to show the list of all installed applications.
     */


    /**
     * Starts the selected activity/application in the grid view.
     */

    private class WearScriptLauncher implements AdapterView.OnItemClickListener {
        public void onItemClick(AdapterView parent, View v, int position, long id) {
            try {
                WearScriptInfo app = (WearScriptInfo) parent.getItemAtPosition(position);
                mActivity.startActivity(app.intent);
            } catch (java.lang.IndexOutOfBoundsException e) {
                return;
            }
        }
    }

    public void onDestroy() {
        // Remove the callback for the cached drawables or we leak
        // the previous Home screen on orientation change
        // final int count = mApplications.size();
        // for (int i = 0; i < count; i++) {
        // mApplications.get(i).icon.setCallback(null);
        // }

        //mActivity.unregisterReceiver(mApplicationsReceiver);
        //mActivity.unregisterReceiver(mWearScriptsReceiver);
    }
}
