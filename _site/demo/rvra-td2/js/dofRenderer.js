function DoFRenderer ( renderer ) {

  // Texture parameters for the offscreen buffer
  var _params = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    depthBuffer: true,
    stencilBuffer: false
   };

  // Check if depth texture is supported
  var gl = renderer.domElement.getContext( 'webgl' );
  var ext = gl.getExtension('WEBGL_depth_texture');
  if (!ext) {
    alert("WEBGL_depth_texture extension does not exist");
  }

  // create offscreen buffer
  this.renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight , _params );
	this.renderTarget.depthTexture = new THREE.DepthTexture();
	this.renderTarget.depthTexture.type = THREE.UnsignedShortType;

  // Create camera & scene for the 2nd screen-space pass
  this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
  this.scene = new THREE.Scene();
  var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ) );
	this.scene.add( quad );

  // Uniforms parameters of the GLSL shader
  var uniforms = {
    "colorMap": { value: this.renderTarget.texture },
    "depthMap": { value: this.renderTarget.depthTexture },
    "textureSize": { value: new THREE.Vector2(this.renderTarget.width, this.renderTarget.height) },
    "inverseProjectionMatrix": { value: new THREE.Matrix4() },
    "projectionMatrix2": { value: new THREE.Matrix4() },
    "focusDistance": { value: 500 },
    "pupilDiameter": { value: 4 },
    "pixelPitch": { value: displayParameters.pixelPitch() }
  };

  // Load GLSL shaders and assign them to the quad as material
  shaderLoader( 'shaders/shaderDof.vert', 'shaders/shaderDof.frag', function (vertex_text, fragment_text) {
      quad.material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: [ vertex_text ].join( "\n" ),
        fragmentShader: [ fragment_text ].join( "\n" )
        }
      );
    }
  );

  // Update offscreen buffer size when the viewport size changes
  this.setSize = function ( width, height ) {
    var pixelRatio = renderer.getPixelRatio();
    this.renderTarget.setSize( width * pixelRatio, height * pixelRatio );
    uniforms.textureSize.value.x = this.renderTarget.width;
    uniforms.textureSize.value.y = this.renderTarget.height;
  }

  // GUI callback functions
  this.setFocusDistance = function ( dist ) {
    uniforms.focusDistance.value = dist;
  }

  this.setPupilDiameter = function ( diameter ) {
    uniforms.pupilDiameter.value = diameter;
  }

  // Main rendering loop
  this.render = function ( scene, camera ) {

    // 1st pass: render the scene with the standard camera into the offscreen buffer
    renderer.clearTarget( this.renderTarget, true, true, false);
    renderer.render( scene, camera,  this.renderTarget);

    // Update the shader uniforms matrices
    uniforms.projectionMatrix2.value = camera.projectionMatrix;
    uniforms.inverseProjectionMatrix.value.getInverse( camera.projectionMatrix );

    // 2nd pass: compute adaptive screen-space blur
    renderer.render( this.scene, this.camera );
  }

  // Delete offscreen buffer on dispose
  this.dispose = function() {
		if ( this.renderTarget ) this.renderTarget.dispose();
	};
}
