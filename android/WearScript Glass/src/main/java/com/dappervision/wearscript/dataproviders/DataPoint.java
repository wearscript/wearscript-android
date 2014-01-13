package com.dappervision.wearscript.dataproviders;

import org.json.simple.JSONObject;
import org.msgpack.type.Value;
import org.msgpack.type.ValueFactory;

import java.util.ArrayList;
import java.util.List;

public class DataPoint {
    private DataProvider parent;
    public String name;
    public int type;
    public List<Double> values;
    public List<Value> valuesV;
    public long timestampRaw;
    public double timestamp;

    DataPoint(DataProvider parent, double timestamp, long timestampRaw) {
        this.parent = parent;

        name = parent.getName();
        type = parent.getType();
        this.timestamp = timestamp;
        this.timestampRaw = timestampRaw;
        this.values = new ArrayList<Double>();
        this.valuesV = new ArrayList<Value>();
    }

    public DataPoint(String name, int type, double timestamp, long timestampRaw) {
        this.name = name;
        this.type = type;
        this.timestamp = timestamp;
        this.timestampRaw = timestampRaw;
        this.values = new ArrayList<Double>();
        this.valuesV = new ArrayList<Value>();
    }

    public void addValue(Double v) {
        this.values.add(v);
        this.valuesV.add(ValueFactory.createFloatValue(v));
    }

    public int getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public Value getValue() {
        ArrayList<Value> output = new ArrayList();
        output.add(ValueFactory.createArrayValue(valuesV.toArray(new Value[0])));
        output.add(ValueFactory.createFloatValue(timestamp));
        output.add(ValueFactory.createIntegerValue(timestampRaw));
        return ValueFactory.createArrayValue(output.toArray(new Value[0]));
    }

    public String toJSONString() {
        JSONObject o = new JSONObject();
        o.put("name", name); // TODO(brandyn): Should we make this a string
        o.put("type", type);
        o.put("timestamp", timestamp);
        o.put("timestampRaw", timestampRaw);
        o.put("values", values);
        return o.toJSONString();
    }
}
