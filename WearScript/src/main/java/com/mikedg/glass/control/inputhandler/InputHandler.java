package com.mikedg.glass.control.inputhandler;

/**
 * Created by Michael on 2/28/14.
 */
public interface InputHandler {
    public void select();
    public void left();
    public void right();
    public void back();

    //These shjould be implemented to handle any connection based setup
    public void start();
    public void stop();

    public void setOnStateChangedListener(OnStateChangedListener onStateChangedListener);
}
