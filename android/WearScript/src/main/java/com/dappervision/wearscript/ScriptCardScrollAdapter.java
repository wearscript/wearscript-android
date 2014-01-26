package com.dappervision.wearscript;

import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.AdapterView;

import com.google.android.glass.app.Card;
import com.google.android.glass.widget.CardScrollAdapter;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

public class ScriptCardScrollAdapter extends CardScrollAdapter implements AdapterView.OnItemClickListener, AdapterView.OnItemSelectedListener {
    private static final String TAG = "StringCardScrollAdapter";
    private ArrayList<View> cards;
    private BackgroundService context;
    private ConcurrentHashMap<String, String> jsCallbacks;

    ScriptCardScrollAdapter(BackgroundService context) {
        this.context = context;
        jsCallbacks = new ConcurrentHashMap<String, String>();
        cards = new ArrayList<View>();
    }

    public void registerCallback(String type, String jsFunction) {
        jsCallbacks.put(type, jsFunction);
    }

    public void unregister() {
        jsCallbacks = new ConcurrentHashMap<String, String>();
    }

    public void reset() {
        unregister();
        cards = new ArrayList<View>();
    }

    protected void makeCall(String key, String data) {
        Log.i(TAG, key + " " + data);
        if (!jsCallbacks.contains(key))
            return;
        context.loadUrl(String.format("javascript:%s(%s);", jsCallbacks.get(key), data));
    }

    public View cardFactory(String cardJSON) {
        JSONObject card = (JSONObject) JSONValue.parse(cardJSON);
        return cardFactory(card);
    }

    public View cardFactory(JSONObject card) {
        String type = ((String) card.get("type"));
        if (type == null)
            return null;
        if (type.equals("webviewmain")) {
            // TODO(brandyn): This has "parent" issues (only the main activity or the scroll view can have it)
            return this.context.webview;
        } else if (type.equals("card")) {
            Card c = new Card(this.context);
            c.setText((String) card.get("text"));
            c.setFootnote((String) card.get("info"));
            return c.toView();
        } else if (type.equals("html")) {
            WebView wv = new WebView(this.context);
            // TODO(brandyn): Use html along with stock template + css
            return wv;
        }
        return null;
    }

    public void cardInsert(int position, String cardJSON) {
        View v = cardFactory(cardJSON);
        if (v == null)
            return;
        cards.add(position, v);
    }

    public void cardModify(int position, String cardJSON) {
        View v = cardFactory(cardJSON);
        if (v == null)
            return;
        cards.set(position, v);
    }

    public void cardTrim(int position) {
        for (int i = cards.size() - 1; i >= position; i--)
            cards.remove(position);
    }

    public void cardDelete(int position) {
        cards.remove(position);
    }

    @Override
    public int getCount() {
        return cards.size();
    }

    @Override
    public Object getItem(int position) {
        return cards.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Log.i(TAG, "getView called: " + position);
        if (convertView == null) {
            return setItemOnCard(this, cards.get(position));
        } else {
            return setItemOnCard(this, convertView);
        }
    }

    @Override
    public int findIdPosition(Object id) {
        // TODO(brandyn): We will likely need to give each card a unique ID and not use position
        return (Integer) id;
    }

    @Override
    public int findItemPosition(Object item) {
        for (int i = 0; i < cards.size(); i++) {
            if (cards.get(i).equals(item)) {
                return i;
            }
        }
        return AdapterView.INVALID_POSITION;
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        makeCall("onItemClick", String.format("%d, %d", position, id));
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        makeCall("onItemSelected", String.format("%d, %d", position, id));
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
        makeCall("onNothingSelected", "");
    }
}
