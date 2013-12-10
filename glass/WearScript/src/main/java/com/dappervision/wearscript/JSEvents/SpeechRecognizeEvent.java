package com.dappervision.wearscript.jsevents;

/**
 * Created by kurt on 12/9/13.
 */
public class SpeechRecognizeEvent extends CallbackJSBusEvent {
    private String prompt;

    public SpeechRecognizeEvent(String prompt, String callback){
        super(callback);
        this.prompt = prompt;
    }
    public String getPrompt() {
        return prompt;
    }
}
