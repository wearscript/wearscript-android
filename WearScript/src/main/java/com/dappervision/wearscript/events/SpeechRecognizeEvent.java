package com.dappervision.wearscript.events;

public class SpeechRecognizeEvent {
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
