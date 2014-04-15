package com.dappervision.wearscript.launcher;

import android.app.Activity;
import android.graphics.Typeface;
import android.support.v4.app.Fragment;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;

import com.google.android.glass.app.Card;
import com.google.android.glass.widget.CardScrollAdapter;

import java.util.ArrayList;

public class WearScriptsCardAdapter extends CardScrollAdapter {
    private final ArrayList<WearScriptInfo> scripts;
    private final Typeface mRobotoLight;
    private final Activity activity;
    private ArrayList<View> array;

    public WearScriptsCardAdapter(Fragment fragment, InstalledScripts scripts) {
        activity = fragment.getActivity();
        array = new ArrayList<View>();
        this.scripts = scripts.getWearScripts();
        for (int i = 0; i < this.scripts.size(); i++) {
            array.add(cardFactory(this.scripts.get(i)));
        }

        mRobotoLight = Typeface.createFromAsset(activity.getAssets(), "fonts/Roboto-Light.ttf");
    }

    @Override
    public int getCount() {
        return array.size();
    }

    @Override
    public Object getItem(int i) {
        return scripts.get(i);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            return array.get(position);
        } else {
            return convertView;
        }
    }

    @Override
    public int getPosition(Object o) {
        for (int i = 0; i < array.size(); i++) {
            if (array.get(i) == o) {
                return i;
            }
        }
        return AdapterView.INVALID_POSITION;
    }

    public View cardFactory(WearScriptInfo info) {
        Card card = new Card(this.activity);
        card.setText(info.getTitle().toString());
        View v = card.getView();
        v.setId(info.getId());
        return v;
    }
}
