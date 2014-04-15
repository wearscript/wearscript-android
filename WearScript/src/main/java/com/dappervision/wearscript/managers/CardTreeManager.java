package com.dappervision.wearscript.managers;

import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.widget.AdapterView;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.HardwareDetector;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.R;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.ActivityEvent;
import com.dappervision.wearscript.events.CardTreeEvent;
import com.google.android.glass.app.Card;
import com.google.android.glass.media.Sounds;
import com.kelsonprime.cardtree.DynamicMenu;
import com.kelsonprime.cardtree.Level;
import com.kelsonprime.cardtree.Node;
import com.kelsonprime.cardtree.TapSelectedListener;
import com.kelsonprime.cardtree.Tree;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.util.HashMap;

public class CardTreeManager extends Manager {
    private final AudioManager systemAudio;
    private Tree cardTree;
    private Activity activity;
    private int cardCount;
    private HashMap<Node, Integer> nodeToId;

    public CardTreeManager(BackgroundService service) {
        super(service);
        systemAudio = (android.media.AudioManager) service.getSystemService(Context.AUDIO_SERVICE);
    }

    public boolean treeBack() {
        if (cardTree == null || cardTree.isRootCurrent())
            return true;
        cardTree.back();
        return false;
    }

    @Override
    public void reset() {
        cardCount = 0;
        nodeToId = new HashMap<Node, Integer>();
        super.reset();
    }

    public void onEventMainThread(CardTreeEvent e) {
        cardTree = new Tree(activity);
        cardTree.setListener(new WSTapSelectedListener(cardTree, this));
        cardTree.setHorizontalScrollBarEnabled(true);
        JSONArray cardArray = (JSONArray) JSONValue.parse(e.getTreeJS());
        cardArrayToLevel(cardArray, cardTree.getRoot(), cardTree);
        cardTree.showRoot();
        Utils.eventBusPost(new ActivityEvent(ActivityEvent.Mode.REFRESH));
    }

    public Level cardArrayToLevel(JSONArray array, Level level, Tree tree) {
        for (Object o : array) {
            int cardId = cardCount++;
            JSONObject cardJS = (JSONObject) o;
            JSONArray children = (JSONArray) cardJS.get("children");
            JSONArray menu = (JSONArray) cardJS.get("menu");
            String selected = (String) cardJS.get("selected");
            String click = (String) cardJS.get("click");

            if (selected != null) {
                registerCallback("SELECTED:" + cardId, selected);
            }

            if (click != null) {
                registerCallback("CLICK:" + cardId, click);
            }

            Node node;
            if (children != null && children.size() > 0) {
                Log.d(TAG, "Has children");
                node = new Node(cardFactory((JSONObject) cardJS.get("card")), cardArrayToLevel(children, new Level(tree), tree));
            } else if (menu != null) {
                Log.d(TAG, "Has Menu");
                DynamicMenu sampleMenu = new DynamicMenu(R.menu.blank);
                for (Object menuItemObj : menu) {
                    JSONObject menuItem = (JSONObject) menuItemObj;
                    String label = (String) menuItem.get("label");
                    String callback = (String) menuItem.get("callback");
                    if (label != null && callback != null) {
                        int dynamicOptionId = sampleMenu.add(label);
                        registerCallback("MENU:" + dynamicOptionId, callback);
                    } else {
                        break;
                    }
                }
                node = new Node(cardFactory((JSONObject) cardJS.get("card")), sampleMenu);
            } else {
                Log.d(TAG, "Has No Children or Menu");
                node = new Node(cardFactory((JSONObject) cardJS.get("card")));
            }
            level.add(node);
            nodeToId.put(node, cardId);
        }
        return level;
    }

    public View cardFactory(String cardJSON) {
        JSONObject card = (JSONObject) JSONValue.parse(cardJSON);
        return cardFactory(card);
    }

    public View cardFactory(JSONObject card) {
        String type = ((String) card.get("type"));
        if (type == null)
            return null;
        if (type.equals("card")) {
            Card c = new Card(service);
            c.setText((String) card.get("text"));
            c.setFootnote((String) card.get("info"));
            return c.getView();
        } else if (type.equals("html")) {
            WebView wv = new WebView(service);
            wv.setInitialScale(100);
            String body = "<html style='width:100%; height:100%; overflow:hidden'><head><link href='roboto.css' rel='stylesheet' type='text/css'><link rel='stylesheet' href='base_style.css'></head><body style='width:100%; height:100%; overflow:hidden; margin:0;' bgcolor='#000000'>" + card.get("html") + "</body></html>";
            Log.d(TAG, body);
            wv.loadDataWithBaseURL("file:///android_asset/", body, "text/html", "utf-8", null);
            return wv;
        }
        return null;
    }

    public boolean onPrepareOptionsMenu(Menu menu, Activity activity) {
        Log.d(TAG, "OnPrepareOptionsMenu");
        if (cardTree.getCurrentNode().hasMenu()) {
            Log.d(TAG, "Preparing Node menu");
            cardTree.getCurrentNode().getMenu().build(activity.getMenuInflater(), menu);
            return true;
        }
        return false;
    }

    public View getView() {
        return cardTree;
    }

    public void nodeTap(Node node) {
        Integer id = nodeToId.get(node);
        if (!node.hasMenu() && !node.hasChild() && (id == null || !this.hasCallback("CLICK:" + id))) {
            systemAudio.playSoundEffect(Sounds.DISALLOWED);
        } else if (id != null) {
            makeCall("CLICK:" + id, "");
        }
    }

    public void nodeSelected(Node node) {
        Integer id = nodeToId.get(node);
        if (id != null) {
            //cardTree.updateViews(); // NOTE(brandyn): Hack for webviews, their scale gets messed up
            Log.d(TAG, "Calling Select: " + "SELECTED:" + id);
            makeCall("SELECTED:" + id, "");
        }
    }

    public void setMainActivity(Activity activity) {
        this.activity = activity;
        if (cardTree == null && HardwareDetector.isGlass) {
            cardTree = new Tree(activity);
        } else {
            cardTree.setActivity(activity);
        }
    }

    public boolean onBackPressed() {
        if (cardTree == null || cardTree.isRootCurrent())
            return true;
        Log.d(TAG, "Moving up tree");
        cardTree.back();
        return false;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        makeCall("MENU:" + item.getItemId(), "");
        return true;
    }

    class WSTapSelectedListener extends TapSelectedListener {

        private final CardTreeManager manager;

        public WSTapSelectedListener(Tree tree, CardTreeManager manager) {
            super(tree);
            this.manager = manager;
        }

        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            manager.nodeTap(tree.getCurrentNode());
            super.onItemClick(parent, view, position, id);
        }

        @Override
        public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
            if (tree.getIgnoreSelect()) {
                Log.d(TAG, "Ignoring select");
                return;
            }
            Log.d(TAG, "SelectItem: " + i + " : " + tree.getSelectedItemPosition());
            manager.nodeSelected(tree.getCurrentNode());
        }

        @Override
        public void onNothingSelected(AdapterView<?> adapterView) {

        }
    }
}
