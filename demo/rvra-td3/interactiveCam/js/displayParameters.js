var displayParameters = {

  // parameters for stereo rendering
  // physical screen diagonal -- in mm
  screenDiagonal: 355,
  screenResolutionWidth: 1366,
  screenResolutionHeight: 768,
  aspectRatio: 1366 / 768,

  // inter pupillar distance -- in mm
  ipd: 64,

  // distance bewteen the viewer and the screen -- in mm
  distanceScreenViewer: 500,


  // TODO: amount of distance in mm between adjacent pixels
  pixelPitch: function() {
    let w = this.screenResolutionWidth;
    let h = this.screenResolutionHeight;
    let diag = this.screenDiagonal;

    let nbPixDiag = Math.round(Math.sqrt(w*w + h*h));

    return diag / nbPixDiag;
  },

  //TODO: physical display width and height -- in mm
  screenSize: function() {
    
    let w = this.screenResolutionWidth;
    let h = this.screenResolutionHeight;
    let pixPitch = this.pixelPitch();

    return new THREE.Vector2(w * pixPitch, h * pixPitch);
  }
  
};
