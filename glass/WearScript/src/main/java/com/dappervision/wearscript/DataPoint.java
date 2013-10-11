package com.dappervision.wearscript;
import org.json.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class DataPoint {
    private DataProvider parent;
    private ArrayList<Float> values;
    private Double timestamp;

    DataPoint(DataProvider parent) {
        this.parent = parent;
        this.timestamp = System.currentTimeMillis() / 1000.;
        this.values = new ArrayList<Float>();
    }

    public void addValue(Float v){
        values.add(v);
    }

    public int type(){
        return parent.sensor().getType();
    }

    public String toJSONString(){
        JSONObject point = new JSONObject();
        point.put("timestamp", this.timestamp);
        point.put("name", parent.sensor().getName());
        JSONArray arr = new JSONArray();
        for(Float f : values){
            arr.put(f);
        }
        point.put("values", arr);
        return point.toString();
    }
}
