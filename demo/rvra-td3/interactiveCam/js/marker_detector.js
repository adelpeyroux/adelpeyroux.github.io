// camParams = {focal: numeric, halfHeight: numeric, halfWdth: numeric}
// params = {width: numeric, height: numeric,
//           hTarget: numerical, tolerance: numerical,
//           minSV: numerical, maxSV: numerical}
function getMarkerPos (imageSrc, imageDst, realRadius, camParams, params, circle) {
  let threshold = new ImageData(params.width, params.height);
  let binarized = new ImageData(params.width, params.height);
  
  CV.thresholdHSV(imageSrc, threshold, params.hTarget, params.tolerance, params.minSV, params.maxSV);
  CV.extract(threshold, binarized, 0);

  let tmp = new ImageData(params.width, params.height);
  
  let polys = CV.findContours(binarized, tmp);

  imageDst.data.set(threshold.data);

  let found = false;
  let max_r = 0;
  for (let pol of polys) {
    let x = 0;
    let y = 0;
    for (let pt of pol) {
      x += pt.x / pol.length;
      y += pt.y / pol.length;
    }
    let ctr = {x: x, y: y};
    
    let r = 0;
    for (let pt of pol) {
      let curr_d = dist(ctr, pt);
      if (r < curr_d) {
	r = curr_d;
      }
    }

    if (r > max_r) {
      max_r = r;
      circle.center = ctr;
      circle.radius = r;
      found = true;
    }
  }

  let zValue = 0;
  let yValue = 0;
  let xValue = 0;
  
  if (found) {
    zValue = realRadius * camParams.focal / circle.radius;
    yValue = (circle.center.y - camParams.halfHeight) * zValue / camParams.focal;
    xValue = (circle.center.x - camParams.halfWidth)  * zValue / camParams.focal;
  }

  return {x: xValue, y: yValue, z: zValue};

}
