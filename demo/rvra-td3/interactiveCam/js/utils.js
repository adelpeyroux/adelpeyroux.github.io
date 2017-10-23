
// Basic asyncronous shader loader for THREE.js
// from http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/

function shaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            onLoad(vertex_text, fragment_text);
        });
    }, onProgress, onError);
}


function rgb2hsv (r,g,b) {
 var computedH = 0;
 var computedS = 0;
 var computedV = 0;

 //remove spaces from input RGB values, convert to int
 var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
 var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
 var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

 if ( r==null || g==null || b==null ||
     isNaN(r) || isNaN(g)|| isNaN(b) ) {
   alert ('Please enter numeric RGB values!');
   return;
 }
 if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
   alert ('RGB values must be in the range 0 to 255.');
   return;
 }
 r=r/255; g=g/255; b=b/255;
 var minRGB = Math.min(r,Math.min(g,b));
 var maxRGB = Math.max(r,Math.max(g,b));

 // Black-gray-white
 if (minRGB==maxRGB) {
  computedV = minRGB;
  return [0,0,computedV];
 }

 // Colors other than black-gray-white:
 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
 var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
 computedH = 60*(h - d/(maxRGB - minRGB));
 computedS = (maxRGB - minRGB)/maxRGB;
 computedV = maxRGB;
  return { h: computedH, s: computedS, v: computedV };
};


function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

function relativePosition(absX, absY, elt) {
  var pos = getPosition(elt);
  
  return { x: absX - pos.x,
	   y: absY - pos.y };
}


function dist (p1, p2) {
  let v = {x: p2.x - p1.x, y: p2.y - p1.y};
  
  return Math.sqrt( v.x * v.x + v.y * v.y);
}

// camParams = {focal: numeric, halfHeight: numeric, halfWdth: numeric}
// params = {width: numeric, height: numeric,
//           hTarget: numerical, tolerance: numerical,
//           minSV: numerical, maxSV: numerical}
function getMarkerPos (imageSrc, imageDst, realRadius, camParams, params, circle) {
  let threshold = new ImageData(params.width, params.height);
  let binarized = new ImageData(params.width, params.height);
  
  CV.thresholdHSV(imageSrc, threshold, params.hTarget, params.tolerance, params.minSV, params.maxSV);
  CV.extract(threshold, binarized, 0);

  let tmp = new ImageData(canvas.width, canvas.height);
  
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

  return {x: xValue, y: yValue, z:zValue};

}
