package com.dappervision.wearscript.managers;

import android.app.Activity;
import android.content.Intent;
import android.speech.RecognizerIntent;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.jsevents.ActivityResultEvent;
import com.dappervision.wearscript.jsevents.SpeechRecognizeEvent;
import com.dappervision.wearscript.jsevents.StartActivityEvent;

import java.util.List;

public class SpeechManager extends Manager {
    static private String SPEECH = "SPEECH";

    public SpeechManager(BackgroundService service) {
        super(service);
        reset();
    }

    public void onEvent(ActivityResultEvent event) {
        int requestCode = event.getRequestCode(), resultCode = event.getResultCode();
        Intent intent = event.getIntent();
        if (requestCode == 1002) {
            Log.d(TAG, "Spoken Text Result");
            if (resultCode == Activity.RESULT_OK) {
                List<String> results = intent.getStringArrayListExtra(
                        RecognizerIntent.EXTRA_RESULTS);
                String spokenText = results.get(0);
                Log.d(TAG, "Spoken Text: " + spokenText);
                // TODO(brandyn): Check speech result for JS injection that can escape out of the quotes
                makeCall(SPEECH, String.format("\"%s\"", spokenText));
            } else if (resultCode == Activity.RESULT_CANCELED) {

            }
        }
    }

    public void onEvent(SpeechRecognizeEvent e) {
        registerCallback(SPEECH, e.getCallback());
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, e.getPrompt());
        Utils.eventBusPost(new StartActivityEvent(intent, 1002));
    }
}
