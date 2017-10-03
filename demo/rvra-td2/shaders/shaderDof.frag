
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

const float f = 17.0;

#define PI 3.14
#define MAX_INT 20

// TODO: distance to camera computation
float distToFrag( float z_buffer ) {
  return projectionMatrix2[3][2] / (z_buffer + projectionMatrix2[2][2]);
}

// TODO: circle of confusion computation
float computeCoC( float fragDist, float focusDist ) {  
  return pupilDiameter * abs(focusDist - fragDist) / fragDist;
}

// TODO: adaptive blur computation

//*
vec4 computeBlur( const float radius ) {
  vec4 color = texture2D(colorMap, vUv);

  float radiusInPixels = radius / pixelPitch;

  int normalizator = 1;
  for (int i = -5; i < 5; i++) {
    for (int j = -5; j < 5; j++) {
      if (float(i*i + j*j) <= radiusInPixels * radiusInPixels) {
	vec2 iUv = vUv + vec2(i, j) / textureSize;
	normalizator++;
	color.rgb += texture2D(colorMap, iUv).rgb;
      }
    }
  }
  
  color.rgb = color.rgb/ float(normalizator);
  return color;
}

//*/
void main() {

  float zNDC = 2.0 * texture2D( depthMap, vUv ).r - 1.0;

  float zView = distToFrag( zNDC );

  float newFD = 2.0 * texture2D( depthMap, vec2(.5, .5)).r - 1.0;
  newFD = distToFrag(newFD);
  
  float radius = computeCoC( zView, newFD );

  gl_FragColor = computeBlur(radius);
}
