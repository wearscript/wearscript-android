package com.dappervision.wearscript.managers;

import android.util.Base64;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Blob;

public class BlobManager extends Manager {
    public BlobManager(BackgroundService service) {
        super(service);
        reset();
    }

    public void onEvent(Blob blob) {
        if (blob.isOutgoing()) {
            blob.send(service.getSocketClient());
        } else {
            makeCall(blob.getName(), Base64.encodeToString(blob.getPayload(), Base64.NO_WRAP));
        }
    }
}
