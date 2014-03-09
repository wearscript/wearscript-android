package com.dappervision.wearscript.events;

public class WarpDrawEvent {
    private final int radius;
    private final double x;
    private final double y;
    private final int r;
    private final int g;
    private final int b;

    public WarpDrawEvent(double x, double y, int radius, int r, int g, int b) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public int getRadius() {
        return radius;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public int getR() {
        return r;
    }

    public int getG() {
        return g;
    }

    public int getB() {
        return b;
    }
}