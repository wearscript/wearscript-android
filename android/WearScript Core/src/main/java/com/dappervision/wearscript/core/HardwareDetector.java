package com.dappervision.wearscript.core;

import android.os.Build;

public class HardwareDetector {
    public static final boolean isGlass = Build.PRODUCT.equals("glass_1");
}
