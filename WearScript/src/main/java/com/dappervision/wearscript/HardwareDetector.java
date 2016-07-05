package com.dappervision.wearscript;

import android.os.Build;

public class HardwareDetector {
    public static final boolean isHeadWorn = Build.PRODUCT.contains("glass");
    public static final boolean hasGDK = Build.PRODUCT.equals("glass_1");
}
