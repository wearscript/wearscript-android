package com.dappervision.wearscript.jsevents;

import com.dappervision.wearscript.managers.CameraManager;

public class CameraFrameEvent implements JSBusEvent {
    private CameraManager.CameraFrame cameraFrame;
    private CameraManager cm;

    public CameraFrameEvent(CameraManager.CameraFrame cameraFrame, CameraManager cm) {
        this.cameraFrame = cameraFrame;
        this.cm = cm;
    }
    public CameraManager.CameraFrame getCameraFrame() {
        return cameraFrame;
    }

    public void done() {
        cm.addCallbackBuffer();
    }

}
