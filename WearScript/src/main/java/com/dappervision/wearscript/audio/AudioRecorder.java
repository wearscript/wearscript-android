package com.dappervision.wearscript.audio;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import com.google.android.glass.timeline.LiveCard;

import java.io.File;

public class AudioRecorder extends Service {
	
	private final String LOG_TAG = "AudioRecorder";
	private LiveCard mLiveCard;	

    private AudioRecordThread recorder;
    public static String MILLIS_EXTRA_KEY = "millis";
	
	public AudioRecorder() {
	}

	@Override
    public void onCreate() {
        super.onCreate();

        Log.d("Memora", "Service Started");
        createMemoraDirectory();

        recorder = new AudioRecordThread();
		recorder.start();
    }

    @Override
    public void onDestroy() {
    	Log.d("Memora", "Service Destroy");
    	recorder.interrupt();
        super.onDestroy();
    }

	@Override
	public IBinder onBind(Intent intent) {
		// TODO: Return the communication channel to the service.
		throw new UnsupportedOperationException("Not yet implemented");
	}
	
	private void createMemoraDirectory(){
        File directory = new File(AudioRecordThread.directoryAudio);
        if (!directory.isDirectory()){
        	directory.mkdirs();
        }
	}

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent.getAction() != null && intent.getAction().equals("save_audio_intent")) {
            Log.d(LOG_TAG, "Got message");
            long millis = intent.getExtras().getLong(MILLIS_EXTRA_KEY);
            Log.d(LOG_TAG, "millis: " + millis);
            String filepath = recorder.startPolling(millis);
            Log.d(LOG_TAG, "filepath: " + filepath);
        }
        return 0;
    }
	
}
