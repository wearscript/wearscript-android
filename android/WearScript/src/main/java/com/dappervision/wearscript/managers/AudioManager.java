package com.dappervision.wearscript.managers;

import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioRecord;

import com.dappervision.wearscript.AudioRecordingThread;
import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.jsevents.AudioEvent;
import com.dappervision.wearscript.jsevents.SoundEvent;
import com.google.android.glass.media.Sounds;

public class AudioManager extends Manager {
    private int mBufferSize;
    private short[] mAudioBuffer;
    private AudioRecordingThread mAudioRecordingThread;
    private android.media.AudioManager systemAudio;

    public AudioManager(BackgroundService service) {
        super(service);
        reset();
    }

    public void onEvent(AudioEvent e) {
        if (e.isStart()) {
            start();
        } else if (e.isStop()) {
            shutdown();
        }
    }

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
        Log.d(TAG, "starting audio capture");
        super.reset();
        mBufferSize = AudioRecord.getMinBufferSize(AudioRecordingThread.SAMPLING_RATE, AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT);
        mAudioBuffer = new short[mBufferSize / 2];
        systemAudio = (android.media.AudioManager) service.getSystemService(Context.AUDIO_SERVICE);
        if (mAudioRecordingThread != null)
            mAudioRecordingThread.stopRunning();
    }

    public void start() {
        reset();
        mAudioRecordingThread = new AudioRecordingThread(mBufferSize, mAudioBuffer);
        mAudioRecordingThread.start();
    }

    public void shutdown() {
        super.shutdown();
        Log.d(TAG, "stopping audio capture");
        if (mAudioRecordingThread != null)
            mAudioRecordingThread.stopRunning();
        mAudioRecordingThread = null;
    }
}
