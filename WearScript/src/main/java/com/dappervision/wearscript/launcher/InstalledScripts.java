package com.dappervision.wearscript.launcher;

import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class InstalledScripts {
    private static final String TAG = "WearScriptHelper";
    private static final String GISTS_PATH = "gists/";
    private static final String WEARSCRIPT_PATH = Utils.dataPath() + GISTS_PATH;
    private static ArrayList<WearScriptInfo> mWearScripts;

    public InstalledScripts() {
        load();
    }

    private List<String> GistList() {
        File extStorageDir = new File(WEARSCRIPT_PATH);
        Log.i(TAG, "WSFiles: the directory: " + extStorageDir);
        String[] flArray = extStorageDir.list();
        if (flArray == null)
            return new ArrayList<String>();
        List<String> gists = Arrays.asList(flArray);
        Collections.reverse(gists);
        return gists;
    }

    public void load() {
        List<String> gists = GistList();
        if (mWearScripts == null) {
            mWearScripts = new ArrayList<WearScriptInfo>(gists.size());
        }
        mWearScripts.clear();
        mWearScripts.add(WearScriptInfo.playground());
        mWearScripts.add(WearScriptInfo.stop());
        mWearScripts.add(WearScriptInfo.setup());
        mWearScripts.add(WearScriptInfo.gistSync());
        for (String gist : gists) {
            byte[] manifestData = Utils.LoadData(GISTS_PATH + gist, "manifest.json");
            if (manifestData == null)
                continue;
            JSONObject manifest = (JSONObject) JSONValue.parse(new String(manifestData));
            if (manifest == null || !manifest.containsKey("name"))
                continue;
            String filePath = WEARSCRIPT_PATH + gist + "/" + "glass.html";
            WearScriptInfo wsInfo = new WearScriptInfo((String) manifest.get("name"), filePath);
            mWearScripts.add(wsInfo);
        }
    }

    public ArrayList<WearScriptInfo> getWearScripts() {
        return mWearScripts;
    }

}
