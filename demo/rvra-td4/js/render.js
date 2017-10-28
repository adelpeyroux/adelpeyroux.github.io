var camera, controls, scene, renderer;

var stereoRenderer;

var cameraOrtho, sceneOrtho;

var guiObj = { K1: 0.1, K2: 0.1 };

var clock;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var pointerLocked = false;

var velocity = new THREE.Vector3(0,0,0);

function init() {

  clock = new THREE.Clock();

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // camera

  var fov = THREE.Math.radToDeg(Math.atan( displayParameters.screenSize().y/ displayParameters.distanceScreenViewer()));
  camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 100000 );

  cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10 );
  cameraOrtho.position.z = 10;

  // scene

  scene = new THREE.Scene();

  var geometry = new THREE.BoxGeometry( 100, 100, 100 );

  var tnt1 = new THREE.TextureLoader().load( 'textures/tnt1.png' );
  var tnt2 = new THREE.TextureLoader().load( 'textures/tnt2.png' );
  var sand = new THREE.TextureLoader().load( 'textures/sand.png' );
  var stonebrick = new THREE.TextureLoader().load( 'textures/stonebrick.png' );
  var stonebrick_mossy = new THREE.TextureLoader().load( 'textures/stonebrick_mossy.png' );

  var mat_tnt1 = new THREE.MeshBasicMaterial( { map: tnt1 } );
  var mat_tnt2 = new THREE.MeshBasicMaterial( { map: tnt2 } );
  var mat_sand = new THREE.MeshBasicMaterial( { map: sand } );
  var mat_stonebrick = new THREE.MeshBasicMaterial( { map: stonebrick } );
  var mat_stonebrick_mossy = new THREE.MeshBasicMaterial( { map: stonebrick_mossy } );

  var cube_tnt = new THREE.Mesh( geometry, [mat_tnt1, mat_tnt1, mat_tnt2, mat_tnt2, mat_tnt1, mat_tnt1] );
  cube_tnt.position.y = 100;
  cube_tnt.position.z = - displayParameters.distanceScreenViewer();
  var cube_sand = new THREE.Mesh( geometry, mat_sand );
  cube_sand.position.y = -100;
  var cube_stonebrick = new THREE.Mesh( geometry, mat_stonebrick );
  var cube_stonebrick_mossy = new THREE.Mesh( geometry, mat_stonebrick_mossy );

  var color = new THREE.Color();
  for (var j = -10; j < 10; j++) {
    for (var k = -10; k < 10; k++) {
      var cs = cube_sand.clone();
      var geom = new THREE.BoxGeometry( 100, 100, 100 );
      applyFaceColor( geom , cs.id );
      cs.geometry = geom;
      cs.position.x = j*100;
      cs.position.z = k*100 - displayParameters.distanceScreenViewer();
      scene.add( cs );

      var cm;
      if(Math.random() > 0.25) {
        cm = cube_stonebrick.clone();
      } else {
        cm = cube_stonebrick_mossy.clone();
      }
      var geom = new THREE.BoxGeometry( 100, 100, 100 );
      applyFaceColor( geom , cm.id );
      cm.geometry = geom;
      cm.position.x = j*100;
      cm.position.z = k*100 - displayParameters.distanceScreenViewer();
      scene.add( cm );
    }
  }

  applyFaceColor( cube_tnt.geometry , cube_tnt.id );
  scene.add( cube_tnt );

  // aim
  sceneOrtho = new THREE.Scene();
  var line_material = new THREE.LineBasicMaterial({ color: 0xffffff });
  var line_geometry = new THREE.Geometry();
  line_geometry.vertices.push(new THREE.Vector3(-20, 0, 1));
  line_geometry.vertices.push(new THREE.Vector3(20, 0, 1));
  var line = new THREE.Line(line_geometry, line_material);
  sceneOrtho.add(line);
  line_geometry = new THREE.Geometry();
  line_geometry.vertices.push(new THREE.Vector3(0, -20, 1));
  line_geometry.vertices.push(new THREE.Vector3(0, 20, 1));
  var line = new THREE.Line(line_geometry, line_material);
  sceneOrtho.add(line);

  // renderers
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  renderer.autoClear = false;

  stereoRenderer = new StereoRenderer( renderer );

  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  pickingTexture.texture.minFilter = THREE.LinearFilter;

  // Camera controler
  controls = new THREE.PointerLockControls( camera, renderer.domElement );
  scene.add( controls.getObject() );
  controls.enabled = true;

  var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

    }

  };

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  // GUI

  var gui = new dat.GUI();
  var controller = gui.add( guiObj, 'K1' );
  controller.onChange(function(value) { 
    stereoRenderer.setK1(value); 
  } );
  controller = gui.add( guiObj, 'K2' );
  controller.onChange(function(value) { 
    stereoRenderer.setK2(value); 
  } );

  // stats

  stats = new Stats();
  container.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize, false );

  window.addEventListener( 'mousedown', pick, false );

}

function applyFaceColor( geom, color ) {
  geom.faces.forEach( function( f ) {
    f.color.setHex(color);
  } );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  cameraOrtho.left = - window.innerWidth / 2;
  cameraOrtho.right = window.innerWidth / 2;
  cameraOrtho.top = window.innerHeight / 2;
  cameraOrtho.bottom = - window.innerHeight / 2;
  cameraOrtho.updateProjectionMatrix();

  stereoRenderer.setSize( window.innerWidth, window.innerHeight );

  render();
}

function animate() {

  requestAnimationFrame( animate );

  render();
}

function pick(event) {

  scene.overrideMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

  renderer.render( scene, camera, pickingTexture );

  //create buffer for reading single pixel
  var pixelBuffer = new Uint8Array( 4 );

  //read the pixel at the center from the texture
  if(pointerLocked)
    renderer.readRenderTargetPixels(pickingTexture, pickingTexture.width/2, pickingTexture.height/2, 1, 1, pixelBuffer);
  else
    renderer.readRenderTargetPixels(pickingTexture, event.clientX, pickingTexture.height - event.clientY, 1, 1, pixelBuffer);

  //interpret the pixel as an ID

  var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );

  var obj = scene.getObjectById(id);
  if(event.button === 2) {
    scene.remove(obj);
  } else if (event.button === 1) {
    var c = obj.clone();
    var geom = new THREE.BoxGeometry( 100, 100, 100 );
    applyFaceColor( geom , c.id );
    c.geometry = geom;
    c.position.y = obj.position.y + 100;
    scene.add( c );
  }

  scene.overrideMaterial = null;
}

function render() {

  var delta = clock.getDelta();

  velocity.x -= velocity.x * 100.0 * delta;
  velocity.z -= velocity.z * 100.0 * delta;

  if ( moveForward ) velocity.z -= 15000.0 * delta;
  if ( moveBackward ) velocity.z += 15000.0 * delta;

  if ( moveLeft ) velocity.x -= 15000.0 * delta;
  if ( moveRight ) velocity.x += 15000.0 * delta;

  controls.getObject().translateX( velocity.x * delta );
  controls.getObject().translateZ( velocity.z * delta );

  renderer.clear();

  stereoRenderer.render( scene, camera );

  if(pointerLocked) {
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
  }

  stats.update();

}
