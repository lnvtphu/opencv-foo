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
const camera = new cv.VideoCapture(2);
const window = new cv.NamedWindow('Video Fuxk', 0);
var position;
setInterval( () => {
  camera.read(function(err, im) {
    if (err) throw err;
    var width = im.width();
    var height = im.height();
    if (width < 1 || height < 1) throw new Error('Image has no size');
  
    im.convertGrayscale();
    im_canny = im.copy();
  
    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);
  
    contours = im_canny.findContours();
    for(i = 0; i < contours.size(); i++) {
      if(contours.area(i) > maxArea) {
        var moments = contours.moments(i);
      position = contours.boundingRect(i);
      if( position.width <  widthOb){
        widthOb = position.width;
      }
      sizePixel = size/widthOb;

        im.rectangle([position.x, position.y],[position.width,position.height], RED, 2);
        im.putText(position.width, 'label', (position.x, position.y), 0.2,(255,255,255),2,2);
      }
    }
  
    window.show(im);
    window.blockingWaitKey(0, 50);
  });
}, 100);


