package com.dappervision.wearscript.managers;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.GLUtils;
import android.opengl.Matrix;
import android.os.SystemClock;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import com.dappervision.wearscript.BackgroundService;
import com.dappervision.wearscript.Log;
import com.dappervision.wearscript.R;
import com.dappervision.wearscript.jsevents.OpenGLEvent;
import com.dappervision.wearscript.jsevents.OpenGLRenderEvent;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;
import java.util.concurrent.LinkedBlockingQueue;

public class OpenGLManager  extends Manager {
    public static final String OPENGL_DRAW_CALLBACK = "DRAW_CALLBACK";
    LinkedBlockingQueue<OpenGLEvent> openglCommandQueue;
    private GLSurfaceView glView;

    public OpenGLManager(BackgroundService bs){
        super(bs);
        openglCommandQueue = new LinkedBlockingQueue<OpenGLEvent>();
        glView = new GLSurfaceView(bs);
        glView.setEGLContextClientVersion(2);
        glView.setPreserveEGLContextOnPause(true);
        //glView.setRenderer(new ClearRenderer());
        glView.setRenderer(new LessonFourRenderer(bs));
        glView.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
    }

    protected void registerCallback(String type, String jsFunction) {
        super.registerCallback(type, jsFunction);
        glView.requestRender();
    }

    public GLSurfaceView getView() {
        return glView;
    }

    public void onEvent(OpenGLEvent event) {
        try {
            openglCommandQueue.put(event);
        } catch (InterruptedException e) {
            // TODO(brandyn): Handle
        }
    }

    public void onEvent(OpenGLRenderEvent event) {
        glView.requestRender();
    }

    public class ShaderHelper
    {
        private static final String TAG = "ShaderHelper";


    }

    public class LessonFourRenderer implements GLSurfaceView.Renderer
    {
        /** Used for debug logs. */
        private static final String TAG = "LessonFourRenderer";

        private final Context mActivityContext;

        /**
         * Store the model matrix. This matrix is used to move models from object space (where each model can be thought
         * of being located at the center of the universe) to world space.
         */
        private float[] mModelMatrix = new float[16];

        /**
         * Store the view matrix. This can be thought of as our camera. This matrix transforms world space to eye space;
         * it positions things relative to our eye.
         */
        private float[] mViewMatrix = new float[16];

        /** Store the projection matrix. This is used to project the scene onto a 2D viewport. */
        private float[] mProjectionMatrix = new float[16];

        /** Allocate storage for the final combined matrix. This will be passed into the shader program. */
        private float[] mMVPMatrix = new float[16];

        /**
         * Stores a copy of the model matrix specifically for the light position.
         */
        private float[] mLightModelMatrix = new float[16];

        /** Store our model data in a float buffer. */
        private final FloatBuffer mCubePositions;
        private final FloatBuffer mCubeColors;
        private final FloatBuffer mCubeNormals;
        private final FloatBuffer mCubeTextureCoordinates;

        /** This will be used to pass in the transformation matrix. */
        private int mMVPMatrixHandle;

        /** This will be used to pass in the modelview matrix. */
        private int mMVMatrixHandle;

        /** This will be used to pass in the light position. */
        private int mLightPosHandle;

        /** This will be used to pass in the texture. */
        private int mTextureUniformHandle;

        /** This will be used to pass in model position information. */
        private int mPositionHandle;

        /** This will be used to pass in model color information. */
        private int mColorHandle;

        /** This will be used to pass in model normal information. */
        private int mNormalHandle;

        /** This will be used to pass in model texture coordinate information. */
        private int mTextureCoordinateHandle;

        /** How many bytes per float. */
        private final int mBytesPerFloat = 4;

        /** Size of the position data in elements. */
        private final int mPositionDataSize = 3;

        /** Size of the color data in elements. */
        private final int mColorDataSize = 4;

        /** Size of the normal data in elements. */
        private final int mNormalDataSize = 3;

        /** Size of the texture coordinate data in elements. */
        private final int mTextureCoordinateDataSize = 2;

        /** Used to hold a light centered on the origin in model space. We need a 4th coordinate so we can get translations to work when
         *  we multiply this by our transformation matrices. */
        private final float[] mLightPosInModelSpace = new float[] {0.0f, 0.0f, 0.0f, 1.0f};

        /** Used to hold the current position of the light in world space (after transformation via model matrix). */
        private final float[] mLightPosInWorldSpace = new float[4];

