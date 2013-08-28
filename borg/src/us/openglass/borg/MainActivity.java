package us.openglass.borg;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.TreeMap;
import java.util.TreeSet;

import net.kencochrane.raven.DefaultRavenFactory;
import net.kencochrane.raven.Raven;
import net.kencochrane.raven.RavenFactory;

import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.CameraBridgeViewBase.CvCameraViewFrame;
import org.opencv.android.CameraBridgeViewBase.CvCameraViewListener2;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.AudioRecord.OnRecordPositionUpdateListener;
import android.media.MediaRecorder;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.util.Base64;
import android.util.Log;
import android.view.SurfaceView;
import android.view.WindowManager;

import com.codebutler.android_websockets.WebSocketClient;

public class MainActivity extends Activity implements CvCameraViewListener2, SensorEventListener, OnInitListener, OnRecordPositionUpdateListener {
	private static final String TAG = "Borg";

	private JavaCameraView view;
	private WebSocketClient client;
	private TextToSpeech tts;
	private Raven raven;
	private String glassID;
	private LocationManager location;
	private ByteBuffer audioBuffer;
	private AudioRecord audio;
	private String wsUrl;
	private boolean isForeground;

	// Transient data
	protected Mat matchH;
	protected TreeMap<String, Mat> matchOverlays;
	private Mat overlay;
	private long lastImageSaveTime, lastSensorSaveTime;
	private TreeMap<Integer, Long> lastSensorTime;
	private int remoteImageAckCount, remoteImageCount;
	private int saveDataThreadRunning;
	private JSONArray sensorBuffer;

	// Borg Options
	protected TreeSet<Integer> borgSensors;
	protected Boolean borgDataRemote;
	protected Boolean borgDataLocal;
	protected long borgSensorDelay;
	protected long borgSensorResolution;
	protected long borgImageResolution;
	protected Boolean borgImage;
	protected Boolean borgPreviewWarp;
	protected Boolean borgFlicker;
	protected Boolean borgOverlay;
	protected Boolean borgWarpSensor;
	protected double[] borgHBigToGlass;
	protected double[] borgHSmallToBig;
	protected double[] borgHSmallToGlass;
	protected Mat borgHSmallToGlassMat;

	// Andrew's rotation
	protected long senhackTime;
	protected float senhackOldValues[];
	protected float senhackNewValues[];


