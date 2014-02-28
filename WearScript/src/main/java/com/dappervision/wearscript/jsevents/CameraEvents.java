package com.dappervision.wearscript.jsevents;

import com.dappervision.wearscript.managers.CameraManager;

public class CameraEvents {
    public static class Start {
        private int maxWidth;
        private boolean background;
        private double period;
        private int maxHeight;

        public Start(double period) {
            this(period, false, 640, 360);
        }

        public Start(double period, boolean background) {
            this(period, background, 640, 360);
        }

        public Start(double imagePeriod, boolean background, int maxWidth, int maxHeight) {
            this.period = imagePeriod;
            this.background = background;
            this.maxWidth = maxWidth;
            this.maxHeight = maxHeight;
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
