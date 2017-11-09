const cv = require('opencv');

var lowThresh = 20;
var highThresh = 200;
var nIters = 2;
var maxArea = 10000;

var size = 116;
var widthOb = 1000000;
var sizePixel = 1;

var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
const camera = new cv.VideoCapture(0);
const camera2 = new cv.VideoCapture(2);

const window = new cv.NamedWindow('Video Fuxk', 0);
const window2 = new cv.NamedWindow('Video Fuxk 2', 2);

var position;
var position2;
setInterval( () => {
  camera.read(function(err, im) {
    if (err) throw err;
    const width = im.width();
    const height = im.height();
    if (width < 1 || height < 1) throw new Error('Image has no size');
  
    im.convertGrayscale();
    var im_canny = im.copy();
  
    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);
  
    var contours = im_canny.findContours();
    for(i = 0; i < contours.size(); i++) {
      if(contours.area(i) > maxArea) {
        var moments = contours.moments(i);
      position = contours.boundingRect(i);
      if( position.width <  widthOb){
        widthOb = position.width;
      }
      sizePixel = size/widthOb;

        im.rectangle([position.x, position.y],[position.width,position.height], RED, 2);
        im.putText('y: ' +position.height, 'label', (position.x, position.y), 0.2,(255,255,255),2,2);
      }
    }
  
    window.show(im);
    window.blockingWaitKey(0, 50);
  });


  camera2.read(function(err, im) {
    if (err) throw err;
    const width = im.width();
    const height = im.height();
    if (width < 1 || height < 1) throw new Error('Image has no size');
    im.convertGrayscale();
    var im_canny2 = im.copy();
  
    im_canny2.canny(lowThresh, highThresh);
    im_canny2.dilate(nIters);
  
    var contours2 = im_canny2.findContours();
    for(i = 0; i < contours2.size(); i++) {
      if(contours2.area(i) > maxArea) {
      position2 = contours2.boundingRect(i);
      if( position2.width <  widthOb){
        widthOb = position2.width;
      }
      sizePixel = size/widthOb;

        im.rectangle([position2.x, position2.y],[position2.width,position2.height], RED, 2);
        im.putText('x: ' + position2.width, 'label', (position2.x, position2.y), 0.2,(255,255,255),2,2);
      }
    }
  
    window2.show(im);
    window2.blockingWaitKey(0, 50);
  });
}, 100);
