function AnaglyphRenderer ( renderer ) {

  // left and right cameras
  this.cameraLeft  = new THREE.Camera();
  this.cameraLeft.matrixAutoUpdate = false;
  this.cameraRight = new THREE.Camera();
  this.cameraRight.matrixAutoUpdate = false;

  this.right = false;

  this.dofRenderer = new DoFRenderer( renderer );
  
  this.update = function ( camera ) {
    //camera.updateMatrixWorld();

    let ipd = displayParameters.ipd;
    
    this.cameraLeft.matrixWorld = camera.matrixWorld.clone();
    this.cameraRight.matrixWorld = camera.matrixWorld.clone();

    this.cameraLeft.matrixWorld.multiply(new THREE.Matrix4().makeTranslation(- ipd / 2, 0, 0));
    this.cameraRight.matrixWorld.multiply(new THREE.Matrix4().makeTranslation(ipd / 2, 0, 0));

    let d = displayParameters.distanceScreenViewer;
    let w = displayParameters.screenSize().x;
    let h = displayParameters.screenSize().y;
    
    let near = camera.near;
    let far = camera.far;

    let planeFactor = 1 / (2 * d);
    
    let top = near * h * planeFactor;
    let bottom = -top;

    let right_left = near * (w + ipd) * planeFactor;
    let left_left = -1 * near * (w - ipd) * planeFactor;

    let right_right = near * (w - ipd) * planeFactor;
    let left_right = -1 * near * (w + ipd) * planeFactor;
    
    this.cameraRight.projectionMatrix = new THREE.Matrix4().makePerspective(left_right, right_right, top, bottom, near, far );
    
    this.cameraLeft.projectionMatrix = new THREE.Matrix4().makePerspective(left_left, right_left, top, bottom, near, far );
  };

  this.render = function ( scene, camera ) {
    this.update(camera);

    let glContext = renderer.domElement.getContext( 'webgl' );

    // Rendering for left eye (red)
    glContext.colorMask(true, false, false, true);
    renderer.render(scene, this.cameraLeft);

    // Between the eyes
    renderer.clearDepth();

    // Rendering for right eye (cyan = blue + green)
    glContext.colorMask(false, true, true, true);
    renderer.render(scene, this.cameraRight);

    // After all we reset the color mask
    glContext.colorMask(true, true, true, true);
  };

  this.renderRight = function (scene, camera) {
    this.update(camera);

    renderer.render(scene, this.cameraRight);
  };

  this.renderLeft = function (scene, camera) {
    this.update(camera);

    renderer.render(scene, this.cameraLeft);
  };

  this.renderBlur = function (scene, camera) {
    this.update(camera);

    let glContext = renderer.domElement.getContext( 'webgl' );

    // Rendering for left eye (red)
    glContext.colorMask(true, false, false, true);
    this.dofRenderer.render(scene, this.cameraLeft);

    // Between the eyes
    this.dofRenderer.clearDepth();

    // Rendering for right eye (cyan = blue + green)
    glContext.colorMask(false, true, true, true);
    this.dofRenderer.render(scene, this.cameraRight);

    // After all we reset the color mask
    glContext.colorMask(true, true, true, true);
  };
}
