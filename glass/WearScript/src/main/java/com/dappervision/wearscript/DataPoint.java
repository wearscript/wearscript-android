package com.dappervision.wearscript;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONArray;
import org.json.simple.JSONObject;
import org.msgpack.annotation.Message;

import java.util.ArrayList;

public class DataPoint {
    private DataProvider parent;
    private ArrayList<Double> values;
    private Double timestamp;
    private Long timestampRaw;

    @Message
    public static class WSSensor {
        public String name;
        public int type;
        public double timestamp;
        public long timestampRaw;
        public Double[] values;
    }
    private WSSensor sensor;

    DataPoint(DataProvider parent, double timestamp, long timestampRaw) {
        this.parent = parent;
        this.sensor = new WSSensor();
        this.sensor.name = parent.getName();
        this.sensor.type = parent.getType();
        this.sensor.timestamp = timestamp;
        this.sensor.timestampRaw = timestampRaw;
        this.values = new ArrayList<Double>();
    }

    public void addValue(Double v) {
        values.add(v);
    }

    public int type() {
        return parent.getType();
    }

    public WSSensor getWSSensor() {
        this.sensor.values = (Double[])this.values.toArray();
        return this.sensor;
    }

    public String toJSONString() {
        WSSensor s = getWSSensor();
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(s);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
