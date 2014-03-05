package com.dappervision.wearscript.ui;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;

import com.dappervision.wearscript.R;
import com.dappervision.wearscript.WearScriptInfo;

public class MainActivity extends FragmentActivity implements ScriptListFragment.Callbacks {

    protected Fragment createFragment() {
        return ScriptListFragment.newInstance();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResId());
    }

    protected int getLayoutResId() {
        return R.layout.activity_fragment;
    }

    @Override
    protected void onResume() {
        super.onResume();
        FragmentManager manager = getSupportFragmentManager();
        Fragment fragment = createFragment();
        manager.beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit();
    }

    @Override
    public void onScriptSelected(WearScriptInfo scriptInfo) {
        startActivity(scriptInfo.getIntent());
    }
}
