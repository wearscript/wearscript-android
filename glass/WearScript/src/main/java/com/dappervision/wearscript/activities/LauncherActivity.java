/*
Copyright 2013 Michael DiGiovanni glass@mikedg.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
//A good 80% of this app is from the Android SDK home app sample
package com.dappervision.wearscript.activities;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ListView;

import com.dappervision.wearscript.R;
import com.dappervision.wearscript.WearScriptHelper;

public class LauncherActivity extends Activity {

    private WearScriptHelper mWearScriptHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWearScriptHelper = new WearScriptHelper(this);
        mWearScriptHelper.loadWearScripts(true);

        mWearScriptHelper.bindWearScripts();

        final ListView list = (ListView) findViewById(android.R.id.list);
        list.setOnItemSelectedListener(new OnItemSelectedListener() {

            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                list.smoothScrollToPositionFromTop(position, 0);
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {

            }
        });

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        intentFilter.addDataScheme("package");
        registerReceiver(mPackageBroadcastReciever, intentFilter);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mWearScriptHelper.onDestroy();
        unregisterReceiver(mPackageBroadcastReciever);
    }

    BroadcastReceiver mPackageBroadcastReciever = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            mWearScriptHelper.loadApplications(false);
        }
    };
}
