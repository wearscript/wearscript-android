package com.dappervision.wearscript;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;

/**
 * A background thread that receives audio from the microphone and sends it to the waveform
 * visualizing view.
 */
public class AudioRecordingThread extends Thread {
    public static final int SAMPLING_RATE = 44100;
    private static final String TAG = "AudioRecordingThread";
    private boolean mShouldContinue = true;
    private int mBufferSize;
    private short[] mAudioBuffer;

    public AudioRecordingThread(int mBufferSize, short[] mAudioBuffer) {
        this.mBufferSize = mBufferSize;
        this.mAudioBuffer = mAudioBuffer;
    }

    @Override
    public void run() {
        android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_AUDIO);

        AudioRecord record = new AudioRecord(MediaRecorder.AudioSource.MIC, SAMPLING_RATE,
                AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, mBufferSize);
        record.startRecording();

        while (shouldContinue()) {
            record.read(mAudioBuffer, 0, mBufferSize / 2);
            updateDecibelLevel();
        }

        record.stop();
        record.release();
    }

    /**
     * Gets a value indicating whether the thread should continue running.
     *
     * @return true if the thread should continue running or false if it should stop
     */
    private synchronized boolean shouldContinue() {
        return mShouldContinue;
    }

    /**
     * Notifies the thread that it should stop running at the next opportunity.
     */
    public synchronized void stopRunning() {
        mShouldContinue = false;
    }

    /**
     * Computes the decibel level of the current sound buffer and updates the appropriate text
     * view.
     */
    private void updateDecibelLevel() {
        // Compute the root-mean-squared of the sound buffer and then apply the formula for
        // computing the decibel level, 20 * log_10(rms). This is an uncalibrated calculation
        // that assumes no noise in the samples; with 16-bit recording, it can range from
        // -90 dB to 0 dB.
        double sum = 0;

        for (short rawSample : mAudioBuffer) {
            double sample = rawSample / 32768.0;
            sum += sample * sample;
        }

        double rms = Math.sqrt(sum / mAudioBuffer.length);
        final double db = 20 * Math.log10(rms);
        final double normalizedDb = 1 - db / -90;
        Blob blob = new Blob("audio", Double.toString(normalizedDb)).outgoing();
        Utils.eventBusPost(blob);
        Log.d(TAG, "dbs " + normalizedDb);
    }
}