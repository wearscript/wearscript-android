launchy
===========

A way to launch native apps on Google Glass.

- Build and deploy Launchy to your Glass device
- Scroll over to settings in GlassHome and select that. You should get a typical Android dialog that gives you the option of picking GlassHome or Launchy for this action. Select Launchy and check the box to always use Launchy.
- Now whenever you go to Settings in GlassHome, Launchy will pop up. If you actually need to get to Glass settings, Launchy provides a permanent link for that.

So why do we need this app?
Glass provides no way to launch native apps. If you deploy and run an app, as soon as the screen goes off GlassHome takes over and you can not run your app again.

How'd you do that? GlassHome has a handful of local Activities that are launched, but many of these are launched by Package and Class name, however we lucked out because settings was simply launched with an action that I can intercept and decide to have Launchy take over from there.

Who is Mike DiGiovanni? Emerging technology lead at Roundarch Isobar (http://www.roundarchisobar.com) Mike has interests in all areas of mobile development and wearable computing. As a long time Android developer, he is looking forward to working with Google Glass.

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
