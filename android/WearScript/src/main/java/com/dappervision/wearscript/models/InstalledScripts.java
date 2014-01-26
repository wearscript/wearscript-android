package com.dappervision.wearscript.models;

import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.WearScriptInfo;

import java.io.File;
import java.util.ArrayList;

public class InstalledScripts {
    private static final String TAG = "WearScriptHelper";
    private static final String WEARSCRIPT_PATH = Utils.dataPath() + "scripts/";
    private static ArrayList<WearScriptInfo> mWearScripts;

    public InstalledScripts(){
        load();
    }
    private ArrayList<String> HTMLFileList() {
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

    public void load() {
        ArrayList<String> mFiles = HTMLFileList();
        if (mWearScripts == null) {
            mWearScripts = new ArrayList<WearScriptInfo>(mFiles.size());
        }
        mWearScripts.clear();
        mWearScripts.add(WearScriptInfo.playground());
        mWearScripts.add(WearScriptInfo.stop());
        mWearScripts.add(WearScriptInfo.setup());
        for (String file : mFiles) {
            String filePath = "file://" + WEARSCRIPT_PATH + file;
            WearScriptInfo wsInfo = new WearScriptInfo(file, filePath);
            mWearScripts.add(wsInfo);
        }
    }

    public ArrayList<WearScriptInfo> getWearScripts() {
        return mWearScripts;
    }

}
