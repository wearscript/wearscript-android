package us.openglass;

import android.util.Base64;
import android.util.Log;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.highgui.Highgui;

public class OpenGlassScript {
    MainActivity activity;
    String TAG = "OpenGlassScript";

    OpenGlassScript(MainActivity m) {
        activity = m;
    }

    public void say(String text) {

        activity.say(text);
    }

    public void timeline(String ti) {
        Log.i(TAG, "timeline");
        activity.timeline((JSONObject) new JSONValue().parse(ti));
    }

    public boolean hasFlag(String flag) {
        Log.i(TAG, "hasFlag");
        return activity.optionFlags.contains(flag);
    }

    public void imageCreate(String key, int height, int width) {
        Log.i(TAG, "imageCreate: " + key);
        activity.scriptImages.put(key, new Mat(height, width, CvType.CV_8UC4));
    }

    public void imageCopy(String src, String dst) {
        Log.i(TAG, "imageCopy: " + src + " to " + dst);
        Mat image = activity.scriptImages.get(src);
        if (image == null)
            return;
        activity.scriptImages.put(dst, image.clone());
    }

    public void imageDelete(String key) {
        Log.i(TAG, "imageDelete: " + key);
        activity.scriptImages.remove(key);
    }

    public void imageDisplay(String key) {
        Log.i(TAG, "imageDisplay:" + key);
        activity.overlay = activity.scriptImages.get(key);
    }

    public void drawCircle(String key, int y, int x, int radius, int b, int g, int r) {
        Log.i(TAG, "drawCircle:" + key);
        Mat image = activity.scriptImages.get(key);
        if (image == null)
            return;
        Core.circle(image, new Point(x, y), radius, new Scalar(b, g, r), -1);
    }

    public void drawRectangle(String key, int ytl, int xtl, int ybr, int xbr, int b, int g, int r) {
        Log.i(TAG, "drawRectangle:" + key);
        Mat image = activity.scriptImages.get(key);
        if (image == null)
            return;
        Core.rectangle(image, new Point(xtl, ytl), new Point(xbr, ybr), new Scalar(b, g, r), -1);
    }

    public void drawFill(String key, int b, int g, int r) {
        Log.i(TAG, "drawFill: " + key);
        Mat image = activity.scriptImages.get(key);
        if (image == null)
            return;
        image.setTo(new Scalar(b, g, r));
    }

    public void data(int type, String name, String values) {
        Log.i(TAG, "data");
        JSONObject sensor = new JSONObject();
        sensor.put("timestamp", System.currentTimeMillis() / 1000.);
        sensor.put("type", new Integer(type));
        sensor.put("name", name);
        JSONArray valuesJS = (JSONArray)(new JSONValue()).parse(values);
        sensor.put("values", valuesJS);
        activity.sensorBuffer.add(sensor);
    }
}
