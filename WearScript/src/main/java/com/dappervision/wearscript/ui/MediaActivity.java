package com.dappervision.wearscript.ui;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.view.MotionEvent;

import com.dappervision.wearscript.R;
import com.google.android.glass.touchpad.GestureDetector;

public class MediaActivity extends FragmentActivity {
    public static final String MODE_KEY = "MODE";
    public static final String MODE_MEDIA = "MODE_MEDIA";
    private GestureDetector gestureDetector;

    protected GestureFragment createFragment() {
        if (getIntent().getStringExtra(MODE_KEY).equals(MODE_MEDIA)){
            return new MediaPlayerFragment().newInstance((Uri) getIntent().getParcelableExtra(MediaPlayerFragment.ARG_URL), getIntent().getBooleanExtra(MediaPlayerFragment.ARG_LOOP, false));
        }else{
            return null;
        }
    }

    protected int getLayoutResId() {
        return R.layout.activity_fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResId());
        FragmentManager manager = getSupportFragmentManager();
        GestureFragment fragment = (GestureFragment) manager.findFragmentById(R.id.fragmentContainer);

        if (fragment == null) {
            fragment = createFragment();
            manager.beginTransaction()
                    .add(R.id.fragmentContainer, fragment)
                    .commit();
        }

        gestureDetector = new GestureDetector(this);
        gestureDetector.setBaseListener(fragment);
        gestureDetector.setScrollListener(fragment);

    }

    @Override
    public boolean onGenericMotionEvent(MotionEvent event) {
        if (gestureDetector != null) {
            return gestureDetector.onMotionEvent(event);
        }
        return false;
    }
}
