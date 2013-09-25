package us.openglass;

public class OpenGlassScript {
    MainActivity activity;

    OpenGlassScript(MainActivity m) {
        activity = m;
    }

    public void say(String text) {
        activity.say(text);
    }

}
