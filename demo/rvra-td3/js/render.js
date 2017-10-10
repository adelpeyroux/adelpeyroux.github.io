var canvas, context, imageData, imageDst;

var renderer;

var Menu = function() {
  this.threshold = false;
  this.color = { h: 124, s: 0.9, v: 0.3 }; // Hue, saturation, value
  this.tolerance = 10.0;
  this.minSV = 0.1;
  this.maxSV = 1.0;
};

var menu, stats, gui;

function onClickTriggered (event) {
  var pos = relativePosition(event.clientX, event.clientY, event.target);
  
  if (context) {
    var value = context.getImageData(pos.x, pos.y, 1, 1).data;

    var hsv = rgb2hsv(value[0], value[1], value[2]);

    if (menu) {
      menu.color = hsv;
    }
  }
}

function init() {

  canvas = document.getElementById("canvas");
  canvas.width = parseInt(canvas.style.width);
  canvas.height = parseInt(canvas.style.height);

  context = canvas.getContext("2d");

  imageDst = new ImageData( canvas.width, canvas.height);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.width, canvas.height);
  console.log(canvas.width * canvas.height);
  renderer.setClearColor(0xffffff, 1);
  document.getElementById("container").appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
  scene.add(camera);
  texture = createTexture();
  scene.add(texture);

  // GUI
  menu = new Menu();
  gui = new dat.GUI();
  gui.add(menu, 'threshold');
  gui.addColor(menu, 'color').listen();
  gui.add(menu, 'tolerance', 0, 100);
  gui.add(menu, 'minSV', 0, 1).step(0.05);
  gui.add(menu, 'maxSV', 0, 1).step(0.05);
  
  // stats
  stats = new Stats();
  document.getElementById("container").appendChild( stats.dom );

  canvas.addEventListener('click', onClickTriggered);
  
  animate();
}

function createTexture() {
  var texture = new THREE.Texture(imageDst),
      object = new THREE.Object3D(),
      geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
      material = new THREE.MeshBasicMaterial( {map: texture, depthTest: false, depthWrite: false} ),
      mesh = new THREE.Mesh(geometry, material);

  texture.minFilter = THREE.NearestFilter;

  object.position.z = -1;

  object.add(mesh);

  return object;
}

function animate() {

  requestAnimationFrame( animate );

  if (video.readyState === video.HAVE_ENOUGH_DATA){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    
    if(menu.threshold) {
      CV.thresholdHSV(imageData, imageDst, menu.color.h, menu.tolerance, menu.minSV, menu.maxSV);
    } else {
      imageDst.data.set(imageData.data);
    }

    texture.children[0].material.map.needsUpdate = true;
    render();
  }
}

function render() {

  renderer.clear();
  renderer.render(scene, camera);

  stats.update();

}
