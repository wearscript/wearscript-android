package com.dappervision.wearscript;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Canvas;
import android.os.Build;
import android.os.Handler;
import android.view.SurfaceHolder;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.dappervision.wearscript.events.LiveCardEvent;
import com.dappervision.wearscript.events.SendEvent;
import com.dappervision.wearscript.ui.MenuActivity;
import com.google.android.glass.timeline.DirectRenderingCallback;
import com.google.android.glass.timeline.LiveCard;

public class ScriptView extends WebView implements SurfaceHolder.Callback, DirectRenderingCallback {
    private static final String TAG = "ScriptView";
    private final BackgroundService context;
    private final Handler handler;
    private LiveCard liveCard;
    private SurfaceHolder holder;
    private long drawFrequency;
    private boolean paused;

    ScriptView(final BackgroundService context) {
        super(context);
        paused = false;
        // Enable localStorage in webview
        getSettings().setDomStorageEnabled(true);
        Utils.getEventBus().register(this);
        this.context = context;
        clearCache(true);
        setWebChromeClient(new WebChromeClient() {
            public boolean onConsoleMessage(ConsoleMessage cm) {
                String msg = cm.message() + " -- From line " + cm.lineNumber() + " of " + cm.sourceId();
                Log.w("WearScriptWebView", msg);
                Utils.eventBusPost(new SendEvent("log", "WebView: " + msg));
                return true;
            }
        });
        setOverScrollMode(View.OVER_SCROLL_IF_CONTENT_SCROLLS);
        //Do new Chromium WebView stuff here
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            setWebContentsDebuggingEnabled(true);
        }
        handler = new Handler();
    }

    public void onEvent(LiveCardEvent e) {
        if (e.getPeriod() > 0) {
            liveCardPublish(e.isNonSilent(), Math.round(e.getPeriod() * 1000.));
        } else {
            liveCardUnpublish();
        }
    }

    public void liveCardPublish(boolean nonSilent, long drawFrequency) {
        if (liveCard != null)
            return;
        this.drawFrequency = drawFrequency;
        liveCard = new LiveCard(context, "myid");
        Log.d(TAG, "Publishing LiveCard");
        liveCard.setDirectRenderingEnabled(true).getSurfaceHolder().addCallback(this);
        Intent intent = new Intent(context, MenuActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        liveCard.setAction(PendingIntent.getActivity(context, 0, intent, 0));
        if (nonSilent)
            liveCard.publish(LiveCard.PublishMode.REVEAL);
        else
            liveCard.publish(LiveCard.PublishMode.SILENT);
        Log.d(TAG, "Done publishing LiveCard");
    }

    public void liveCardUnpublish() {
        if (liveCard != null) {
            liveCard.getSurfaceHolder().removeCallback(this);
            liveCard.unpublish();
        }
        liveCard = null;
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        // Nothing to do here.
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        Log.d(TAG, "Surface created");
        this.holder = holder;
        update();
    }

    public void update() {
        if (drawFrequency < 0 || liveCard == null)
            return;
        handler.postDelayed(new Runnable() {
            public void run() {
                if (drawFrequency < 0 || liveCard == null)
                    return;
                if (!paused)
                    draw2();
                update();
            }
        }, drawFrequency);
    }

    public void onDestroy() {
        Utils.getEventBus().unregister(this);
        if (liveCard != null && liveCard.isPublished()) {
            Log.d(TAG, "Unpublishing LiveCard");
            liveCardUnpublish();
        }
    }

    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        Log.d(TAG, "Surface destroyed");
        this.holder = null;
    }

    public void draw2() {
        if (liveCard == null)
            return;
        Log.d(TAG, "Drawing");
        Canvas canvas;
        try {
            canvas = holder.lockCanvas();
        } catch (Exception e) {
            return;
        }
        if (canvas != null) {
            // Tell the view where to draw.
            View v = context.getActivityView();
            int measuredWidth = View.MeasureSpec.makeMeasureSpec(
                    canvas.getWidth(), View.MeasureSpec.EXACTLY);
            int measuredHeight = View.MeasureSpec.makeMeasureSpec(
                    canvas.getHeight(), View.MeasureSpec.EXACTLY);

            v.measure(measuredWidth, measuredHeight);
            v.layout(0, 0, getMeasuredWidth(), getMeasuredHeight());
            v.draw(canvas);
            holder.unlockCanvasAndPost(canvas);
        }
    }

    @Override
    public void renderingPaused(SurfaceHolder surfaceHolder, boolean b) {
        this.paused = b;
    }
}
