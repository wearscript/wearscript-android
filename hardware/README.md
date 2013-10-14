Mirror Holder
=============

Lets you see your hands for gestures and ASL from the camera.
Made using these mirrors (http://www.amazon.com/dp/B000YQK4KQ/ref=pe_385040_30332190_pe_175190_21431760_3p_M3T1_ST1_dp_1)

Eye Tracker
===========

Used to track pupil position.  Use disassembly instructions at (https://code.google.com/p/pupil/wiki/Camera_Modifications) for the HD-6000.  I didn't add the filter and instead of using the auto focus I rotated it 180deg so that it didn't connect but kept the leads (the auto focus is symmetric).  Thanks to the Pupil project (https://code.google.com/p/pupil/ led by Moritz Kassner) for the idea and great instructions.  This is compatible with the pupil tracker there but I have a custom tracker that I wrote that works about the same but is simpler (going to be incorporated into the Android code directly, though it is currently in Python).

Things you'll need

*  Webcam: http://www.amazon.com/Microsoft-LifeCam-HD-6000-Webcam-Notebooks/dp/B00372567A ($21)
*  2 LEDs (recommend you get 4+ as you may break/lose some while soldering): http://www.digikey.com/product-detail/en/SFH%204050-Z/475-2864-1-ND/2207282 (shipping was $2.50 and each LED is ~$.75-$1 depending on amount)
*  Access to a 3d printer (print the .stl file, currently #2 is the best design)
*  Skills: Need to teardown a camera (requires patience), surface mount (de)solder LEDs (is doable with normal soldering equipment), need to take off/break the IR filter on the optics (requires the upmost care, watch Moritz's videos)
