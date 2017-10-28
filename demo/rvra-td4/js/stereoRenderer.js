function StereoRenderer ( renderer ) {

  // left and right cameras
  this.cameraLeft  = new THREE.Camera();
  this.cameraLeft.matrixAutoUpdate = false;
  this.cameraRight = new THREE.Camera();
  this.cameraRight.matrixAutoUpdate = false;

  // Texture parameters for the offscreen buffer
  var _params = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    depthBuffer: true,
    stencilBuffer: false
   };

  // create offscreen buffer
  this.renderTargetLeft  = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight , _params );
  this.renderTargetRight = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight , _params );

  // Create camera & scene for the 2nd screen-space pass
  this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
  this.scene = new THREE.Scene();
  var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ) );
  this.scene.add( quad );

  var uniforms = {
    "colorMap": { value: this.renderTargetLeft.texture },
    "centerCoordinate": { value: new THREE.Vector2(0.5,0.5) },
    "K": { value: new THREE.Vector2(guiObj.K1, guiObj.K2) }
  };

  // Load GLSL shaders and assign them to the quad as material
  shaderLoader( 'shaders/shaderUnwarp.vert', 'shaders/shaderUnwarp.frag', function (vertex_text, fragment_text) {
      quad.material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: [ vertex_text ].join( "\n" ),
        fragmentShader: [ fragment_text ].join( "\n" )
        }
      );
    }
  );

  this.setK1 = function ( value ) {
    uniforms.K.value.x = value;
  }

  this.setK2 = function ( value ) {
    uniforms.K.value.y = value;
  }

  this.setSize = function ( width, height) {
    if ( this.renderTargetRight ) this.renderTargetRight.dispose();
    if ( this.renderTargetLeft ) this.renderTargetLeft.dispose();
    this.renderTargetLeft  = new THREE.WebGLRenderTarget( width, height , _params );
    this.renderTargetRight = new THREE.WebGLRenderTarget( width, height , _params );
  }

  this.update = function ( camera ) {

    // TODO

    this.cameraLeft = camera;
    this.cameraRight = camera;
  }

  this.render = function ( scene, camera ) {

    scene.updateMatrixWorld();

    camera.updateMatrixWorld();

    this.update( camera );

    // Left eye
    renderer.clearTarget( this.renderTargetLeft, true, true, false);
    renderer.render( scene, this.cameraLeft, this.renderTargetLeft);

    uniforms.colorMap.value = this.renderTargetLeft.texture;
    uniforms.centerCoordinate.value.x = 0.5; // TODO
    renderer.render( this.scene, this.camera );

    // Right eye
    renderer.clearTarget( this.renderTargetRight, true, true, false);
    renderer.render( scene, this.cameraRight, this.renderTargetRight);

    uniforms.colorMap.value = this.renderTargetRight.texture;
    uniforms.centerCoordinate.value.x = 0.5; // TODO
    renderer.render( this.scene, this.camera );
  }
 

  // Delete offscreen buffer on dispose
  this.dispose = function() {
        if ( this.renderTargetRight ) this.renderTargetRight.dispose();
        if ( this.renderTargetLeft ) this.renderTargetLeft.dispose();
    };

}
