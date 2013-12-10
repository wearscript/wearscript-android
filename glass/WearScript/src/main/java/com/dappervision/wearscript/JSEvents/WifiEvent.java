package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class WifiEvent implements JSBusEvent {
    private boolean status;

    public WifiEvent(boolean status){
        this.status = status;
    }

    public boolean getStatus(){
        return status;
    }
}
