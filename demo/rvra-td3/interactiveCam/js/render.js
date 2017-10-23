var camera, controls, scene, renderer;
var imageData;

var anaglyphRenderer, dofRenderer;

var container, stats, menu;

var cameraOrtho, sceneOrtho;

var clock;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var pointerLocked = false;

var velocity = new THREE.Vector3(0,0,0);

var near = 1;
var far = 100000;

var focal = 536.71872; // in pixels
var halfHeight = 239.5; // in pixels
var halfWidth = 319.5; // in pixels
var realRadius = 90; // in minimeters

var pa = VECTOR3.create(-135,-192,0);
var pb = VECTOR3.create(173,-192,0);
var pc = VECTOR3.create(-135,-17,0);


var Menu = function() {
  this.trackMe = false;
  this.color = { h: 203, s: 0.9, v: 0.3 }; // Hue, saturation, value
  this.tolerance = 25.0;
  this.minSV = 0.3;
  this.maxSV = .8;
  this.requestPointerLock = function() {document.body.requestPointerLock();};
};


var RENDERING_MODE = {
  NORMAL: 0,
  ANAGLYPH : 1,
  ANA_RIGHT : 3,
  ANA_LEFT : 2,
  BLUR : 4,
  ANA_BLUR : 5
};

var renderingMethod = RENDERING_MODE.NORMAL;

function init() {

  clock = new THREE.Clock();

  menu = new Menu();

  
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // camera

  var fov = THREE.Math.radToDeg(Math.atan( displayParameters.screenSize().y/ displayParameters.distanceScreenViewer));
  camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far );

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
  cube_tnt.position.z = - displayParameters.distanceScreenViewer;
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
      cs.position.z = k*100 - displayParameters.distanceScreenViewer;
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
      cm.position.z = k*100 - displayParameters.distanceScreenViewer;
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

  anaglyphRenderer = new AnaglyphRenderer( renderer );
  dofRenderer = new DoFRenderer( renderer );

  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  pickingTexture.texture.minFilter = THREE.LinearFilter;

  // trackball

  // controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls = new THREE.PointerLockControls( camera, renderer.domElement );
  scene.add( controls.getObject() );
  controls.enabled = true;

  //
  let gui = new dat.GUI();
  gui.add(menu, 'trackMe');
  gui.addColor(menu, 'color').listen();
  gui.add(menu, 'tolerance', 0, 100);
  gui.add(menu, 'minSV', 0, 1).step(0.05);
  gui.add(menu, 'maxSV', 0, 1).step(0.05);
  gui.add(menu, "requestPointerLock");

  var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {
    case 82 : // r, to switch rendering methods
      renderingMethod = (renderingMethod + 1) % Object.keys(RENDERING_MODE).length ;
      break;
    case 38: // up
    case 87: // w
      moveForward = true;
      break;

    case 37: // left
    case 65: // a
      moveLeft = true;
      break;

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

  dofRenderer.setSize( window.innerWidth, window.innerHeight );

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
 
  let pe = VECTOR3.create(0, 0, displayParameters.distanceScreenViewer);
  
  if (menu.trackMe && video && video.readyState === video.HAVE_ENOUGH_DATA){

    let canvas2d = document.createElement("canvas");
    canvas2d.style.width = "320px";
    canvas2d.style.height = "240px";
    
    canvas2d.width = parseInt(canvas2d.style.width);
    canvas2d.height = parseInt(canvas2d.style.height);
    let context = canvas2d.getContext('2d');
    
    context.drawImage(video, 0, 0, canvas2d.width, canvas2d.height);
    
    let camParams = {focal: focal, halfHeight: halfHeight, halfWidth: halfWidth};
    let params = {width: canvas2d.width, height: canvas2d.height,
		  hTarget: menu.color.h, tolerance: menu.tolerance,
		  minSV: menu.minSV, maxSV: menu.maxSV};
    
    let imageDst = new ImageData( params.width, params.height);
    imageData = context.getImageData(0, 0, params.width, params.height);
    
    let circle = {center:{x:0, y:0}, radius: 0};
    
    pe = getMarkerPos(imageData, imageDst, realRadius, camParams, params, circle);

    
    let va = VECTOR3.substract(pa, pe);
    let vb = VECTOR3.substract(pb, pe);
    let vc = VECTOR3.substract(pc, pe);

    let vr = VECTOR3.normalized(VECTOR3.substract(pb, pa));
    let vu = VECTOR3.normalized(VECTOR3.substract(pc, pa));
    let vn = VECTOR3.cross(vr, vu);
    
    let d = - VECTOR3.dot(vn, va);
    
    let l = VECTOR3.dot(vr, va) * near / d;
    let r = VECTOR3.dot(vr, vb) * near / d;
    let b = VECTOR3.dot(vu, va) * near / d;
    let t = VECTOR3.dot(vu, vc) * near / d;

    //*
    let new_proj_matrix = new THREE.Matrix4()
	.makePerspective(l,r,t,b,near, 10000);

    let M = new THREE.Matrix4().set(vr.x, vr.y, vr.z, 0,
				    vu.x, vu.y, vu.z, 0,
				    vn.x, vn.y, vn.z, 0,
				    0,    0,    0,    1);

    new_proj_matrix.multiplyMatrices(new_proj_matrix, M);
    new_proj_matrix.multiplyMatrices(new_proj_matrix, new THREE.Matrix4().makeTranslation(-pe.x, -pe.y, -pe.z));

    camera.projectionMatrix = new_proj_matrix;
  }

  /*/
  camera.left = l;
  camera.right = r;
  camera.top = t;
  camera.bottom = b;
  camera.updateProjectionMatrix();
  //*/
  //camera.position = pe;
  
  
  velocity.x -= velocity.x * 100.0 * delta / 10;
  velocity.z -= velocity.z * 100.0 * delta / 10;

  if ( moveForward ) velocity.z -= 15000.0 * delta / 10;
  if ( moveBackward ) velocity.z += 15000.0 * delta / 10;

  if ( moveLeft ) velocity.x -= 15000.0 * delta / 10;
  if ( moveRight ) velocity.x += 15000.0 * delta / 10;

  controls.getObject().translateX( velocity.x * delta);
  controls.getObject().translateZ( velocity.z * delta);

  renderer.clear();

  let glContext = renderer.domElement.getContext( 'webgl' );
  glContext.colorMask(true, true, true, true);
  
  switch (renderingMethod) {
  case RENDERING_MODE.NORMAL :
    renderer.render(scene, camera);
    break;
  case RENDERING_MODE.ANAGLYPH :
    anaglyphRenderer.render(scene, camera);
    break;
  case RENDERING_MODE.ANA_LEFT :
    anaglyphRenderer.renderLeft(scene, camera);
    break;
  case RENDERING_MODE.ANA_RIGHT :
    anaglyphRenderer.renderRight(scene, camera);
    break;
  case RENDERING_MODE.BLUR :
    dofRenderer.render(scene, camera);
    break;
  case RENDERING_MODE.ANA_BLUR :
    anaglyphRenderer.renderBlur(scene, camera);
    break;
  }
  
  if(pointerLocked) {
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
  }

  stats.update();

}
