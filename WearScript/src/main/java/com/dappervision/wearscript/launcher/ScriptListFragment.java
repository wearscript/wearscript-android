package com.dappervision.wearscript.launcher;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListAdapter;
import android.widget.ListView;

import com.dappervision.wearscript.HardwareDetector;
import com.google.android.glass.widget.CardScrollAdapter;
import com.google.android.glass.widget.CardScrollView;


public class ScriptListFragment extends Fragment {
    BroadcastReceiver mPackageBroadcastReciever = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            updateUI();
        }
    };
    AdapterView.OnItemClickListener mOnItemClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            WearScriptInfo info = (WearScriptInfo) mListAdapter.getItem(i);
            mCallbacks.onScriptSelected(info);
        }
    };
    //private static final String TAG = "ScriptListFragment";
    private InstalledScripts mInstalledScripts;
    private AdapterView adapterView;
    private Callbacks mCallbacks;
    private ListAdapter mListAdapter;

    public static ScriptListFragment newInstance() {
        ScriptListFragment fragment = new ScriptListFragment();
        return fragment;
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
    }

    public ListAdapter buildListAdapter() {
        if (HardwareDetector.hasGDK) {
            return new WearScriptsCardAdapter(this, mInstalledScripts);
        } else {
            return new WearScriptsAdapter(this, mInstalledScripts);
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mInstalledScripts = new InstalledScripts();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        intentFilter.addDataScheme("package");
        getActivity().registerReceiver(mPackageBroadcastReciever, intentFilter);
        mListAdapter = buildListAdapter();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        LinearLayout layout = new LinearLayout(getActivity());
        if (HardwareDetector.hasGDK) {
            CardScrollView view = new CardScrollView(getActivity());
            view.setHorizontalScrollBarEnabled(true);
            view.setAdapter((CardScrollAdapter) mListAdapter);
            view.activate();
            adapterView = view;
        } else {
            adapterView = new ListView(getActivity());
            adapterView.setAdapter(mListAdapter);
        }
        adapterView.setOnItemClickListener(mOnItemClickListener);
        layout.addView(adapterView);
        return layout;
    }

    @Override
    public void onResume() {
        super.onResume();
        adapterView.requestFocus();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        getActivity().unregisterReceiver(mPackageBroadcastReciever);
    }

    public interface Callbacks {
        void onScriptSelected(WearScriptInfo scriptInfo);
    }
}
