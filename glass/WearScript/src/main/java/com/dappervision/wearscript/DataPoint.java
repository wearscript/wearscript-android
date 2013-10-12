package com.dappervision.wearscript;

import org.json.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class DataPoint {
    private DataProvider parent;
    private ArrayList<Float> values;
    private Double timestamp;
    private Long timestampRaw;


    DataPoint(DataProvider parent, double timestamp, long timestampRaw) {
        this.parent = parent;
        this.timestamp = timestamp;
        this.timestampRaw = timestampRaw;
        this.values = new ArrayList<Float>();
    }

    public void addValue(Float v) {
        values.add(v);
    }

    public int type() {
        return parent.getType();
    }

    public JSONObject toJSONObject() {
        JSONObject point = new JSONObject();
        point.put("timestamp", this.timestamp);
        point.put("timestampRaw", this.timestampRaw);
        point.put("name", parent.getName());
        point.put("type", type());
        JSONArray arr = new JSONArray();
        for (Float f : values) {
            arr.put(f);
        }
        point.put("values", arr);
        return point;
    }
}
