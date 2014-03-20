package com.dappervision.wearscript.events;

import android.net.Uri;

import java.net.URI;

public class MediaEvent {
    private final URI uri;
    private final boolean looping;
    private final boolean status;

    public MediaEvent(URI uri, boolean looping) {
        this.uri = uri;
        this.looping = looping;
        this.status = false;
    }

    public boolean isLooping() {
        return looping;
    }

    public Uri getUri() {
        return android.net.Uri.parse(uri.toString());
    }
}
