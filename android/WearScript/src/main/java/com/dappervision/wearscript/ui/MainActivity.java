package com.dappervision.wearscript.ui;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;

import com.dappervision.wearscript.HardwareDetector;
import com.dappervision.wearscript.R;
import com.dappervision.wearscript.WearScriptInfo;

public class MainActivity extends FragmentActivity implements ScriptListFragment.Callbacks {
    private Menu mMenu;

    protected ScriptListFragment createFragment() {
        return ScriptListFragment.newInstance();
    }

    protected ScriptListFragment getFragment() {
        return (ScriptListFragment) getSupportFragmentManager().findFragmentById(R.id.fragmentContainer);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResId());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        mMenu = menu;
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        onScriptSelected(getFragment().getWearScriptInfo(item.getItemId()));
        return true;
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
        if (HardwareDetector.isGlass) {
            openOptionsMenu();
        }
    }

    @Override
    public void onScriptSelected(WearScriptInfo scriptInfo) {
        startActivity(scriptInfo.getIntent());
    }

    @Override
    public Menu getOptionsMenu() {
        return mMenu;
    }

    @Override
    public boolean onGenericMotionEvent(MotionEvent event) {
        getFragment().onMotionEvent(event);
        return false;
    }
}
