package com.mikedg.glass.control;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Michael on 3/1/14.
 */
public class ProcessUtility {
    public static interface OutputHandler<E> {
        public E onProcessStreamsFinished(String stdout, String stderr, int evitValue);
    }
    /**
     * Only execute for short processes since we wait here for them to finish.
     * The hope behind this is that this fixes issues with blocking data
     *
     * @param command Command to execute
     * @return
     */
    public static <E> E executeProcess(String[] command, OutputHandler<E> processor) throws IOException, InterruptedException {
        L.d("Executing process: " + command[0]);

        int exitValue = -1;
        Process process = new ProcessBuilder(command).start();
        //If we ever run into a problem with this hanging, it probably cant find the device and use the stream gobblers to figure it out
        StreamGobbler errorGobbler = new
                StreamGobbler(process.getErrorStream(), "stderr");

        // any output?
        StreamGobbler outputGobbler = new
                StreamGobbler(process.getInputStream(), "stdout");

        L.d("About to wait for process " + command[0]);

        //But what if I don't waitFor and I just manually wait for the streams to finish?
        L.d("Finished process " + command[0]);

        //join the gobblers then parse the strings with the outputhandler ill be passing in?
        errorGobbler.join();
        outputGobbler.join();

        try {
            exitValue = process.exitValue(); //This still sometimes hangs even though i'm reading non-stop, wtf'ing fuck?
        } catch (IllegalThreadStateException ex) {
            L.d("The streams were gobbled, but the process didn't have an exit value");
            ex.printStackTrace();
        }

        E result = processor.onProcessStreamsFinished(outputGobbler.getOuput(), errorGobbler.getOuput(), exitValue);

        process.destroy();
        return result;
    }

    private static class StreamGobbler {
        private Thread thread;
        private String output = "";

        public String getOuput() {
            return output;
        }

        public StreamGobbler(final InputStream stream, final String type) {
            thread = new Thread() {
                public void run() {
                    String line;

                    BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
                    L.d("Trying to eat stream " + type);
                    try {
                        while ((line = reader.readLine()) != null) {
                            L.d("output from " + type + ": " + line);
                            output += line;
                        }
                    } catch (IOException e) {
                        L.d("Error eating stream " + type);
                        e.printStackTrace();
                    }
                    L.d("Finished eating stream " + type);
                }
            };
            thread.start();
        }

        public void join() throws InterruptedException {
            thread.join();
        }
    }
}
