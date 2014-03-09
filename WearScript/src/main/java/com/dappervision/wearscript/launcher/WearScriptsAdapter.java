package com.dappervision.wearscript.launcher;

import android.content.Context;
import android.graphics.Typeface;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.dappervision.wearscript.R;

public class WearScriptsAdapter extends ArrayAdapter<WearScriptInfo> {
    private final Typeface mRobotoLight;

    public WearScriptsAdapter(Fragment fragment, InstalledScripts scripts) {
        super(fragment.getActivity(), 0, scripts.getWearScripts());
        mRobotoLight = Typeface.createFromAsset(fragment.getActivity().getAssets(), "fonts/Roboto-Light.ttf");
    }

    @Override
    public View getView(int position, View view, ViewGroup parent) {
        final WearScriptInfo info = getItem(position);

        if (view == null) {
            final LayoutInflater inflater = (LayoutInflater) getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.item_script, parent, false);
            ((TextView) view.findViewById(R.id.script_name))
                    .setTypeface(mRobotoLight);
        }

        final TextView textView = (TextView) view.findViewById(R.id.script_name);
        textView.setText(info.getTitle());
        return view;
    }
}