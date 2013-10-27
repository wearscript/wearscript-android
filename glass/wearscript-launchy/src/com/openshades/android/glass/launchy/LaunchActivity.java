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
//A good 80% of this app is from the Android SDK home app sample
package com.openshades.android.glass.launchy;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

public class LaunchActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Uri uri = getIntent().getData();

        //FIXME: I cant actually get the open command to give me an option here... wtf...
        if (uri.getHost().endsWith("youtube.com") && uri.getScheme().startsWith("http")) {
            //Works
//            Intent i = new Intent();
//            i.setAction("com.google.glass.action.VIDEOPLAYER");
//            i.putExtra("video_url","http://www.youtube.com/watch?v=2L5oYI67BCc");
//            startActivity(i);

            Intent i = new Intent();
//            i.setFlags(0x10000000);
            i.setAction("com.google.glass.action.VIDEOPLAYER");
            //i.putExtra("video_url","http://www.youtube.com/watch?v=yaE2XgB09yU");//worked
            i.putExtra("video_url",uri.toString());
            startActivity(i);

//            adb shell am start -a com.google.glass.action.VIDEOPLAYER  -e video_url http://www.youtube.com/watch?v=2L5oYI67BCc
        } else if (uri.getScheme().equals("youtube")) {
            //FIXME: untested
            //Load up alternate youtube way
            Intent i = new Intent();
            i.setAction("com.google.glass.action.VIDEOPLAYER");
            i.putExtra("video_url","http://" + uri.getHost() + uri.getPath()); //FIXME: check this
            startActivity(i);
        } else {

            //Load up app
            Intent i = new Intent();
            //getPath includes the leading / so skip it
            i.setComponent(new ComponentName(uri.getHost(), uri.getPath().substring(1)));
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        }
        
        finish();
        //Toast.makeText(this, "In LaunchActivity" + getIntent().getDataString(), Toast.LENGTH_LONG).show();
    }
}
