function AnaglyphRenderer ( renderer ) {

  // left and right cameras
  this.cameraLeft  = new THREE.Camera();
  this.cameraLeft.matrixAutoUpdate = false;
  this.cameraRight = new THREE.Camera();
  this.cameraRight.matrixAutoUpdate = false;

  this.right = false;

  this.update = function ( camera ) {
    if (!("isPerspectiveCamera" in camera) && !("isOrthographicCamera" in camera)) throw new Error("Failure - please give me a true camera");
    
    camera.updateMatrixWorld();

    let ipd = displayParameters.ipd;
    
    this.cameraLeft.matrixWorld = camera.matrixWorld.clone();
    this.cameraLeft.translateX( -ipd / 2 );

    this.cameraRight.matrixWorld = camera.matrixWorld.clone();
    this.cameraRight.translateX( ipd / 2 );

    let d = displayParameters.distanceScreenViewer;
    let w = displayParameters.screenSize().x;
    
    let near = camera.near;
    let far = camera.fear;

    let planeFactor = 1 / (2 * d);
    
    let top = near * displayParameters.screenSize().y * planeFactor;
    let bottom = -top;

    let right = near * (w + ipd) * planeFactor;
    let left = -near * (w - ipd) * planeFactor;
    
    
    let projectionMatrix = new 
    THREE.Matrix4().makePerspective(left, right, top, bottom, near, far );

    this.cameraRight.projectionMatrix = projectionMatrix;
    this.cameraLeft.projectionMatrix = projectionMatrix;
  };

  this.render = function ( scene, camera ) {
    this.update(camera);
    
    if (this.right)
      renderer.render(scene, this.cameraRight);
    else
      renderer.render(scene, this.cameraLeft);
  };

}