        /** Used to hold the transformed position of the light in eye space (after transformation via modelview matrix) */
        private final float[] mLightPosInEyeSpace = new float[4];

        /** This is a handle to our cube shading program. */
        private int mProgramHandle;

        /** This is a handle to our light point program. */
        private int mPointProgramHandle;

        /** This is a handle to our texture data. */
        private int mTextureDataHandle;

        /**
         * Initialize the model data.
         */
        public LessonFourRenderer(final Context activityContext)
        {
            mActivityContext = activityContext;

            // Define points for a cube.

            // X, Y, Z
            final float[] cubePositionData =
                    {
                            // In OpenGL counter-clockwise winding is default. This means that when we look at a triangle,
                            // if the points are counter-clockwise we are looking at the "front". If not we are looking at
                            // the back. OpenGL has an optimization where all back-facing triangles are culled, since they
                            // usually represent the backside of an object and aren't visible anyways.

                            // Front face
                            -1.0f, 1.0f, 1.0f,
                            -1.0f, -1.0f, 1.0f,
                            1.0f, 1.0f, 1.0f,
                            -1.0f, -1.0f, 1.0f,
                            1.0f, -1.0f, 1.0f,
                            1.0f, 1.0f, 1.0f,

                            // Right face
                            1.0f, 1.0f, 1.0f,
                            1.0f, -1.0f, 1.0f,
                            1.0f, 1.0f, -1.0f,
                            1.0f, -1.0f, 1.0f,
                            1.0f, -1.0f, -1.0f,
                            1.0f, 1.0f, -1.0f,

                            // Back face
                            1.0f, 1.0f, -1.0f,
                            1.0f, -1.0f, -1.0f,
                            -1.0f, 1.0f, -1.0f,
                            1.0f, -1.0f, -1.0f,
                            -1.0f, -1.0f, -1.0f,
                            -1.0f, 1.0f, -1.0f,

                            // Left face
                            -1.0f, 1.0f, -1.0f,
                            -1.0f, -1.0f, -1.0f,
                            -1.0f, 1.0f, 1.0f,
                            -1.0f, -1.0f, -1.0f,
                            -1.0f, -1.0f, 1.0f,
                            -1.0f, 1.0f, 1.0f,

                            // Top face
                            -1.0f, 1.0f, -1.0f,
                            -1.0f, 1.0f, 1.0f,
                            1.0f, 1.0f, -1.0f,
                            -1.0f, 1.0f, 1.0f,
                            1.0f, 1.0f, 1.0f,
                            1.0f, 1.0f, -1.0f,

                            // Bottom face
                            1.0f, -1.0f, -1.0f,
                            1.0f, -1.0f, 1.0f,
                            -1.0f, -1.0f, -1.0f,
                            1.0f, -1.0f, 1.0f,
                            -1.0f, -1.0f, 1.0f,
                            -1.0f, -1.0f, -1.0f,
                    };

            // R, G, B, A
            final float[] cubeColorData =
                    {
                            // Front face (red)
                            1.0f, 0.0f, 0.0f, 1.0f,
                            1.0f, 0.0f, 0.0f, 1.0f,
                            1.0f, 0.0f, 0.0f, 1.0f,
                            1.0f, 0.0f, 0.0f, 1.0f,
                            1.0f, 0.0f, 0.0f, 1.0f,
                            1.0f, 0.0f, 0.0f, 1.0f,

                            // Right face (green)
                            0.0f, 1.0f, 0.0f, 1.0f,
                            0.0f, 1.0f, 0.0f, 1.0f,
                            0.0f, 1.0f, 0.0f, 1.0f,
                            0.0f, 1.0f, 0.0f, 1.0f,
                            0.0f, 1.0f, 0.0f, 1.0f,
                            0.0f, 1.0f, 0.0f, 1.0f,

                            // Back face (blue)
                            0.0f, 0.0f, 1.0f, 1.0f,
                            0.0f, 0.0f, 1.0f, 1.0f,
                            0.0f, 0.0f, 1.0f, 1.0f,
                            0.0f, 0.0f, 1.0f, 1.0f,
                            0.0f, 0.0f, 1.0f, 1.0f,
                            0.0f, 0.0f, 1.0f, 1.0f,

                            // Left face (yellow)
                            1.0f, 1.0f, 0.0f, 1.0f,
                            1.0f, 1.0f, 0.0f, 1.0f,
                            1.0f, 1.0f, 0.0f, 1.0f,
                            1.0f, 1.0f, 0.0f, 1.0f,
                            1.0f, 1.0f, 0.0f, 1.0f,
                            1.0f, 1.0f, 0.0f, 1.0f,

                            // Top face (cyan)
                            0.0f, 1.0f, 1.0f, 1.0f,
                            0.0f, 1.0f, 1.0f, 1.0f,
                            0.0f, 1.0f, 1.0f, 1.0f,
                            0.0f, 1.0f, 1.0f, 1.0f,
                            0.0f, 1.0f, 1.0f, 1.0f,
                            0.0f, 1.0f, 1.0f, 1.0f,

                            // Bottom face (magenta)
                            1.0f, 0.0f, 1.0f, 1.0f,
                            1.0f, 0.0f, 1.0f, 1.0f,
                            1.0f, 0.0f, 1.0f, 1.0f,
                            1.0f, 0.0f, 1.0f, 1.0f,
                            1.0f, 0.0f, 1.0f, 1.0f,
                            1.0f, 0.0f, 1.0f, 1.0f
                    };

            // X, Y, Z
            // The normal is used in light calculations and is a vector which points
            // orthogonal to the plane of the surface. For a cube model, the normals
            // should be orthogonal to the points of each face.
            final float[] cubeNormalData =
                    {
                            // Front face
                            0.0f, 0.0f, 1.0f,
                            0.0f, 0.0f, 1.0f,
                            0.0f, 0.0f, 1.0f,
                            0.0f, 0.0f, 1.0f,
                            0.0f, 0.0f, 1.0f,
                            0.0f, 0.0f, 1.0f,

                            // Right face
                            1.0f, 0.0f, 0.0f,
                            1.0f, 0.0f, 0.0f,
                            1.0f, 0.0f, 0.0f,
                            1.0f, 0.0f, 0.0f,
                            1.0f, 0.0f, 0.0f,
                            1.0f, 0.0f, 0.0f,

                            // Back face
                            0.0f, 0.0f, -1.0f,
                            0.0f, 0.0f, -1.0f,
                            0.0f, 0.0f, -1.0f,
                            0.0f, 0.0f, -1.0f,
                            0.0f, 0.0f, -1.0f,
                            0.0f, 0.0f, -1.0f,

                            // Left face
                            -1.0f, 0.0f, 0.0f,
                            -1.0f, 0.0f, 0.0f,
                            -1.0f, 0.0f, 0.0f,
                            -1.0f, 0.0f, 0.0f,
                            -1.0f, 0.0f, 0.0f,
                            -1.0f, 0.0f, 0.0f,

                            // Top face
                            0.0f, 1.0f, 0.0f,
                            0.0f, 1.0f, 0.0f,
                            0.0f, 1.0f, 0.0f,
                            0.0f, 1.0f, 0.0f,
                            0.0f, 1.0f, 0.0f,
                            0.0f, 1.0f, 0.0f,

                            // Bottom face
                            0.0f, -1.0f, 0.0f,
                            0.0f, -1.0f, 0.0f,
                            0.0f, -1.0f, 0.0f,
                            0.0f, -1.0f, 0.0f,
                            0.0f, -1.0f, 0.0f,
                            0.0f, -1.0f, 0.0f
                    };

            // S, T (or X, Y)
            // Texture coordinate data.
            // Because images have a Y axis pointing downward (values increase as you move down the image) while
            // OpenGL has a Y axis pointing upward, we adjust for that here by flipping the Y axis.
            // What's more is that the texture coordinates are the same for every face.
            final float[] cubeTextureCoordinateData =
                    {
                            // Front face
                            0.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 1.0f,
                            1.0f, 0.0f,

                            // Right face
                            0.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 1.0f,
                            1.0f, 0.0f,

                            // Back face
                            0.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 1.0f,
                            1.0f, 0.0f,

                            // Left face
                            0.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 1.0f,
                            1.0f, 0.0f,

                            // Top face
                            0.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 1.0f,
                            1.0f, 0.0f,

                            // Bottom face
                            0.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 0.0f,
                            0.0f, 1.0f,
                            1.0f, 1.0f,
                            1.0f, 0.0f
                    };

            // Initialize the buffers.
            mCubePositions = ByteBuffer.allocateDirect(cubePositionData.length * mBytesPerFloat)
                    .order(ByteOrder.nativeOrder()).asFloatBuffer();
            mCubePositions.put(cubePositionData).position(0);

            mCubeColors = ByteBuffer.allocateDirect(cubeColorData.length * mBytesPerFloat)
                    .order(ByteOrder.nativeOrder()).asFloatBuffer();
            mCubeColors.put(cubeColorData).position(0);

            mCubeNormals = ByteBuffer.allocateDirect(cubeNormalData.length * mBytesPerFloat)
                    .order(ByteOrder.nativeOrder()).asFloatBuffer();
            mCubeNormals.put(cubeNormalData).position(0);

            mCubeTextureCoordinates = ByteBuffer.allocateDirect(cubeTextureCoordinateData.length * mBytesPerFloat)
                    .order(ByteOrder.nativeOrder()).asFloatBuffer();
            mCubeTextureCoordinates.put(cubeTextureCoordinateData).position(0);
        }

