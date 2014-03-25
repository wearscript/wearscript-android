/*
Copyright 2013 Michael DiGiovanni glass@mikedg.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package com.mikedg.glass.control.inputhandler;

import android.view.KeyEvent;

import com.mikedg.glass.control.L;
import com.mikedg.glass.control.ProcessUtility;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;

/**
 * Created by mdigiovanni on 10/24/13.
 */
//Other implementations could be an implementation that requires root
//A system signed API level implementation
public class AdbTcpInputHandler extends BaseInputHandler {
    private Process process;
    private BufferedWriter out;
    private Thread mLocalConnectionThread;

    public AdbTcpInputHandler() {
        L.d("Created AdbTcpInputHandler");
        onStateChanged(OnStateChangedListener.State.NOT_READY);
    }

    public void start() {
        L.d("Starting AdbTcpInputHandler");
        tryConnectingLocally();
    }

    public void stop() {
        onStateChanged(OnStateChangedListener.State.NOT_READY);
        if (process != null) {
            process.destroy();
        }
        if (out != null) {
            try {
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void tryOpeningAdb() {
        try {
            L.d("Trying to open the shell locally");
            process = new ProcessBuilder(new String[]{"adb","-s","127.0.0.1:5555", "shell"}).start();
            out = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream()));
            L.d("Just tried to open shell locally");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                L.d("Got a thread interrupted exception");
                e.printStackTrace();
            }
            L.d("Just slept for a few seconds, and about to try our hack to see if we actually connected");
            try {
                int exit = process.exitValue();
                L.d("Exit value returned, so we are not connected");
                onStateChanged(OnStateChangedListener.State.CATASTROPHIC_FAILURE);
                return;
            } catch (IllegalThreadStateException ex) {
                L.d("IllegalThreadStateException, which means our hack verified that we are ikely connected");
                //Hack
                //If we actually connected this should throw an exception so proceed
                //If we didn't connect, we manuall throw the exception to crash
            }
            L.d("Setting isConnected = true");
            onStateChanged(OnStateChangedListener.State.READY);
        } catch (IOException e) {
            e.printStackTrace();
            onStateChanged(OnStateChangedListener.State.CATASTROPHIC_FAILURE);
            return;
        }
    }

    private enum ConnectionStatus {
        ALREADY_CONNECTED, CONNECTED, UNKNOWN
    }

    private void tryConnectingLocally() {
        mLocalConnectionThread = new Thread() {
            public void run() {
                L.d("Trying to connect locally");
                try {
                    ConnectionStatus status = ProcessUtility.executeProcess(new String[]{"adb","connect", "127.0.0.1"}, new ProcessUtility.OutputHandler<ConnectionStatus>() {
                        @Override
                        public ConnectionStatus onProcessStreamsFinished(String stdout, String stderr, int evitValue) {
                            //New connection
//                            03-02 08:20:38.581  22624-22643/com.mikedg.glass.control D/GLASSCONTROL﹕ output from stdout: connected to 127.0.0.1:5555
                            if (stdout.contains("connected to 127.0.0.1:5555")) {
                                return ConnectionStatus.CONNECTED;
                            } else if (stdout.contains("already connected to 127.0.0.1:5555")) {
                                return ConnectionStatus.ALREADY_CONNECTED;
                            }
                            return ConnectionStatus.UNKNOWN;
                        }
                    }); //Wait for this to finish, should be nearly instant
                    L.d("conneciotn status:" + status); // on success it's 0, on a failure, it's 0 too :(
                    if (status == ConnectionStatus.UNKNOWN) {
                        onStateChanged(OnStateChangedListener.State.CATASTROPHIC_FAILURE);
                        return;
                    }
                } catch (IOException e) {
                    L.d("io exception while trying to wait");
                    e.printStackTrace();
                    onStateChanged(OnStateChangedListener.State.CATASTROPHIC_FAILURE);
                    return;
                } catch (InterruptedException e) {
                    L.d("interruped exception while trying to wait");
                    e.printStackTrace();
                    onStateChanged(OnStateChangedListener.State.CATASTROPHIC_FAILURE); //FIXME: re-evaluate this to make sure this is a fail condition
                    return;
                }
                tryOpeningAdb();
            }
        };
        mLocalConnectionThread.start();
    }

    public void select() {
        try {
            out.write("input keyevent " + KeyEvent.KEYCODE_ENTER);
            out.newLine();
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e); //FIXME: handle gracefully
        }
    }

    public void left() {
        try {
            out.write("input keyevent " + KeyEvent.KEYCODE_DPAD_LEFT);
            out.newLine();
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e); //FIXME: handle gracefully
        }
    }

    public void right() {
        try {
            out.write("input keyevent " + KeyEvent.KEYCODE_DPAD_RIGHT);
            out.newLine();
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e); //FIXME: handle gracefully
        }
    }

    public void back() {
        try {
            out.write("input keyevent " + KeyEvent.KEYCODE_BACK);
            out.newLine();
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e); //FIXME: handle gracefully
        }
    }
}
