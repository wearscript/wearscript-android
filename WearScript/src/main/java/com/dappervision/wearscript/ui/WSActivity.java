package com.dappervision.wearscript.ui;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;

import com.dappervision.wearscript.R;

public class WSActivity extends FragmentActivity {
    public static final String MODE_KEY = "MODE";
    public static final String MODE_MEDIA = "MODE_MEDIA";

    protected Fragment createFragment() {
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
        Fragment fragment = manager.findFragmentById(R.id.fragmentContainer);

        if (fragment == null) {
            fragment = createFragment();
            manager.beginTransaction()
                    .add(R.id.fragmentContainer, fragment)
                    .commit();
        }
    }
}