        /**
         * Helper function to compile a shader.
         *
         * @param shaderType The shader type.
         * @param shaderSource The shader source code.
         * @return An OpenGL handle to the shader.
         */
        public int compileShader(final int shaderType, final String shaderSource)
        {
            int shaderHandle = GLES20.glCreateShader(shaderType);

            if (shaderHandle != 0)
            {
                // Pass in the shader source.
                GLES20.glShaderSource(shaderHandle, shaderSource);

                // Compile the shader.
                GLES20.glCompileShader(shaderHandle);

                // Get the compilation status.
                final int[] compileStatus = new int[1];
                GLES20.glGetShaderiv(shaderHandle, GLES20.GL_COMPILE_STATUS, compileStatus, 0);

                // If the compilation failed, delete the shader.
                if (compileStatus[0] == 0)
                {
                    Log.e(TAG, "Error compiling shader: " + GLES20.glGetShaderInfoLog(shaderHandle));
                    GLES20.glDeleteShader(shaderHandle);
                    shaderHandle = 0;
                }
            }

            if (shaderHandle == 0)
            {
                throw new RuntimeException("Error creating shader.");
            }

            return shaderHandle;
        }

        /**
         * Helper function to compile and link a program.
         *
         * @param vertexShaderHandle An OpenGL handle to an already-compiled vertex shader.
         * @param fragmentShaderHandle An OpenGL handle to an already-compiled fragment shader.
         * @param attributes Attributes that need to be bound to the program.
         * @return An OpenGL handle to the program.
         */
        public int createAndLinkProgram(final int vertexShaderHandle, final int fragmentShaderHandle, final String[] attributes)
        {
            int programHandle = GLES20.glCreateProgram();

            if (programHandle != 0)
            {
                // Bind the vertex shader to the program.
                GLES20.glAttachShader(programHandle, vertexShaderHandle);

                // Bind the fragment shader to the program.
                GLES20.glAttachShader(programHandle, fragmentShaderHandle);

                // Bind attributes
                if (attributes != null)
                {
                    final int size = attributes.length;
                    for (int i = 0; i < size; i++)
                    {
                        GLES20.glBindAttribLocation(programHandle, i, attributes[i]);
                    }
                }

                // Link the two shaders together into a program.
                GLES20.glLinkProgram(programHandle);

                // Get the link status.
                final int[] linkStatus = new int[1];
                GLES20.glGetProgramiv(programHandle, GLES20.GL_LINK_STATUS, linkStatus, 0);

                // If the link failed, delete the program.
                if (linkStatus[0] == 0)
                {
                    Log.e(TAG, "Error compiling program: " + GLES20.glGetProgramInfoLog(programHandle));
                    GLES20.glDeleteProgram(programHandle);
                    programHandle = 0;
                }
            }

            if (programHandle == 0)
            {
                throw new RuntimeException("Error creating program.");
            }

            return programHandle;
        }

