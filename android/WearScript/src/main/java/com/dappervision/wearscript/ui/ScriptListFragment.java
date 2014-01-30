package com.dappervision.wearscript.ui;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.v4.app.ListFragment;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.dappervision.wearscript.HardwareDetector;
import com.dappervision.wearscript.WearScriptInfo;
import com.dappervision.wearscript.WearScriptsAdapter;
import com.dappervision.wearscript.models.InstalledScripts;
import com.google.android.glass.touchpad.Gesture;
import com.google.android.glass.touchpad.GestureDetector;

public class ScriptListFragment extends ListFragment {
    private InstalledScripts mInstalledScripts;
    private ListView listView;
    private Callbacks mCallbacks;
    private GestureDetector gestureDetector;

    public static ScriptListFragment newInstance() {
        ScriptListFragment fragment = new ScriptListFragment();
        return fragment;
    }

    public void onMotionEvent(MotionEvent event) {
        if(gestureDetector != null)
            gestureDetector.onMotionEvent(event);
    }

    public interface Callbacks {
        void onScriptSelected(WearScriptInfo scriptInfo);
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mCallbacks = (Callbacks) activity;
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mCallbacks = null;
    }

    public void updateUI() {
        mInstalledScripts.load();
        ((WearScriptsAdapter) getListAdapter()).notifyDataSetChanged();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mInstalledScripts = new InstalledScripts();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        intentFilter.addDataScheme("package");
        getActivity().registerReceiver(mPackageBroadcastReciever, intentFilter);
        setListAdapter(new WearScriptsAdapter(this, mInstalledScripts));
        if(HardwareDetector.isGlass)
            gestureDetector = createGestureDetector(getActivity());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = super.onCreateView(inflater, container, savedInstanceState);
        listView = (ListView) v.findViewById(android.R.id.list);
        //Style things for Glass
        if (HardwareDetector.isGlass) {
            listView.setHorizontalScrollBarEnabled(false);
            listView.setVerticalScrollBarEnabled(false);
            listView.setSelector(new ColorDrawable(Color.TRANSPARENT));
            listView.setDivider(new ColorDrawable(Color.TRANSPARENT));
            listView.setDividerHeight(10);
        }
        return v;
    }

    @Override
    public void onListItemClick(ListView l, View v, int position, long id) {
        WearScriptInfo info = (WearScriptInfo) getListView().getItemAtPosition(position);
        mCallbacks.onScriptSelected(info);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        getActivity().unregisterReceiver(mPackageBroadcastReciever);
    }

    private GestureDetector createGestureDetector(Context context) {
        GestureDetector gestureDetector = new GestureDetector(context);
        //Create a base listener for generic gestures
        gestureDetector.setBaseListener( new GestureDetector.BaseListener() {
            @Override
            public boolean onGesture(Gesture gesture) {
                int position = getSelectedItemPosition();
                if (gesture == Gesture.TAP) {
                    WearScriptInfo info = (WearScriptInfo) getListView().getItemAtPosition(position);
                    mCallbacks.onScriptSelected(info);
                    return true;
                } else if (gesture == Gesture.TWO_TAP) {
                    // do something on two finger tap
                    return true;
                } else if (gesture == Gesture.SWIPE_RIGHT) {
                    setSelection(position + 1);
                    return true;
                } else if (gesture == Gesture.SWIPE_LEFT) {
                    setSelection(position - 1);
                    return true;
                }
                return false;
            }
        });
        return gestureDetector;
    }

    BroadcastReceiver mPackageBroadcastReciever = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            updateUI();
        }
    };
}
