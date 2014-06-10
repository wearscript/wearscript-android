package com.dappervision.wearscript.audio;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder.AudioSource;
import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class AudioRecordThread extends Thread{
	
	private static final String LOG_TAG = "Audio";
	
	private static final int RECORDER_SAMPLERATE = 8000;
	private static final int ENCODING_TYPE = AudioFormat.ENCODING_PCM_16BIT;
	private final int CHANNEL_TYPE = AudioFormat.CHANNEL_IN_MONO;
	private final int NUM_CHANNELS = 1;
	private byte BITS_PER_SAMPLE = 16;  
	private final int AUDIO_SOURCE = AudioSource.MIC;
    private final int BYTE_RATE = RECORDER_SAMPLERATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
    private final int RECORDING_SECS = 20;

    public static final String directory = Environment.getExternalStorageDirectory() + File.separator + "wearscript";
    public static final String directoryAudio = directory + File.separator+"audio";
    
    private final int bufferSize = 160; //Each buffer holds 1/100th of a second.
    private final int numBuffers = 100 * RECORDING_SECS; 
    private boolean pollingBuffer = false;
    private String latestFilePath = null;
    
    AudioRecord recorder = null;

    /**
     * Give the thread high priority so that it's not cancelled unexpectedly, and start it
     */
	
	private byte[][] buffers;
	private byte[] totalBuffer;
	
    public AudioRecordThread()
    { 
    	//Try this at lower priorities.
        android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_URGENT_AUDIO);
    }

    @Override
    public void run()
    { 
        Log.d(LOG_TAG, "Running Audio Thread");
        
        buffers  = new byte[numBuffers][bufferSize];
        totalBuffer = new byte[numBuffers * bufferSize];
        
        int ix = 0;
        int N = AudioRecord.getMinBufferSize(RECORDER_SAMPLERATE,CHANNEL_TYPE,ENCODING_TYPE);
        Log.d(LOG_TAG, ""+N);
        try{
        	recorder = new AudioRecord(AUDIO_SOURCE, RECORDER_SAMPLERATE, CHANNEL_TYPE, ENCODING_TYPE, N*10);
        }
        catch(Throwable e){
        	Log.d(LOG_TAG, e.toString());
        	return;
        }
        recorder.startRecording();
        
        try{
            while(!interrupted())
            { 
            	if (!pollingBuffer){
            		//TODO make sure that ix gets reset so that it doesn't overflow.
            		recorder.read(buffers[ix++ % numBuffers],0,bufferSize);
            	}
            	else{
            		pollRingBuffer(ix);
                    writeAudioDataToFile();
                    pollingBuffer = false;
                    Log.d(LOG_TAG, "Audio Saved");
            	}
            }
            Log.d(LOG_TAG, "interrupted");
        }
        catch(Throwable x)
        { 
            Log.d(LOG_TAG, "Error reading voice audio", x);
        }
        /*
         * Frees the thread's resources after the loop completes so that it can be run again
         */
        finally
        { 
            recorder.stop();
            recorder.release();
            Log.d(LOG_TAG, "Thread Terminated");
        }
    }
    
    public String startPolling(long millis){
    	pollingBuffer = true;
    	latestFilePath = audioFileName(millis);
    	return latestFilePath;
    }
    
    private void pollRingBuffer(int ix){
    	int i;
    	int j;
    	for(i = 0; i<numBuffers; i++){
    		for(j = 0; j<bufferSize; j++){
    			totalBuffer[i*bufferSize + j] = buffers[(ix + i)%numBuffers][j];
    		}
    	}
    }
      
    private String audioFileName(long millis) {
        return directoryAudio + File.separator + String.valueOf(millis) + ".wav";
    }
    //TODO what does this do and why is this here
    public String saveAudio(){
    	return "Failed";
    }

    private void writeAudioDataToFile() {
    	int totalAudioLen = numBuffers * bufferSize;
        int totalDataLen = (totalAudioLen * NUM_CHANNELS * BITS_PER_SAMPLE / 8) + 36;
	    //String filePath = audioFileName();
	    byte header[] = new byte[44];
	    byte wavFile[] = new byte[totalBuffer.length + header.length];
	    
	    FileOutputStream os = null;
	    try {
	        os = new FileOutputStream(latestFilePath);
            Log.d(LOG_TAG, "file path: " + latestFilePath);
	    } catch (FileNotFoundException e) {
	        e.printStackTrace();
	    }

        header[0] = 'R';  // RIFF/WAVE header
        header[1] = 'I';
        header[2] = 'F';
        header[3] = 'F';
        header[4] = (byte) (totalDataLen & 0xff);
        header[5] = (byte) ((totalDataLen >> 8) & 0xff);
        header[6] = (byte) ((totalDataLen >> 16) & 0xff);
        header[7] = (byte) ((totalDataLen >> 24) & 0xff);
        header[8] = 'W';
        header[9] = 'A';
        header[10] = 'V';
        header[11] = 'E';
        header[12] = 'f';  // 'fmt ' chunk
        header[13] = 'm';
        header[14] = 't';
        header[15] = ' ';
        header[16] = 16;  // 4 bytes: size of 'fmt ' chunk
        header[17] = 0;
        header[18] = 0;
        header[19] = 0;
        header[20] = 1;  // format = 1
        header[21] = 0;
        header[22] = (byte) NUM_CHANNELS;
        header[23] = 0;
        header[24] = (byte) (RECORDER_SAMPLERATE & 0xff);
        header[25] = (byte) ((RECORDER_SAMPLERATE >> 8) & 0xff);
        header[26] = (byte) ((RECORDER_SAMPLERATE >> 16) & 0xff);
        header[27] = (byte) ((RECORDER_SAMPLERATE >> 24) & 0xff);
        header[28] = (byte) (BYTE_RATE & 0xff);
        header[29] = (byte) ((BYTE_RATE >> 8) & 0xff);
        header[30] = (byte) ((BYTE_RATE >> 16) & 0xff);
        header[31] = (byte) ((BYTE_RATE >> 24) & 0xff);
        header[32] = (byte) (NUM_CHANNELS * BITS_PER_SAMPLE / 8);//(2 * 16 / 8);  // block align (might be half what it should be)
        header[33] = 0;
        header[34] = BITS_PER_SAMPLE;  // bits per sample
        header[35] = 0;
        header[36] = 'd';
        header[37] = 'a';
        header[38] = 't';
        header[39] = 'a';
        header[40] = (byte) (totalAudioLen & 0xff);
        header[41] = (byte) ((totalAudioLen >> 8) & 0xff);
        header[42] = (byte) ((totalAudioLen >> 16) & 0xff);
        header[43] = (byte) ((totalAudioLen >> 24) & 0xff);
	    
	    System.arraycopy(header, 0, wavFile, 0, header.length);
	    System.arraycopy(totalBuffer, 0, wavFile, header.length, totalBuffer.length);
	    
        try {
            os.write(wavFile, 0, wavFile.length);
        } catch (IOException e) {
            e.printStackTrace();
        }
    
	    try {
	        os.close();
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}
}