        public int loadTexture(final Context context, final int resourceId)
        {
            final int[] textureHandle = new int[1];

            GLES20.glGenTextures(1, textureHandle, 0);

            if (textureHandle[0] != 0)
            {
                final BitmapFactory.Options options = new BitmapFactory.Options();
                options.inScaled = false;	// No pre-scaling

                // Read in the resource
                final Bitmap bitmap = BitmapFactory.decodeFile("/sdcard/1388426496239g.jpg", options);
                Log.d(TAG, String.format("Height: %d Width: %d", bitmap.getHeight(), bitmap.getWidth()));
                //final Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), resourceId, options);
                // Bind to the texture in OpenGL
                GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, textureHandle[0]);

                // Set filtering
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_NEAREST);
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_NEAREST);

                // Load the bitmap into the bound texture.
                GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bitmap, 0);

                // Recycle the bitmap, since its data has been loaded into OpenGL.
                bitmap.recycle();
            }

            if (textureHandle[0] == 0)
            {
                throw new RuntimeException("Error loading texture.");
            }

            return textureHandle[0];
        }

        protected String getVertexShader()
        {
            return readTextFileFromRawResource(R.raw.per_pixel_vertex_shader);
        }

        protected String getFragmentShader()
        {
            return readTextFileFromRawResource(R.raw.per_pixel_fragment_shader);
        }

        public String readTextFileFromRawResource(final int resourceId)
        {
            final InputStream inputStream = mActivityContext.getResources().openRawResource(
                    resourceId);
            final InputStreamReader inputStreamReader = new InputStreamReader(
                    inputStream);
            final BufferedReader bufferedReader = new BufferedReader(
                    inputStreamReader);

            String nextLine;
            final StringBuilder body = new StringBuilder();

            try
            {
                while ((nextLine = bufferedReader.readLine()) != null)
                {
                    body.append(nextLine);
                    body.append('\n');
                }
            }
            catch (IOException e)
            {
                return null;
            }
            return body.toString();
        }


            @Override
        public void onSurfaceCreated(GL10 glUnused, EGLConfig config)
        {
            // Set the background clear color to black.
            GLES20.glClearColor(0.0f, 0.0f, 0.0f, 0.0f);

            // Use culling to remove back faces.
            GLES20.glEnable(GLES20.GL_CULL_FACE);

            // Enable depth testing
            GLES20.glEnable(GLES20.GL_DEPTH_TEST);

            // The below glEnable() call is a holdover from OpenGL ES 1, and is not needed in OpenGL ES 2.
            // Enable texture mapping
            // GLES20.glEnable(GLES20.GL_TEXTURE_2D);

            // Position the eye in front of the origin.
            final float eyeX = 0.0f;
            final float eyeY = 0.0f;
            final float eyeZ = -0.5f;

            // We are looking toward the distance
            final float lookX = 0.0f;
            final float lookY = 0.0f;
            final float lookZ = -5.0f;

            // Set our up vector. This is where our head would be pointing were we holding the camera.
            final float upX = 0.0f;
            final float upY = 1.0f;
            final float upZ = 0.0f;

            // Set the view matrix. This matrix can be said to represent the camera position.
            // NOTE: In OpenGL 1, a ModelView matrix is used, which is a combination of a model and
            // view matrix. In OpenGL 2, we can keep track of these matrices separately if we choose.
            Matrix.setLookAtM(mViewMatrix, 0, eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ);

            final String vertexShader = getVertexShader();
            final String fragmentShader = getFragmentShader();

            final int vertexShaderHandle = compileShader(GLES20.GL_VERTEX_SHADER, vertexShader);
            final int fragmentShaderHandle = compileShader(GLES20.GL_FRAGMENT_SHADER, fragmentShader);

            mProgramHandle = createAndLinkProgram(vertexShaderHandle, fragmentShaderHandle,
                    new String[]{"a_Position", "a_Color", "a_Normal", "a_TexCoordinate"});

            // Define a simple shader program for our point.
            final String pointVertexShader = readTextFileFromRawResource(R.raw.point_vertex_shader);
            final String pointFragmentShader = readTextFileFromRawResource(R.raw.point_fragment_shader);

            final int pointVertexShaderHandle = compileShader(GLES20.GL_VERTEX_SHADER, pointVertexShader);
            final int pointFragmentShaderHandle = compileShader(GLES20.GL_FRAGMENT_SHADER, pointFragmentShader);
            mPointProgramHandle = createAndLinkProgram(pointVertexShaderHandle, pointFragmentShaderHandle,
                    new String[]{"a_Position"});

            // Load the texture
            mTextureDataHandle = loadTexture(mActivityContext, R.drawable.bumpy_bricks_public_domain);
        }

        @Override
        public void onSurfaceChanged(GL10 glUnused, int width, int height)
        {
            // Set the OpenGL viewport to the same size as the surface.
            GLES20.glViewport(0, 0, width, height);

            // Create a new perspective projection matrix. The height will stay the same
            // while the width will vary as per aspect ratio.
            final float ratio = (float) width / height;
            final float left = -ratio;
            final float right = ratio;
            final float bottom = -1.0f;
            final float top = 1.0f;
            final float near = 1.0f;
            final float far = 10.0f;

            Matrix.frustumM(mProjectionMatrix, 0, left, right, bottom, top, near, far);
        }

        @Override
        public void onDrawFrame(GL10 glUnused)
        {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);

            // Do a complete rotation every 10 seconds.
            long time = SystemClock.uptimeMillis() % 10000L;
            float angleInDegrees = (360.0f / 10000.0f) * ((int) time);

            // Set our per-vertex lighting program.
            GLES20.glUseProgram(mProgramHandle);

            // Set program handles for cube drawing.
            mMVPMatrixHandle = GLES20.glGetUniformLocation(mProgramHandle, "u_MVPMatrix");
            mMVMatrixHandle = GLES20.glGetUniformLocation(mProgramHandle, "u_MVMatrix");
            mLightPosHandle = GLES20.glGetUniformLocation(mProgramHandle, "u_LightPos");
            mTextureUniformHandle = GLES20.glGetUniformLocation(mProgramHandle, "u_Texture");
            mPositionHandle = GLES20.glGetAttribLocation(mProgramHandle, "a_Position");
            mColorHandle = GLES20.glGetAttribLocation(mProgramHandle, "a_Color");
            mNormalHandle = GLES20.glGetAttribLocation(mProgramHandle, "a_Normal");
            mTextureCoordinateHandle = GLES20.glGetAttribLocation(mProgramHandle, "a_TexCoordinate");

            // Set the active texture unit to texture unit 0.
            GLES20.glActiveTexture(GLES20.GL_TEXTURE0);

            // Bind the texture to this unit.
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, mTextureDataHandle);

            // Tell the texture uniform sampler to use this texture in the shader by binding to texture unit 0.
            GLES20.glUniform1i(mTextureUniformHandle, 0);

            // Calculate position of the light. Rotate and then push into the distance.
            Matrix.setIdentityM(mLightModelMatrix, 0);
            Matrix.translateM(mLightModelMatrix, 0, 0.0f, 0.0f, -5.0f);
            Matrix.rotateM(mLightModelMatrix, 0, angleInDegrees, 0.0f, 1.0f, 0.0f);
            Matrix.translateM(mLightModelMatrix, 0, 0.0f, 0.0f, 2.0f);

            Matrix.multiplyMV(mLightPosInWorldSpace, 0, mLightModelMatrix, 0, mLightPosInModelSpace, 0);
            Matrix.multiplyMV(mLightPosInEyeSpace, 0, mViewMatrix, 0, mLightPosInWorldSpace, 0);

            // Draw some cubes.
            Matrix.setIdentityM(mModelMatrix, 0);
            Matrix.translateM(mModelMatrix, 0, 4.0f, 0.0f, -7.0f);
            Matrix.rotateM(mModelMatrix, 0, angleInDegrees, 1.0f, 0.0f, 0.0f);
            drawCube();

            Matrix.setIdentityM(mModelMatrix, 0);
            Matrix.translateM(mModelMatrix, 0, -4.0f, 0.0f, -7.0f);
            Matrix.rotateM(mModelMatrix, 0, angleInDegrees, 0.0f, 1.0f, 0.0f);
            drawCube();

            Matrix.setIdentityM(mModelMatrix, 0);
            Matrix.translateM(mModelMatrix, 0, 0.0f, 4.0f, -7.0f);
            Matrix.rotateM(mModelMatrix, 0, angleInDegrees, 0.0f, 0.0f, 1.0f);
            drawCube();

            Matrix.setIdentityM(mModelMatrix, 0);
            Matrix.translateM(mModelMatrix, 0, 0.0f, -4.0f, -7.0f);
            drawCube();

            Matrix.setIdentityM(mModelMatrix, 0);
            Matrix.translateM(mModelMatrix, 0, 0.0f, 0.0f, -5.0f);
            Matrix.rotateM(mModelMatrix, 0, angleInDegrees, 1.0f, 1.0f, 0.0f);
            drawCube();

            // Draw a point to indicate the light.
            GLES20.glUseProgram(mPointProgramHandle);
            drawLight();
        }

        /**
         * Draws a cube.
         */
        private void drawCube()
        {
            // Pass in the position information
            mCubePositions.position(0);
            GLES20.glVertexAttribPointer(mPositionHandle, mPositionDataSize, GLES20.GL_FLOAT, false,
                    0, mCubePositions);

            GLES20.glEnableVertexAttribArray(mPositionHandle);

            // Pass in the color information
            mCubeColors.position(0);
            GLES20.glVertexAttribPointer(mColorHandle, mColorDataSize, GLES20.GL_FLOAT, false,
                    0, mCubeColors);

            GLES20.glEnableVertexAttribArray(mColorHandle);

            // Pass in the normal information
            mCubeNormals.position(0);
            GLES20.glVertexAttribPointer(mNormalHandle, mNormalDataSize, GLES20.GL_FLOAT, false,
                    0, mCubeNormals);

            GLES20.glEnableVertexAttribArray(mNormalHandle);

            // Pass in the texture coordinate information
            mCubeTextureCoordinates.position(0);
            GLES20.glVertexAttribPointer(mTextureCoordinateHandle, mTextureCoordinateDataSize, GLES20.GL_FLOAT, false,
                    0, mCubeTextureCoordinates);

            GLES20.glEnableVertexAttribArray(mTextureCoordinateHandle);

            // This multiplies the view matrix by the model matrix, and stores the result in the MVP matrix
            // (which currently contains model * view).
            Matrix.multiplyMM(mMVPMatrix, 0, mViewMatrix, 0, mModelMatrix, 0);

            // Pass in the modelview matrix.
            GLES20.glUniformMatrix4fv(mMVMatrixHandle, 1, false, mMVPMatrix, 0);

            // This multiplies the modelview matrix by the projection matrix, and stores the result in the MVP matrix
            // (which now contains model * view * projection).
            Matrix.multiplyMM(mMVPMatrix, 0, mProjectionMatrix, 0, mMVPMatrix, 0);

            // Pass in the combined matrix.
            GLES20.glUniformMatrix4fv(mMVPMatrixHandle, 1, false, mMVPMatrix, 0);

            // Pass in the light position in eye space.
            GLES20.glUniform3f(mLightPosHandle, mLightPosInEyeSpace[0], mLightPosInEyeSpace[1], mLightPosInEyeSpace[2]);

            // Draw the cube.
            GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, 36);
        }

        /**
         * Draws a point representing the position of the light.
         */
        private void drawLight()
        {
            final int pointMVPMatrixHandle = GLES20.glGetUniformLocation(mPointProgramHandle, "u_MVPMatrix");
            final int pointPositionHandle = GLES20.glGetAttribLocation(mPointProgramHandle, "a_Position");

            // Pass in the position.
            GLES20.glVertexAttrib3f(pointPositionHandle, mLightPosInModelSpace[0], mLightPosInModelSpace[1], mLightPosInModelSpace[2]);

            // Since we are not using a buffer object, disable vertex arrays for this attribute.
            GLES20.glDisableVertexAttribArray(pointPositionHandle);

            // Pass in the transformation matrix.
            Matrix.multiplyMM(mMVPMatrix, 0, mViewMatrix, 0, mLightModelMatrix, 0);
            Matrix.multiplyMM(mMVPMatrix, 0, mProjectionMatrix, 0, mMVPMatrix, 0);
            GLES20.glUniformMatrix4fv(pointMVPMatrixHandle, 1, false, mMVPMatrix, 0);

            // Draw the point.
            GLES20.glDrawArrays(GLES20.GL_POINTS, 0, 1);
        }
    }

        class ClearRenderer implements GLSurfaceView.Renderer {
        public void onSurfaceCreated(GL10 gl, EGLConfig config) {
            // Do nothing special.
            Log.d(TAG, "OpenGL onSurfaceCreated");
        }

        public void onSurfaceChanged(GL10 gl, int w, int h) {
            GLES20.glViewport(0, 0, w, h);
        }

        public void onDrawFrame(GL10 gl) {
            Log.d(TAG, "OpenGL onDrawFrame");
            if (jsCallbacks.containsKey(OPENGL_DRAW_CALLBACK))
                makeCall(OPENGL_DRAW_CALLBACK, "");
            OpenGLEvent statement;
            while (true) {
                try {
                    statement = (OpenGLEvent)openglCommandQueue.take();
                } catch (InterruptedException e) {
                    // TODO(brandyn): Handle
                    break;
                }
                if (statement.isDone()) {
                    Log.d(TAG, "OpenGL Done");
                    break;
                }
                statement.execute();
            }
        }
    }
}
