package com.mikedg.glass.control.inputhandler;

/**
 * Created by Michael on 2/28/14.
 */
public abstract class BaseInputHandler implements InputHandler {
    private OnStateChangedListener mOnStateChangedListener;
    private OnStateChangedListener.State mLastState = OnStateChangedListener.State.NOT_READY;

    @Override
    public void select() {

    }

    @Override
    public void left() {

    }

    @Override
    public void right() {

    }

    @Override
    public void back() {

    }

    @Override
    public void setOnStateChangedListener(OnStateChangedListener onStateChangedListener) {
        mOnStateChangedListener = onStateChangedListener;
        mOnStateChangedListener.onStateChanged(mLastState);
    }

    public void onStateChanged(OnStateChangedListener.State state) {
        if (mOnStateChangedListener != null) {
            mOnStateChangedListener.onStateChanged(state);
        }
        mLastState = state;
    }
}
