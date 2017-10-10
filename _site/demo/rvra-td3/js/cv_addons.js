CV.bidirectionalGaussianKernel = function (kernelSize) {
  let kernel = CV.gaussianKernel(kernelSize);

  let result = [];
  for (let i = 0; i < kernelSize; ++i) {
    for (let j = 0; j < kernelSize; ++j) {
      let index = i * kernelSize + j;
      result[index] = kernel[i] * kernel[j];
    }
  }

  return result;
};

CV.thresholdHSV = function(imageSrc, imageDst, hThreshold, tolerance, minSV, maxSV){
  

  var src = imageSrc.data, dst = imageDst.data,
      len = src.length, tab = [], i,
      height = imageSrc.height, width = imageSrc.width;
  
  for (i = 0; i < 359; ++ i){
    tab[i] = ((i <= hThreshold + tolerance &&
               i >= hThreshold - tolerance) ? 255 : 0);
  }

  let kernel = CV.bidirectionalGaussianKernel(3);
  
  for (let i = 1; i < height - 1; i++){
    for (let j = 1; j < width - 1; ++j) {
      let index = 4 * (i * width + j);
      /*
      let h = 0;
      let s = 0;
      let v = 0;

      for (let ii = -1; ii < 2; ++ii){
	for (let ij = -1; ij < 2; ++ij) {
	  let iindex = 4 * ((i + ii) * width + j + ij);
	  let kindex = ((ii + 1) * 3 + ij + 1);
	  let coef = kernel[kindex];
	  
	  let hsv = rgb2hsv(src[iindex], src[iindex + 1], src[iindex + 2]);
	  
	  h += coef * hsv.h;
	  s += coef * hsv.s;
	  v += coef * hsv.v;
	}
      }
      /*/
      let hsv = rgb2hsv(src[index], src[index + 1], src[index + 2]);
      let h = hsv.h;
      let s = hsv.s;
      let v = hsv.v;
      //*/
      
      let new_val = ((s >= minSV && v >= minSV &&
		      s <= maxSV && v <= maxSV ) ? tab[Math.floor(h)] : 0);

      dst[index] = dst[index + 1] = dst[index + 2] = new_val;
      dst[index + 3] = 255;
    }
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;
  
  return imageDst;
};
