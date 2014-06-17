package com.dappervision.wearscript.events;

/**
 * Created by christianvazquez on 6/11/14.
 */
public class MediaOnTwoFingerScrollEvent
{
    private float v1,v2,v3;

    public MediaOnTwoFingerScrollEvent(float v1, float v2, float v3)
    {
        this.v1=v1;
        this.v2=v2;
        this.v3=v3;
    }

    public float getV1()
    {
        return v1;
    }
    public float getV2()
    {
        return v2;
    }
    public float getV3()
    {
        return v3;
    }
}