	protected double[] HMult(double a[], double b[]) {
		if (a == null || b == null)
			return null;
		double c[] = new double[9];
		c[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
		c[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
		c[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
		c[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
		c[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
		c[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
		c[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
		c[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
		c[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
		return c;
	}

	// TODO: Make use of this if the device is a phone
	private void setupLocation() {
		location.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 10, new LocationListener() {
			@Override
			public void onLocationChanged(Location location) {
				Integer type = -1;
				if (!sampleSensor(type))
					return;
				JSONObject sensor = new JSONObject();
				sensor.put("timestamp", System.currentTimeMillis() / 1000.);
				sensor.put("accuracy", new Float(location.getAccuracy()));
				sensor.put("type", type);
				sensor.put("name", "Custom GPS Lat/Lon/Bearing/Speed");
				JSONArray values = new JSONArray();
				values.add(new Double(location.getLatitude()));
				values.add(new Double(location.getLongitude()));
				values.add(new Double(location.getBearing()));
				values.add(new Double(location.getSpeed()));
				sensor.put("values", values);
				sensorBuffer.add(sensor);
			}

			@Override
			public void onProviderDisabled(String provider) {				
			}

			@Override
			public void onProviderEnabled(String provider) {
			}

			@Override
			public void onStatusChanged(String provider, int status,
					Bundle extras) {
			}

		});
	}

	private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(this) {
		@Override
		public void onManagerConnected(int status) {
			switch (status) {
			case LoaderCallbackInterface.SUCCESS:
			{
				Log.i(TAG, "OpenCV loaded successfully");
				matchOverlays = new TreeMap<String, Mat>();
				matchH = null;
				overlay = null;
				view.enableView();
			} break;
			default:
			{
				super.onManagerConnected(status);
			} break;
			}
		}
	};

	public MainActivity() {
		Log.i(TAG, "Instantiated new " + this.getClass());
		RavenFactory.registerFactory(new DefaultRavenFactory());
	}

	public String getMacAddress() {
		WifiManager wm = (WifiManager) getSystemService(Context.WIFI_SERVICE);
		WifiInfo info = wm.getConnectionInfo();
		return info.getMacAddress();
	}

	@Override
	public void onInit(int status) {
		if (status == TextToSpeech.SUCCESS) {
			int result = tts.setLanguage(Locale.US);
			// TODO: Check result
		}
		// TODO: Check result on else
	}

	protected double[] ParseJSONDoubleArray(JSONArray a) {
		if (a == null)
			return null;
		double out[] = new double[a.size()];
		for (int i = 0; i < a.size(); ++i) {
			try {
				out[i] = (Double)a.get(i);
			} catch (ClassCastException e) {
				out[i] = ((Long)a.get(i)).doubleValue();
			}
		}
		return out;
	}

	protected Mat HMatFromArray(double a[]) {
		Mat m = new Mat(3, 3, CvType.CV_64FC1);
		for (int i = 0; i < 3; ++i)
			for (int j = 0; j < 3; ++j)
				m.put(i, j, a[i * 3 + j]);
		return m;
	}

	protected void parseOptions(JSONObject o) {
		// TODO: Need to save the options to be parsed later, we may miss them if we aren't polling
		JSONObject opts = (JSONObject) o.get("options");
		if (opts == null)
			return;
		borgImage = (Boolean)opts.get("image");
		JSONArray newSensors = (JSONArray)opts.get("sensors");
		TreeSet<Integer> newSensorsSet = new TreeSet<Integer>();
		for (int i = 0; i < newSensors.size(); ++i) {
			newSensorsSet.add(((Long)newSensors.get(i)).intValue());
		}
		borgSensors = newSensorsSet;
		borgOverlay = (Boolean)opts.get("overlay");
		borgPreviewWarp = (Boolean)opts.get("previewWarp");
		borgFlicker = (Boolean)opts.get("previewWarp");
		borgWarpSensor = (Boolean)opts.get("warpSensor");

		borgDataRemote = (Boolean)opts.get("dataRemote");
		borgDataLocal = (Boolean)opts.get("dataLocal");
		borgHBigToGlass = ParseJSONDoubleArray((JSONArray)opts.get("HBigToGlass"));
		borgHSmallToBig = ParseJSONDoubleArray((JSONArray)opts.get("HSmallToBig"));
		borgHSmallToGlass = HMult(borgHBigToGlass, borgHSmallToBig);
		if (borgHSmallToGlass != null) {
			borgHSmallToGlassMat = HMatFromArray(borgHSmallToGlass);
		}
		senhackTime = 0;
		senhackOldValues = null;
		senhackNewValues = null;

		if (raven == null) {
			String ravenDSN = (String)opts.get("ravenDSN");
			// NOTE(brandyn): This doesn't allow switching ravenDSNs
			if (ravenDSN != null && !ravenDSN.equals("")) {
				raven = RavenFactory.ravenInstance(ravenDSN);
			}
		}
		Double delayNew;
		try {
			delayNew = (Double)opts.get("sensorDelay");
		} catch (ClassCastException e) {
			delayNew = ((Long)opts.get("sensorDelay")).doubleValue();
		}
		borgSensorDelay = Math.round(Math.max(delayNew, .25) * 1000000000.);
		try {
			borgSensorResolution = Math.round((Double)opts.get("sensorResolution") * 1000000000.);
		} catch (ClassCastException e) {
			borgSensorResolution = Math.round(((Long)opts.get("sensorResolution")).doubleValue() * 1000000000.);
		}
		try {
			borgImageResolution = Math.round((Double)opts.get("imageResolution") * 1000000000.);
		} catch (ClassCastException e) {
			borgImageResolution = Math.round(((Long)opts.get("imageResolution")).doubleValue() * 1000000000.);
		}
		String url = (String)opts.get("url");
		if (url != null && (wsUrl == null || !wsUrl.equals(url))) {
			setupWSClient(url);
		}
	}

	protected Mat ImageBGRFromString(String dataB64) {
		byte[] data = Base64.decode(dataB64, Base64.NO_WRAP);
		Mat frame = new Mat(1, data.length, CvType.CV_8UC1);
		frame.put(0,  0, data);
		return Highgui.imdecode(frame, 1);
	}

	protected Mat ImageRGBAFromString(String data) {
		Mat frameBGR = ImageBGRFromString(data);
		Mat frameRGBA = new Mat(frameBGR.rows(), frameBGR.cols(), CvType.CV_8UC4);
		Imgproc.cvtColor(frameBGR, frameRGBA, Imgproc.COLOR_BGR2RGBA);
		return frameRGBA;
	}

	protected Mat ImageLike(Mat image) {
		if (image.channels() == 3)
			return new Mat(image.rows(), image.cols(), CvType.CV_8UC4);
		return new Mat(image.rows(), image.cols(), CvType.CV_8UC3);
	}

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		lastImageSaveTime = lastSensorSaveTime = System.nanoTime();
		lastSensorTime = new TreeMap<Integer, Long>();
		location = (LocationManager)getSystemService(LOCATION_SERVICE);

		borgDataLocal = borgDataRemote = borgImage = false;
		borgSensors = new TreeSet<Integer>();
		borgSensorDelay = 100000000;
		borgSensorResolution = 100000000;
		borgImageResolution = 250000000;
		borgPreviewWarp = false;
		borgFlicker = false;
		borgWarpSensor = false;
		borgOverlay = false;
		borgHBigToGlass = null;
		borgHSmallToBig = null;
		borgHSmallToGlass = null;
		saveDataThreadRunning = 0;
		isForeground = true;
		client = null;

		remoteImageAckCount = remoteImageCount = 0;
		sensorBuffer = new JSONArray();
		// TODO(brandyn): Swap this out for a random string that is saved to disk
		glassID = getMacAddress();
		Log.i(TAG, "called onCreate");
		super.onCreate(savedInstanceState);
		getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
		/*
		WindowManager.LayoutParams layoutParams = getWindow().getAttributes();
		layoutParams.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_FULL;
		getWindow().setAttributes(layoutParams);
		 */
		int bufferSize = AudioRecord.getMinBufferSize(44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
		/*
		if (bufferSize != AudioRecord.ERROR_BAD_VALUE){
        	Log.i(TAG, "Audio: good size:" + Integer.toString(bufferSize));
        	//bufferSize = Math.max(bufferSize, 1024 * 1024);
        	audioBuffer = ByteBuffer.allocate(bufferSize);
        	audio = new AudioRecord(MediaRecorder.AudioSource.DEFAULT, 44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize);
        	if (audio.getState() == AudioRecord.STATE_INITIALIZED) {
            	Log.i(TAG, "Audio: good state");
        		audio.startRecording();
        		audio.setPositionNotificationPeriod(50);
        		audio.setNotificationMarkerPosition(1);
        		audio.setRecordPositionUpdateListener(this);
        		for (int i = 0; i < 10; i++) {
        			audio.read(audioBuffer, bufferSize);
                	Log.i(TAG, "Audio: good read");
        		}
        	} else {
            	Log.i(TAG, "Audio: bad state");
        	}
        } else {
        	Log.i(TAG, "Audio: bad size");
        }
		 */
		Intent intent = new Intent("com.google.zxing.client.android.SCAN");
		startActivityForResult(intent, 0);
		setContentView(R.layout.borg_surface_view);
		view = (JavaCameraView)findViewById(R.id.borg_activity_java_surface_view);

		tts = new TextToSpeech(this, this);

		view.setVisibility(SurfaceView.VISIBLE);

		view.setCvCameraViewListener(this);

		SensorManager mSensorManager = (SensorManager)getSystemService(SENSOR_SERVICE);
		Sensor accel = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		mSensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_GRAVITY), SensorManager.SENSOR_DELAY_GAME);
		mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_LIGHT), SensorManager.SENSOR_DELAY_GAME);		
	}

	private void setupWSClient(String url) {
		Log.i(TAG, "QR: WS Setup");
		wsUrl = url;
		List<BasicNameValuePair> extraHeaders = Arrays.asList();
		client = new WebSocketClient(URI.create(url), new WebSocketClient.Listener() {
			@Override
			public void onConnect() {
				Log.i(TAG, "WS Connected!");
				remoteImageAckCount = remoteImageCount = 0;
			}

			@Override
			public void onMessage(String message) {
				try {
					JSONObject o = (JSONObject) JSONValue.parse(message);

					String action = (String)o.get("action");
					Log.i(TAG, String.format("Got %s", action));
					// TODO: String to Mat, save and display in the loopback thread
					if (action.equals("setOverlay")) {
						overlay = ImageRGBAFromString((String)o.get("imageb64"));			
					} else if (action.equals("setMatchOverlay")) {
						String matchKey = (String)o.get("matchKey");
						if (matchKey == null) {
							Log.w(TAG, String.format("No match key"));
							return;
						}
						matchOverlays.put(matchKey, ImageRGBAFromString((String)o.get("imageb64")));
						Log.i(TAG, String.format("Got match overlay"));

					} else if (action.equals("resetMatch")) {
						matchOverlays = new TreeMap<String, Mat>();
					} else if (action.equals("setMatchH")) {
						matchH = HMatFromArray(HMult(borgHSmallToGlass, ParseJSONDoubleArray((JSONArray)o.get("H"))));
						String matchKey = (String)o.get("matchKey");
						if (matchKey == null) {
							Log.w(TAG, String.format("No match key"));
							return;
						}
						Log.i(TAG, String.format("Got match H"));
						Mat matchOverlay = matchOverlays.get(matchKey);
						if (matchOverlay != null) {
							if (overlay == null)
								overlay = new Mat(360, 640, CvType.CV_8UC4);
							Imgproc.warpPerspective(matchOverlay, overlay, matchH, new Size(640, 360));
							Log.i(TAG, String.format("Warped overlay"));
						} else {
							Log.i(TAG, String.format("No overlay for H"));
						}
					} else if (action.equals("say")) {
						if (!tts.isSpeaking())
							tts.speak((String)o.get("say"), TextToSpeech.QUEUE_FLUSH,
									null);
					} else if (action.equals("ping")) {
						remoteImageAckCount++;
						o.put("action", "pong");
						o.put("Tg1", new Double(System.currentTimeMillis() / 1000.));
						client.send(o.toJSONString());
					} else if (action.equals("options")) {
						parseOptions(o);
						JSONObject opts = (JSONObject)o.get("options");
						if (opts != null && !opts.containsKey("url"))
							opts.put("url", wsUrl);
						SaveData(o.toString().getBytes(), "", false, "config.js");
					}
					Log.d(TAG, String.format("WS: Got string message! %d", message.length()));
				} catch (Exception e) {
					if (raven != null)
						raven.sendException(e);
					Log.e(TAG, e.toString());
					Log.e(TAG, e.getMessage());

				}
			}

			@Override
			public void onDisconnect(int code, String reason) {
				Log.d(TAG, String.format("WS: Disconnected! Code: %d Reason: %s", code, reason));
				remoteImageAckCount = remoteImageCount = 0;
				new Thread(new Runnable() {
					public void run() {
						ReconnectClient(client);
					}
				}).start();
			}

			@Override
			public void onError(Exception error) {
				Log.e(TAG, "WS: Error!", error);
			}

			@Override
			public void onMessage(byte[] arg0) {
				// TODO Auto-generated method stub

			}

		}, extraHeaders);
		client.connect();
	}

	private boolean clientConnected() {
		if (client == null)
			return false;
		if (!client.isConnected()) {
			remoteImageAckCount = remoteImageCount = 0;
			client.connect();
		}
		return client.isConnected();
	}

	@Override
	public void onPause()
	{
		isForeground = false;
		super.onPause();
		if (view != null)
			view.disableView();
	}

	@Override
	public void onResume()
	{
		isForeground = true;
		super.onResume();
		OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_3, this, mLoaderCallback);
	}

	public void onDestroy() {
		super.onDestroy();
		if (view != null)
			view.disableView();
		if (tts != null) {
			tts.stop();
			tts.shutdown();
		}
	}

	public void onCameraViewStarted(int width, int height) {
	}

	public void onCameraViewStopped() {
	}

	public void saveDataPacket(final Mat frame) {
		saveDataThreadRunning += 1;
		final JSONArray curSensorBuffer = sensorBuffer;
		final Double Tsave = new Double(System.currentTimeMillis() / 1000.);
		sensorBuffer = new JSONArray();

		JSONObject data = new JSONObject();
		if (frame != null) {
			Log.i(TAG, "Got frame:" + frame.size().toString());
			MatOfByte jpgFrame = new MatOfByte();
			Highgui.imencode(".jpg",  frame, jpgFrame);
			final byte[] out = jpgFrame.toArray();
			data.put("imageb64", Base64.encodeToString(out, Base64.NO_WRAP));
		}
		data.put("sensors", curSensorBuffer);
		data.put("Tsave", Tsave);
		data.put("Tg0", new Double(System.currentTimeMillis() / 1000.));
		data.put("glassID", glassID);
		data.put("action", "data");
		final String dataStr = data.toJSONString();
		if (borgDataLocal) {
			SaveData(dataStr.getBytes(), "data/", true, ".js");
		}
		if (borgDataRemote) {
			if (clientConnected())
				client.send(dataStr);
		}
		// TODO: Replace with a mutex
		saveDataThreadRunning -= 1;
	}

	public Mat cameraToBGR(CvCameraViewFrame inputFrame) {
		Mat frameRGBA = inputFrame.rgba();
		final Mat frame = new Mat(frameRGBA.rows(), frameRGBA.cols(), CvType.CV_8UC3);
		Imgproc.cvtColor(frameRGBA, frame, Imgproc.COLOR_RGBA2BGR);
		return frame;
	}

	public Mat mutateFrame(Mat frame, boolean mutable) {
		Mat frameOut = frame;
		if (borgFlicker) {
			if (frame.channels() == 3) {
				if (!mutable)
					frameOut = new Mat(frame.rows(), frame.cols(), CvType.CV_8UC3);
				Core.add(frame, new Scalar(25, 0, 0), frameOut);
			} else {
				if (!mutable)
					frameOut = new Mat(frame.rows(), frame.cols(), CvType.CV_8UC4);
				Core.add(frame, new Scalar(25, 0, 0, 0), frameOut);
			}
		}
		return frameOut;
	}

	public Mat onCameraFrame(CvCameraViewFrame inputFrame) {
		boolean sendData = !borgImage || (!borgDataLocal && !borgDataRemote) || (borgDataRemote && remoteImageCount - remoteImageAckCount > 0) || System.nanoTime() - lastImageSaveTime < borgImageResolution;
		sendData = !sendData;
		Mat frame = null;
		if (sendData) {
			remoteImageCount++;
			lastSensorSaveTime = lastImageSaveTime = System.nanoTime();
			frame = cameraToBGR(inputFrame);
			saveDataPacket(frame);
		}

		if (borgWarpSensor && senhackOldValues != null && senhackNewValues != null) {
			frame = inputFrame.rgba();
			double hSensor[] = homographyFromRotations(senhackNewValues, senhackOldValues);
			double hWarp[] = HMult(hSensor, borgHSmallToGlass);
			Log.i(TAG, String.format("BRAN: Sensor %s %s -> %s -> %s", Arrays.toString(senhackOldValues), Arrays.toString(senhackNewValues), Arrays.toString(hSensor), Arrays.toString(hWarp)));
			Mat frameWarp = ImageLike(frame);
			Imgproc.warpPerspective(frame, frameWarp, HMatFromArray(hWarp), new Size(640, 360));
			return mutateFrame(frameWarp, true);
		}
		if (borgOverlay && overlay != null)
			return mutateFrame(overlay, false);
		if (borgPreviewWarp && borgHSmallToGlassMat != null) {
			frame = inputFrame.rgba();
			Mat frameWarp = ImageLike(frame);
			Imgproc.warpPerspective(frame, frameWarp, borgHSmallToGlassMat, new Size(640, 360));
			return mutateFrame(frameWarp, true);
		}
		return mutateFrame(inputFrame.rgba(), true);
	}

	public boolean sampleSensor(Integer type) {
		if (!borgDataLocal && !borgDataRemote)
			return false;
		if (!borgSensors.contains(type))	
			return false;
		Long val = lastSensorTime.get(type);
		if (val != null && System.nanoTime() - val < borgSensorResolution)
			return false;
		lastSensorTime.put(type, System.nanoTime());
		return true;
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		if (!isForeground)
			return;
		Integer type = event.sensor.getType();
		/*
		if (type == 11) {
			if (System.nanoTime() - senhackTime > 10000000000L) {
				senhackTime = System.nanoTime();
				senhackOldValues = event.values.clone();
			} else {
				senhackNewValues = event.values.clone();
			}
		}*/
		if (!sampleSensor(type))
			return;
		JSONObject sensor = new JSONObject();
		// NOTE(brandyn): Sensor timestamps are not consistent on android, they are either since system start or epoch
		// To simplify this we just output the time this is _called_, which is more relevant for our use case
		//sensor.put("timestamp", new Double(event.timestamp) / 1000000000.);
		sensor.put("timestamp", System.currentTimeMillis() / 1000.);
		sensor.put("timestampRaw", new Long(event.timestamp));
		sensor.put("accuracy", new Integer(event.accuracy));
		sensor.put("resolution", new Float(event.sensor.getResolution()));
		sensor.put("maximumRange", new Float(event.sensor.getMaximumRange()));
		sensor.put("type", new Integer(event.sensor.getType()));
		sensor.put("name", event.sensor.getName());
		JSONArray values = new JSONArray();
		for (int i = 0; i < event.values.length; i++) {
			values.add(new Float(event.values[i]));
		}
		sensor.put("values", values);
		sensorBuffer.add(sensor);
		if (System.nanoTime() - lastSensorSaveTime > borgSensorDelay && saveDataThreadRunning == 0) {
			lastSensorSaveTime = System.nanoTime();
			saveDataPacket(null);
		}
	}
	protected void SaveData(byte[] data, String path, boolean timestamp, String suffix) {
		try {
			try {
				File dir = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/borg/" + path);
				dir.mkdirs();
				File file;
				if (timestamp)
					file = new File(dir, Long.toString(System.currentTimeMillis()) + suffix);
				else
					file = new File(dir, suffix);

				FileOutputStream outputStream = new FileOutputStream(file);
				outputStream.write(data);
				outputStream.close();
			} catch (Exception e) {
				if (raven != null)
					raven.sendException(e);
				return;
			}
		} catch (Exception e) {
			if (raven != null)
				raven.sendException(e);
			Log.e(TAG, "Bad disc");
			return;
		}
		return;

	}
	protected byte[] LoadData(String path, String suffix) {
		try {
			try {
				File dir = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/borg/" + path);
				File file;
				file = new File(dir, suffix);
				FileInputStream inputStream = new FileInputStream(file);
				byte[] data = new byte[(int) file.length()];
				inputStream.read(data);
				inputStream.close();
				return data;
			} catch (Exception e) {
				if (raven != null)
					raven.sendException(e);
				return null;
			}
		} catch (Exception e) {
			if (raven != null)
				raven.sendException(e);
			Log.e(TAG, "Bad file read");
			return null;
		}

	}
	protected void ReconnectClient(WebSocketClient client) {
		if (client == null)
			return;
		while (!client.isConnected()) {
			client.connect();
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
			}
		}
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		Log.i(TAG, "QR: Got activity result");
		if (requestCode == 0) {
			if (resultCode == RESULT_OK) {
				String contents = intent.getStringExtra("SCAN_RESULT");
				String format = intent.getStringExtra("SCAN_RESULT_FORMAT");
				Log.i(TAG, "QR: " + contents + " Format: " + format);
				setupWSClient(contents);
			} else if (resultCode == RESULT_CANCELED) {
				// Reuse local config
				Log.i(TAG, "QR: Canceled, using old config");
				byte[] configData = LoadData("", "config.js");
				if (configData != null) {
					try {
						JSONObject o = (JSONObject) JSONValue.parse(new String(configData, "UTF-8"));
						if (o != null) {
							parseOptions(o);
							Log.i(TAG, "Successfully parsed options");
						}
					} catch (UnsupportedEncodingException e) {
						if (raven != null)
							raven.sendException(e);
						Log.e(TAG, "couldn't parse config");
					}
				}
			}
		}
	}

	protected double[] homographyFromRotations(float[] rotOld, float[] rotNew) {
		/* Let R0 be a base rotation, and h0 a homography,
           such that cv.WarpPerspective(src, dst, h0) renders a frame
           in the glass display. Then let R1 be a new rotation. Then
           h1 = M * R1 * R0' * invM * h0 
           is a homography that renders a frame in the new display.
		 */

		final double[] M = {
				3.200e+02,   2.968e+03,   0.000e+00,
				1.800e+02,   0.000e+00,  -2.968e+03,
				1.000e+00,   0.000e+00,   0.000e+00};
		final double[] invM = {
				0.000e+00,  -4.451e-19,   1.000e+00,
				3.369e-04,   4.798e-20,  -1.078e-01,
				-3.287e-21,  -3.369e-04,   6.064e-02};

		float[] rOldF = new float[9], rNewF = new float[9];
		SensorManager.getRotationMatrixFromVector((float[])rOldF, rotOld);
		SensorManager.getRotationMatrixFromVector((float[])rNewF, rotNew);

		double[] rOld = new double[9], rNew = new double[9];
		for (int i = 0; i < 9; i++) { rOld[i] = rOldF[i]; rNew[i] = rNewF[i]; }

		// transpose
		double tmp;
		for (int i = 0; i < 3; i++)
			for (int j = i+1; j < 3; j++) {
				tmp = rOld[i*3+j];
				rOld[i*3+j] = rOld[j*3+i]; 
				rOld[j*3+i] = tmp; 
			}

		return HMult(HMult(M, rNew), HMult(rOld, invM));
	}

	@Override
	public void onMarkerReached(AudioRecord arg0) {
		// TODO Auto-generated method stub
		Log.i(TAG, "Audio mark");
	}

	@Override
	public void onPeriodicNotification(AudioRecord arg0) {
		// TODO Auto-generated method stub
		Log.i(TAG, "Audio period");
	}
}
