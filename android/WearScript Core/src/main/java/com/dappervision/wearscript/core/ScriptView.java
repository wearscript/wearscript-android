package com.dappervision.wearscript.core;

import android.content.Context;
import android.view.SurfaceHolder;
import android.webkit.WebView;

public abstract class ScriptView extends WebView implements SurfaceHolder.Callback {
    protected ScriptView(Context c){
        super(c);
    }

    public abstract void onDestroy();
}
