package com.dappervision.wearscript.jsevents;

import com.dappervision.wearscript.managers.CameraManager;

public class CameraEvents {
    public static class Start {
        private int maxWidth;
        private boolean background;
        private double period;
        private int maxHeight;

        public Start(double imagePeriod, int maxHeight, int maxWidth, boolean background) {
            this.period = imagePeriod;
            this.background = background;
            this.maxWidth = maxWidth;
            this.maxHeight = maxHeight;
        }

        public Start(double imagePeriod) {
            this(imagePeriod, 0, 0, false);
        }

        public double getPeriod() {
            return period;
        }

        public boolean getBackground() {
            return background;
        }

        public int getMaxWidth() {
            return maxWidth;
        }

        public int getMaxHeight() {
            return maxHeight;
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
