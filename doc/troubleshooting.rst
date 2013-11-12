Troubleshooting
================
* "adb: command not found" - Android Dev Tools need to be in your path
* Android Studio on OSX (0.2.13) doesn't include the SDK.  After Studio is install download the SDK (http://developer.android.com/sdk/index.html, sdk tools should be sufficient), move the "sdk" folder from there to /Applications/Android\ Studio.app.
* When doing bash install.sh for the server if you get something like below, you need go version 1.1 (you may have 1.0)
    * # github.com/ugorji/go/codec
    * /usr/lib/go/src/pkg/github.com/ugorji/go/codec/encode.go:107: undefined: io.ByteWriter
    * # github.com/ugorji/go/codec
    * /usr/lib/go/src/pkg/github.com/ugorji/go/codec/encode.go:107: undefined: io.ByteWriter
