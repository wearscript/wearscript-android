package com.dappervision.wearscript.launcher;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.util.Log;

import com.dappervision.wearscript.R;
import com.dappervision.wearscript.Utils;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class MainActivity extends FragmentActivity implements ScriptListFragment.Callbacks {
    private static final String TAG = "MainActivity";
    private static final boolean DBG = true;
    private static final String GISTS_PATH = "gists/";
    private static final String WEARSCRIPT_PATH = Utils.dataPath() + GISTS_PATH;
    private boolean launchScriptList = true;

    protected Fragment createFragment() {
        return ScriptListFragment.newInstance();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResId());
        String gist = Utils.getPackageGist(this);
        if (DBG) Log.d(TAG, "Gist id is " + gist);
        if (gist != null) {
            if (DBG) Log.d(TAG, "Found package name gist id " + gist);
            byte[] manifestData = Utils.LoadData(GISTS_PATH + gist, "manifest.json");
            if (manifestData != null) {
                JSONObject manifest = (JSONObject) JSONValue.parse(new String(manifestData));
                if (manifest != null && manifest.containsKey("name")) {
                    String filePath = WEARSCRIPT_PATH + gist + "/" + "glass.html";
                    Log.d(TAG, "filePath is " + filePath);
                    WearScriptInfo wsInfo = new WearScriptInfo((String) manifest.get("name"), filePath);
                    Intent intent = wsInfo.getIntent();
                    int flags = intent.getFlags();
                    flags |=  Intent.FLAG_ACTIVITY_SINGLE_TOP;
                    intent.setFlags(flags);
                    startActivity(intent);
                    launchScriptList = false;
                } else {
                    if (DBG) Log.d(TAG, "Didn't find gist name in manifest.");
                }
            }
        }
    }

    protected int getLayoutResId() {
        return R.layout.activity_fragment;
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "LifeCycle: onResume");
        if (launchScriptList) {
            FragmentManager manager = getSupportFragmentManager();
            Fragment fragment = createFragment();
            manager.beginTransaction()
                    .replace(R.id.fragmentContainer, fragment)
                    .commit();
        }
    }

    @Override
    public void onScriptSelected(WearScriptInfo scriptInfo) {
        startActivity(scriptInfo.getIntent());
    }
}
