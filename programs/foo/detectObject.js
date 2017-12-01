const cv = require('opencv');
const config = require('./config');
const nodeCmd = require('node-cmd');
var fs = require('fs');
const { camId, camId2, lowThresh, highThresh, nIters, maxArea, minArea, maxPixel, size, RED,
    highThresh_Object, lowThresh_Object, lowThresh_Object_Ref, highThresh_Object_Ref } = config.config;
const camera = new cv.VideoCapture(camId);
const camera2 = new cv.VideoCapture(camId2);
// const window = new cv.NamedWindow('Camera 1', cv.WINDOW_NORMAL);
var imRef;
var imObj;
exports.detectObject = function(){
  readCam(camera, 'rs');
  readCam(camera2, 'rs2');
  // kill node process after 3s
  setTimeout(function(){ 
    nodeCmd.run('taskkill /f /im node.exe');
  }, 3000);
};
var readCam = function(camera, rs){
  camera.read(function(err, im) {
    if (err) throw err;
    const widthIm = im.width();
    const heightIm = im.height();
    if (widthIm < 1 || heightIm < 1) throw new Error('Image has no size');
  
    // detect object 
    // imRef = im.copy();
    // imObj = im.copy();
    // imObj.inRange(lowThresh_Object, highThresh_Object);
    // imRef.inRange(lowThresh_Object_Ref, highThresh_Object_Ref);

    im.convertGrayscale();
    // get size of Detect Object
    const {width, height} = handleIm(im, im, lowThresh, highThresh, nIters, maxArea);
    // get size of refer Object
    im.save(`${__dirname}/image/${rs}.jpg`);
    fs.writeFile( `${__dirname}/result/${rs}.json`, `{ "height": "${height}", "width": "${width}"}`, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    }); 
  });
}
var handleIm = function(imOriginal, im, lowThresh, highThresh, nIters, maxArea){
  let position;
  let width = 0, height = 0;
  let im_canny = im.copy();
  
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);

  let contours = im_canny.findContours();
  for(i = 0; i < contours.size(); i++) {
    if(contours.area(i) > maxArea && width < 1) {
      // console.log(contours.area(i));
      var moments = contours.moments(i);
      position = contours.boundingRect(i);
      if( position.width < maxPixel && position.height < maxPixel){
        var rotated_rect = contours.minAreaRect(i);
        // 4 dinh cua hcn 
        var x1 = rotated_rect.points[0];
        var x2 = rotated_rect.points[1];
        var x3 = rotated_rect.points[2];
        var x4 = rotated_rect.points[3];
        // console.log(rotated_rect.size);
        var angle = rotated_rect.angle;
        
        // ve khung hcn theo 4 dinh 
        im.line([x1.x,x1.y], [x2.x, x2.y], (255,0,0), 2);
        im.line([x2.x,x2.y], [x3.x, x3.y], (255,0,0), 2);
        im.line([x3.x,x3.y], [x4.x, x4.y], (255,0,0), 2);
        im.line([x4.x,x4.y], [x1.x, x1.y], (255,0,0), 2);
        if(rotated_rect.size.width > 0){
          width = rotated_rect.size.width;
          height = rotated_rect.size.height;
        }
      }
    }
  }
  return { width, height }
}