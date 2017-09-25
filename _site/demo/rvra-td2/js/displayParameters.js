var displayParameters = {

  // parameters for stereo rendering
  // physical screen diagonal -- in mm
  screenDiagonal: 355.00,
  screenResolutionWidth: 1366,
  screenResolutionHeight: 768,
  aspectRatio: 16 / 9,

  // inter pupillar distance -- in mm
  ipd: 65,

  // distance bewteen the viewer and the screen -- in mm
  distanceScreenViewer: 500,

  // TODO: amount of distance in mm between adjacent pixels
  pixelPitch: function() {
    let w = this.screenResolutionWidth;
    let h = this.screenResolutionHeight;
    let diag = this.screenDiagonal;
    
    let ratio = this.aspectRatio;

    let nbPixDiag = Math.sqrt(w*w + h*h);

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
