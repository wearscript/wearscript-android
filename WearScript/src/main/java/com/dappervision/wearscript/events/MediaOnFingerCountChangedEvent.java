package com.dappervision.wearscript.events;

/**
 * Created by christianvazquez on 6/11/14.
 */
public class MediaOnFingerCountChangedEvent
{
    private int countOne;
    private int countTwo;

    public MediaOnFingerCountChangedEvent(int i1,int i2)
    {
        countOne=i1;
        countTwo=i2;
    }
    public int getCountOne()
    {
        return countOne;
    }
    public int getCountTwo()
    {
        return countOne;
    }
}
