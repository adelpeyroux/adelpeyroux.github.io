uniform sampler2D colorMap;

// center of lens for un-distortion (in normalized coordinates between 0 and 1)
uniform vec2 centerCoordinate;

// lens distortion parameters
uniform vec2 K; 

// texture coordinates
varying vec2 vUv;

void main() {
	// TODO
  float xu = vUv.x;
  float yu = vUv.y;

  float xuc = xu - centerCoordinate.x;
  float yuc = yu - centerCoordinate.y;
  
  float r2 = (xuc * xuc) + (yuc * yuc);
  float Kcoef = 1 + (K.x * r2) + (K.y * r2 * r2); 
  
  vec2 dUv = vec2(xu * (Kcoef), yu * (Kcoef));

  vec4 resColor;

  if (dUv.x > 0. && dUv.x < 1. &&
      dUv.y > 0. && dUv.y < 1.) {
    resColor = texture2D(colorMap, dUv);
  } else {
    resColor = vec4(0.,0.,0.,1.);
  }
  
  gl_FragColor = resColor;
}
