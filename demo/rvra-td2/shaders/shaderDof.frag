uniform mat4 projectionMatrix2;
uniform mat4 inverseProjectionMatrix;

uniform float focusDistance;
uniform float pupilDiameter;
uniform float pixelPitch;

uniform vec2 gazePos;

uniform sampler2D colorMap;
uniform sampler2D depthMap;
uniform vec2 textureSize;

varying vec2 vUv;

// TODO: distance to camera computation
float distToFrag( float z_buffer ) {

}

// TODO: circle of confusion computation
float computeCoC( float fragDist, float focusDist ) {

}

// TODO: adaptive blur computation
vec4 computeBlur( float radius ) {

}

void main() {
	gl_FragColor = texture2D( colorMap, vUv );
}
