package com.dappervision.wearscript;

import android.content.Context;
import android.content.Intent;
import android.os.Environment;
import android.speech.tts.TextToSpeech;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Locale;

import de.greenrobot.event.EventBus;

public class Utils {
    protected static String TAG = "WearScript:Utils";

    public static String SaveData(byte[] data, String path, boolean timestamp, String suffix) {
        try {
            try {
                File dir = new File(dataPath() + path);
                dir.mkdirs();
                File file;
                if (timestamp)
                    file = new File(dir, Long.toString(System.currentTimeMillis()) + suffix);
                else
                    file = new File(dir, suffix);
                Log.d(TAG, "Lifecycle: SaveData: " + file.getAbsolutePath());
                FileOutputStream outputStream = new FileOutputStream(file);
                outputStream.write(data);
                outputStream.close();
                return file.getAbsolutePath();
            } catch (Exception e) {
                return null;
            }
        } catch (Exception e) {
            Log.e("SaveData", "Bad disc");
            return null;
        }
    }

    static public String dataPath() {
        return Environment.getExternalStorageDirectory().getAbsolutePath() + "/wearscript/";
    }

    static public byte[] LoadFile(File file) {
        try {
            try {
                Log.i(TAG, "LoadFile: " + file.getAbsolutePath());
                FileInputStream inputStream = new FileInputStream(file);
                byte[] data = new byte[(int) file.length()];
                inputStream.read(data);
                inputStream.close();
                return data;
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Bad file read");
            return null;
        }
    }

    static public byte[] LoadData(String path, String suffix) {
        return LoadFile(new File(new File(dataPath() + path), suffix));
    }

    public static EventBus getEventBus() {
        return EventBus.getDefault();
    }

    public static void eventBusPost(Object event) {
        long startTime = System.nanoTime();
        getEventBus().post(event);
        Log.d(TAG, "Event: " + event.getClass().getName() + " Time: " + (System.nanoTime() - startTime) / 1000000000.);
    }

    public static boolean setupTTS(Context context, TextToSpeech tts) {
        Log.i(TAG, "TTS initialized");
        if(HardwareDetector.isGlass){
            //The TTS engine works almost instantly on Glass, and is always the right language. No need to try and configure.
            return true;
        }
        Locale userLocale = Locale.ENGLISH;
        int result = tts.isLanguageAvailable(userLocale);
        if (result == TextToSpeech.LANG_AVAILABLE) {
            result = tts.setLanguage(userLocale);
            if (result == TextToSpeech.SUCCESS) {
                Log.i(TAG, "TTS language set");
                return true;
            } else {
                Log.w(TAG, "TTS language failed " + result);
                return false;
            }
        } else if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            Intent installIntent = new Intent();
            installIntent.setAction(
                    TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
            context.startActivity(installIntent);
            return true;
        } else {
            Log.e(TAG, "User Locale not available for TTS: " + result);
            return false;
        }
    }
}
