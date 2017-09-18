var container, stats;
var scene;
var camera;

var hudScene;
var hudCamera;

var controls;

var renderer;

var colorPickingBuffer;

var textureLoader;
var textures = {};

var stoneBuilder = new CubeGenerator();
var mossBuilder = new CubeGenerator();
var sandBuilder = new CubeGenerator();
var tntBuilder = new CubeGenerator();

var clock;

var mvt = [ false, false, false, false ]; // devant, gauche, arriere, droite

function createPlane(builder, planeLength = 1, planeHeigth = 1) {
  let group = new THREE.Group();

  if (builder && builder.constructor.name == "CubeGenerator") {
    let starting = - Math.floor(planeLength / 2);
    let ending = Math.ceil(planeLength / 2);
    
    for (x = starting; x < ending; ++x) {
      for (z = starting; z < ending; ++z) {
	let cube = builder.getOne();
	cube.position.set(x, planeHeigth, z);
	
	group.add(cube);
      }
    }
  }

  return group;
}

function initEventListeners () {
  document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
    case 90 : // z
      mvt[0] = true;
      break;
    case 83: // s
      mvt[2] = true;
      break;
    case 81: // q
      mvt[1] = true;
      break;
    case 68 : // d
      mvt[3] = true;
      break;
    }
  });

  document.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
    case 90 : // z
      mvt[0] = false;
      break;
    case 83: // s
      mvt[2] = false;
      break;
    case 81: // q
      mvt[1] = false;
      break;
    case 68 : // d
      mvt[3] = false;
      break;
    }
  });

  document.addEventListener('click', function(event) {
    let buttonPressed = event.button;

    if (buttonPressed == 0) return;

    let x = event.clientX;
    let y = event.clientY;

    let pixelBuffer = new Uint8Array (4);

    scene.overrideMaterial = new THREE.MeshBasicMaterial( { vertexColors : THREE.FaceColors});
    renderer.render(scene, camera, colorPickingBuffer);
    
    scene.overrideMaterial = null;
    
    renderer.readRenderTargetPixels(colorPickingBuffer, window.innerWidth / 2, window.innerHeight / 2, 1, 1, pixelBuffer);

    let id = ( pixelBuffer[0] * 256 * 256 ) | ( pixelBuffer[1] * 256 ) | ( pixelBuffer[2] );

    let object = scene.getObjectById( id );

    if (!object) return;
    
    switch (buttonPressed) {
    case 1 : // middle mouse button
      let duplicator = new CubeGenerator(object);
      let new_object = duplicator.getOne();
      new_object.position.y += 1;
      scene.add(new_object);
      break;
    case 2 : // right mouse button
      object.parent.remove(object);
      break;
    }
  });
}

function createHUDLines() {
  var material = new THREE.LineBasicMaterial({color : 0xf0f0f0, linewidth : 2});
  var lines = new THREE.Group();
  
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
  geometry.vertices.push(new THREE.Vector3(10, 0, 0));

  lines.add(new THREE.Line(geometry, material));
  
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0,-10, 0));
  geometry.vertices.push(new THREE.Vector3(0, 10, 0));

  lines.add(new THREE.Line(geometry, material));

  return lines;
}

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  initEventListeners();
  // stats

  stats = new Stats();
  container.appendChild( stats.dom );

  // three.js things like scene, camera end renderer.

  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  hudScene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  hudCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000); 
  hudCamera.position.z = 1;
  //camera.position.z = 5;
  
  renderer = new THREE.WebGLRenderer();
  renderer.autoClear = false;

  colorPickingBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

  renderer.setSize( window.innerWidth, window.innerHeight ); // set size of the renderer (canvas element)
  document.body.appendChild( renderer.domElement ); // adding the canvas element into the DOM

  controls = new THREE.PointerLockControls( camera, renderer.domElement );
  controls.enabled = true;
  scene.add( controls.getObject() );

  // HUD creation

  hudScene.add( createHUDLines() );
  
  
  // Scene creation (just adding a simple cube for now)

  textureLoader = new THREE.TextureLoader();

  textures["stone"] = textureLoader.load("./textures/stonebrick.png");
  textures["moss"] = textureLoader.load("./textures/stonebrick_mossy.png");
  textures["sand"] = textureLoader.load("./textures/sand.png");
  textures["tnt-1"] = textureLoader.load("./textures/tnt1.png");
  textures["tnt-2"] = textureLoader.load("./textures/tnt2.png");

  let tnt_materials = [ textures["tnt-1"], textures["tnt-1"], textures["tnt-2"], textures["tnt-2"], textures["tnt-1"], textures["tnt-1"] ];
  
  let stone_cube = new THREE.TexturedCube (textures["stone"]);
  let moss_cube = new THREE.TexturedCube (textures["moss"]);
  let sand_cube = new THREE.TexturedCube (textures["sand"]);
  let tnt_cube = new THREE.TexturedCube (tnt_materials);
  
  stoneBuilder.setOA(stone_cube);
  mossBuilder.setOA(moss_cube);
  sandBuilder.setOA(sand_cube);
  tntBuilder.setOA(tnt_cube);
  
  scene.add( createPlane(sandBuilder, 17, -2) );
  scene.add( createPlane(stoneBuilder, 17, -1) );

  let tnt = tntBuilder.getOne();
  tnt.position.set(0,0,0);
  scene.add( tnt );
}


function animate() {
  stats.update();

  renderer.clear();
  
  let dt = clock.getDelta();

  let speed = 5;
  
  if (mvt[0])
    controls.getObject().translateZ(-1 * speed * dt);
  if (mvt[1])
    controls.getObject().translateX( -1 * speed * dt);
  if (mvt[2])
    controls.getObject().translateZ(speed * dt);
  if (mvt[3])
    controls.getObject().translateX(speed * dt);

  
  renderer.render(scene, camera);
  renderer.clearDepth();
  renderer.render(hudScene, hudCamera);

  requestAnimationFrame(animate);
}

