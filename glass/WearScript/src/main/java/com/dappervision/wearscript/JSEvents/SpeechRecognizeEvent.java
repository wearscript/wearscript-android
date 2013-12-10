package com.dappervision.wearscript.jsevents;

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
