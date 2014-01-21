package com.dappervision.wearscript.managers;

import android.util.Base64;
import android.util.Log;

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
            Log.d(TAG, "Incoming blob with name: " + blob.getName());
            makeCall(blob.getName(), "'" + Base64.encodeToString(blob.getPayload(), Base64.NO_WRAP) + "'");
        }
    }
}
