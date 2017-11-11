const cv = require('opencv');

var lowThresh = 20;
var highThresh = 200;
var nIters = 2;
var maxArea = 20000;

var size = 116;
var widthOb = 1000000;
var sizePixel = 1;

var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
const camera = new cv.VideoCapture(2);
// const camera2 = new cv.VideoCapture(2);

const window = new cv.NamedWindow('Camera 1', 0);
// const window2 = new cv.NamedWindow('Video Fuxk 2', 2);

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

        var rotated_rect = contours.minAreaRect(i);
        // 4 dinh cua hcn 
        var x1 = rotated_rect.points[0];
        var x2 = rotated_rect.points[1];
        var x3 = rotated_rect.points[2];
        var x4 = rotated_rect.points[3];
        var angle = rotated_rect.angle;
        
        if( position.width <  widthOb){
          widthOb = position.width;
        }
        sizePixel = size/widthOb;
        // ve khung hcn 
        im.rectangle([position.x, position.y],[position.width,position.height], RED, 2);
          // im.putText('x1', 'label', (x1.x, x1.y), 0.2,(255,255,255),2,2);
          // im.putText('x2', 'label', (x2.x, x2.y), 0.2,(255,255,255),2,2);
          // im.putText('x3', 'label', (x3.x, x3.y), 0.2,(255,255,255),2,2);
          // im.putText('x4', 'label', (x4.x, x4.y), 0.2,(255,255,255),2,2);
        // ve khung hcn theo 4 dinh 
        im.line([x1.x,x1.y], [x2.x, x2.y], (255,0,0), 2);
        im.line([x2.x,x2.y], [x3.x, x3.y], (255,0,0), 2);
        im.line([x3.x,x3.y], [x4.x, x4.y], (255,0,0), 2);
        im.line([x4.x,x4.y], [x1.x, x1.y], (255,0,0), 2);
        // hien thong so

        im.putText('HCN dung: '+position.width+'-'+position.height, 'label', (70, 70), 0.2,(255,255,255),1,1);
        im.putText('HCN theo vat: '+Math.round(rotated_rect.size.width)+'-'+Math.round(rotated_rect.size.height), 'label', (120, 120), 0.2,(255,255,255),1,1);
        im.putText('Goc: '+Math.round(angle), 'label', (170, 170), 0.2,(255,255,255),1,1);
        
      }
    }
  
    window.show(im);
    window.blockingWaitKey(0, 50);
  });
}, 100);
