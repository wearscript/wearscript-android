package us.openglass;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.util.Collections;

import org.java_websocket.WebSocket;
import org.java_websocket.drafts.Draft;
import org.java_websocket.framing.FrameBuilder;
import org.java_websocket.framing.Framedata;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import android.util.Log;

public class WSServer extends WebSocketServer {
	private static int counter = 0;
	private static String TAG = "WSServer";
	public WSServer( int port , Draft d ) throws UnknownHostException {
		super( new InetSocketAddress( port ), Collections.singletonList( d ) );
		Log.i(TAG, "started");
	}

	public WSServer( InetSocketAddress address, Draft d ) {
		super( address, Collections.singletonList( d ) );
		Log.i(TAG, "started");
	}

	@Override
	public void onOpen( WebSocket conn, ClientHandshake handshake ) {
		counter++;
		Log.i(TAG, "opened");
	}

	@Override
	public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
		Log.i(TAG, "closed");
	}

	@Override
	public void onError( WebSocket conn, Exception ex ) {
		System.out.println( "Error:" );
		Log.e(TAG, "error: " + ex.getMessage());
	}

	@Override
	public void onMessage( WebSocket conn, String message ) {
		conn.send( message );
	}

	@Override
	public void onMessage( WebSocket conn, ByteBuffer blob ) {
		conn.send( blob );
	}

	//@Override
	public void onWebsocketMessageFragment( WebSocket conn, Framedata frame ) {
		FrameBuilder builder = (FrameBuilder) frame;
		builder.setTransferemasked( false );
		conn.sendFrame( frame );
	}
}
