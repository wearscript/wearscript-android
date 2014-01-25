package com.dappervision.wearscript.ui;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.app.ListFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.dappervision.wearscript.WearScriptInfo;
import com.dappervision.wearscript.WearScriptsAdapter;
import com.dappervision.wearscript.models.InstalledScripts;

public class ScriptListFragment extends ListFragment {
    private InstalledScripts mInstalledScripts;
    private ListView listView;
    private Callbacks mCallbacks;

    public static ScriptListFragment newInstance() {
        ScriptListFragment fragment = new ScriptListFragment();
        return fragment;
    }

    public interface Callbacks {
        void onScriptSelected(WearScriptInfo scriptInfo);
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mCallbacks = (Callbacks)activity;
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
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = super.onCreateView(inflater, container, savedInstanceState);
        listView = (ListView) v.findViewById(android.R.id.list);
        return v;
    }

    @Override
    public void onListItemClick(ListView l, View v, int position, long id) {
        WearScriptInfo info = ((WearScriptsAdapter) getListAdapter()).getItem(position);
        mCallbacks.onScriptSelected(info);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        getActivity().unregisterReceiver(mPackageBroadcastReciever);
    }

    BroadcastReceiver mPackageBroadcastReciever = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            updateUI();
        }
    };
}
