package com.dappervision.wearscript.ui;

import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ProgressBar;
import android.os.Handler;

import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.R;
import com.dappervision.wearscript.Utils;
import com.dappervision.wearscript.events.MediaActionEvent;
import com.dappervision.wearscript.events.MediaGestureEvent;
import com.dappervision.wearscript.events.MediaOnFingerCountChangedEvent;
import com.dappervision.wearscript.events.MediaOnScrollEvent;
import com.dappervision.wearscript.events.MediaOnTwoFingerScrollEvent;
import com.google.android.glass.touchpad.Gesture;
import com.google.android.glass.touchpad.GestureDetector;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class MediaPlayerFragment extends GestureFragment implements MediaPlayer.OnErrorListener, MediaPlayer.OnPreparedListener {
    public static final String ARG_URL = "ARG_URL";
    public static final String ARG_LOOP = "ARG_LOOP";
    private static final String TAG = "MediaPlayerFragment";
    public static final String BIND = "bindGesture";
    private MediaPlayer mp;
    private Uri mediaUri;
    private SurfaceHolder holder;
    private ProgressBar progressBar;
    private SurfaceView surfaceView;
    private Handler stutterHandler;
    private Runnable stutterThread;
    private int currentTime;
    private boolean interrupt;
    private List<Integer> seekTimes;
    private int[] times;
    private long prevJumpTime;
    private int seekPosition = 0;




    public static MediaPlayerFragment newInstance(Uri uri, boolean looping) {
        Bundle args = new Bundle();
        args.putParcelable(ARG_URL, uri);
        args.putBoolean(ARG_LOOP, looping);
        MediaPlayerFragment f = new MediaPlayerFragment();
        f.setArguments(args);
        return f;
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        Utils.getEventBus().register(this);
        setRetainInstance(true);
        mediaUri = getArguments().getParcelable(ARG_URL);
        createMediaPlayer();


    }

    private void createMediaPlayer()
    {
        if (progressBar != null)
            progressBar.setVisibility(View.VISIBLE);
        mp = new MediaPlayer();
        try {
            mp.setDataSource(getActivity(), mediaUri);
        } catch (IOException e) {
            e.printStackTrace();
        }
        mp.setOnErrorListener(this);
        mp.setOnPreparedListener(this);

        if (getArguments().getBoolean(ARG_LOOP))
            mp.setLooping(true);
        mp.prepareAsync();
    }

    public void onEvent(MediaActionEvent e)
    {
        String action = e.getAction();
        if (action.equals("play"))
        {
            interrupt=true;
            mp.start();
        } else if (action.equals("stop"))
        {
            interrupt=true;
            mp.stop();
            getActivity().finish();
        } else if (action.equals("pause"))
        {
            interrupt=true;
            mp.pause();
        } else if (action.equals("playReverse"))
        {
            playReverse(e.getMsecs());
        }
        else if (action.equals("jump"))
        {
            interrupt=true;
            jump(e.getMsecs());
        }
        else if (action.equals("playFastForward"))
        {
              playFastForward(e.getMsecs());
        }
        else if (action.equals("rewind"))
        {
            rewind(e.getMsecs());
        }
        else if (action.equals("fastForward"))
        {
            fastForward(e.getMsecs());
        } else if (action.equals("seekTo")) {
            mp.seekTo(e.getMsecs());
        } else if (action.equals("seekBackwards")) {
            mp.seekTo(mp.getDuration() - e.getMsecs());
        }
    }

    private void jump(int jumpVector)
    {
        if(jumpVector==0) return;
        int newPosition = mp.getCurrentPosition() + jumpVector;
        if (jumpVector>0 && newPosition>mp.getDuration())
        {
                mp.seekTo(mp.getDuration());
        }
        else if (jumpVector<0 && newPosition<0)
        {
                mp.seekTo(0);
        }
        else
        {
                mp.seekTo(newPosition);
        }
    }
    private void stutter(int period)
    {

        final int p = period;
        stutterHandler = new Handler();
        mp.seekTo(mp.getDuration());
        currentTime = mp.getDuration();
        stutterThread = new Runnable() {
            public void run() {

                if (!interrupt) {
                    currentTime = currentTime - p;
                    if (currentTime <= 0) {
                        mp.seekTo(0);
                        mp.start();
                    } else {

                        mp.seekTo(currentTime);
                        mp.start();
                        stutterHandler.postDelayed(stutterThread, p);

                    }
                }
            }
        };
        stutterHandler.postDelayed(stutterThread, period);
    }




    @Override
    public boolean onScroll(float v, float v2, float v3)
    {
        Utils.eventBusPost(new MediaOnScrollEvent(v,v2,v3));
        return false;
    }
//    private boolean togglePlayPause()
//    {
//        if(mp.isPlaying())
//            return false;
//        int newPosition = mp.getCurrentPosition() + (int)(v * 10);
//        if(newPosition < 0)
//            newPosition = 0;
//        if(newPosition > mp.getDuration())
//            newPosition = mp.getDuration() - 5;
//        mp.seekTo(newPosition);
//        return true;
//    }

    private void modifiedSpeedPlayback(final int speed,int direction,boolean fromEndpoint)
    {
        if(speed<=0)return;
        mp.pause();
        final int startDelay=100;
        seekTimes = new ArrayList<Integer>();
        final int duration = mp.getDuration();



        if (direction==0)
        {
            if (fromEndpoint)
            {
                for (int i = duration; i >= 0; i -= speed) {
                    seekTimes.add(i);
                }
            }
            else
            {
                for (int i = mp.getCurrentPosition(); i >= 0; i -= speed)
                {
                    seekTimes.add(i);
                }
            }
        }
        else
        {
            if (fromEndpoint)
            {
                for (int i = 0; i < duration; i += speed)
                {
                    seekTimes.add(i);
                }
            }
            else
            {
                for (int i = mp.getCurrentPosition(); i < duration; i += speed)
                {
                    seekTimes.add(i);
                }
            }
        }
        mp.setOnSeekCompleteListener(new MediaPlayer.OnSeekCompleteListener()
        {
            @Override
            public void onSeekComplete(MediaPlayer mediaPlayer)
            {
                long currentTime=System.currentTimeMillis();
                if (currentTime>prevJumpTime+2*speed)
                {
                    seekPosition++;
                }
                if (seekPosition<seekTimes.size()&&!interrupt)
                {
                    seekPosition++;
                    prevJumpTime=currentTime;
                    mp.seekTo(seekTimes.get(seekPosition-1));
                }
                else
                {
                    seekPosition = 0;
                    if(!interrupt)
                        mp.start();
                }
            }
        });
        interrupt=false;
        Timer timer = new Timer();
        timer.schedule(new TimerTask()
        {
            @Override
            public void run()
            {
                seekPosition++;
                prevJumpTime=System.currentTimeMillis();
                if(seekTimes.size()>0)
                mp.seekTo(seekTimes.get(0));
            }
        },startDelay);

    }

    private void rewind(final int speed)
    {
        modifiedSpeedPlayback(speed,0,false);
    }
    private void fastForward(final int speed)
    {
        modifiedSpeedPlayback(speed,1,false);

    }
    private void playReverse(final int speed)
    {
              modifiedSpeedPlayback(speed,0,true);
    }

    private void playFastForward(int speed)
    {
        modifiedSpeedPlayback(speed,1,true);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_media_player, container, false);
        surfaceView = (SurfaceView) v.findViewById(R.id.media_surface);
        progressBar = (ProgressBar) v.findViewById(R.id.video_progressBar);
        holder = surfaceView.getHolder();
        holder.addCallback(new SurfaceHolder.Callback() {

            public void surfaceCreated(SurfaceHolder holder) {
                if (mp != null) {
                    mp.setDisplay(holder);
                }
            }

            public void surfaceDestroyed(SurfaceHolder holder) {
                if (mp != null) {
                    mp.setDisplay(null);
                }
            }

            public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
            }
        });

        return v;
    }

    @Override
    public void onPause() {
        super.onPause();
        Log.d(TAG, "onPause");
        getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getActivity().finish();
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy");
        if (mp.isPlaying())
            mp.stop();
        mp.release();
        mp = null;
        Utils.getEventBus().unregister(this);
    }

    @Override
    public boolean onError(MediaPlayer mediaPlayer, int i, int i2) {
       Log.e(TAG, "MediaPlayer Error: ");
        if(i == MediaPlayer.MEDIA_ERROR_SERVER_DIED) {
            Log.w(TAG, "Server Died");
            mediaPlayer.release();
            mp = null;
            createMediaPlayer();
        }else if (i == MediaPlayer.MEDIA_ERROR_UNKNOWN) {
            Log.w(TAG, "Unknown Error, resetting");
            mediaPlayer.release();
            mp = null;
            createMediaPlayer();
        }
        return false;
    }

    @Override
    public void onPrepared(MediaPlayer mediaPlayer) {
        if(progressBar != null){
            progressBar.setVisibility(View.GONE);
        }
        surfaceView.setVisibility(View.VISIBLE);
        mediaPlayer.start();
    }


    @Override
    public boolean onGesture(Gesture gesture)
    {
        Utils.eventBusPost(new MediaGestureEvent(gesture));
        return false;
    }

    public void onFingerCountChanged(int i, int i1)
    {
        Utils.eventBusPost(new MediaOnFingerCountChangedEvent(i,i1));
    }

    boolean onTwoFingerScroll(float v, float v1, float v2)
    {
        Utils.eventBusPost(new MediaOnTwoFingerScrollEvent(v,v1,v2));
        return false;

    }

}
