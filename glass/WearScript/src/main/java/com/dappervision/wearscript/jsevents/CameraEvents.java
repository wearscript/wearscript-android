package com.dappervision.wearscript.jsevents;

import com.dappervision.wearscript.managers.CameraManager;

public class CameraEvents {
    public static class Start {
        private double period;

        public Start(double period) {
            this.period = period;
        }

        public double getPeriod() {
            return period;
        }
    }

    public static class Frame implements JSBusEvent {
        private CameraManager.CameraFrame cameraFrame;
        private CameraManager cm;

        public Frame(CameraManager.CameraFrame cameraFrame, CameraManager cm) {
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
}
