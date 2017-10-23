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

CV.extract = function (imageSrc, imageDst, canal) {
  var src = imageSrc.data, dst = imageDst.data,
      len = src.length,
      height = imageSrc.height, width = imageSrc.width;

  for (let index = 0, dIndex = 0; index < len; index += 4, dIndex++){
    dst[dIndex] = src[index + canal];
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;
  
  return imageDst;
};

CV.thresholdHSV = function(imageSrc, imageDst, hThreshold, tolerance, minSV, maxSV){
  var src = imageSrc.data, dst = imageDst.data,
      len = src.length, tab = [];
  
  for (let i = 0; i < 360; ++ i){
    tab[i] = ((i <= hThreshold + tolerance &&
               i >= hThreshold - tolerance) ? 255 : 0);
  }
  
  for (let index = 0; index < len; index += 4){

    let hsv = rgb2hsv(src[index], src[index + 1], src[index + 2]);
    let h = hsv.h;
    let s = hsv.s;
    let v = hsv.v;
    
    let new_val = ((s >= minSV && v >= minSV &&
		    s <= maxSV && v <= maxSV ) ? tab[Math.floor(h)] : 0);

    dst[index] = dst[index + 1] = dst[index + 2] = new_val;
    dst[index + 3] = 255;
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;
  
  return imageDst;
};
