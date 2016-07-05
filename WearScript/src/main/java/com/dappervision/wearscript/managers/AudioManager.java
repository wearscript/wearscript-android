package com.dappervision.wearscript.managers;


import android.content.Context;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.events.SoundEvent;
import com.google.android.glass.media.Sounds;

import de.greenrobot.event.Subscribe;

public class AudioManager extends Manager {
    private android.media.AudioManager systemAudio;

    public AudioManager(BackgroundService service) {
        super(service);
        systemAudio = (android.media.AudioManager) service.getSystemService(Context.AUDIO_SERVICE);
        reset();
    }

    @Subscribe
    public void onEvent(SoundEvent event) {
        String type = event.getType();
        if (type.equals("TAP"))
            systemAudio.playSoundEffect(Sounds.TAP);
        else if (type.equals("DISALLOWED"))
            systemAudio.playSoundEffect(Sounds.DISALLOWED);
        else if (type.equals("DISMISSED"))
            systemAudio.playSoundEffect(Sounds.DISMISSED);
        else if (type.equals("ERROR"))
            systemAudio.playSoundEffect(Sounds.ERROR);
        else if (type.equals("SELECTED"))
            systemAudio.playSoundEffect(Sounds.SELECTED);
        else if (type.equals("SUCCESS"))
            systemAudio.playSoundEffect(Sounds.SUCCESS);
    }

    public void reset() {
        super.reset();
    }
}
