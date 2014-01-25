package com.dappervision.wearscript.jsevents;

public class SpeechRecognizeEvent implements JSBusEvent {
    private String prompt;
    private String callback;

    public SpeechRecognizeEvent(String prompt, String callback) {
        this.callback = callback;
        this.prompt = prompt;
    }

    public String getCallback() {
        return callback;
    }

    public String getPrompt() {
        return prompt;
    }
}
