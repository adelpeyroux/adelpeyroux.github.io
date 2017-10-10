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
