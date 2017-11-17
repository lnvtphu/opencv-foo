const cv = require('opencv');

var lowThresh = 20;
var highThresh = 200;
var nIters = 2;
var maxArea = 6000;
var minArea = 30000;
var maxPixel = 400;

var size = 116;
var widthOb = 1000000;
var sizePixel = 0;

var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
const camera = new cv.VideoCapture(1);

const window = new cv.NamedWindow('Camera 1', cv.WINDOW_NORMAL);

var position;
var position2;
setInterval( () => {
  camera.read(function(err, im) {
    if (err) throw err;
    const width = im.width();
    const height = im.height();
    var widthReal = 0;
    var heightReal = 0;
    if (width < 1 || height < 1) throw new Error('Image has no size');
  
    im.convertGrayscale();
    var im_canny = im.copy();
  
    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);
  
    var contours = im_canny.findContours();
    for(i = 0; i < contours.size(); i++) {
      if(contours.area(i) > maxArea ) {
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
          // console.log(rotated_rect.length);
          var angle = rotated_rect.angle;
          
          if( rotated_rect.size.width <  widthOb){
            widthOb = rotated_rect.size.width;
          }
          sizePixel = size/widthOb;
          // ve khung hcn 
          // im.rectangle([position.x, position.y],[position.width,position.height], RED, 2);
          // ve khung hcn theo 4 dinh 
          im.line([x1.x,x1.y], [x2.x, x2.y], (255,0,0), 2);
          im.line([x2.x,x2.y], [x3.x, x3.y], (255,0,0), 2);
          im.line([x3.x,x3.y], [x4.x, x4.y], (255,0,0), 2);
          im.line([x4.x,x4.y], [x1.x, x1.y], (255,0,0), 2);
          // hien thong so
          widthReal = Math.floor((rotated_rect.size.width - 10)*sizePixel);
          heightReal = Math.floor((rotated_rect.size.height -10)*sizePixel);
          console.log(position.width);
          if(widthReal > heightReal){
            var tmp = heightReal;
            heightReal = widthReal;
            widthReal = tmp;
          }
        }

        // im.putText('HCN dung: '+Math.floor(position.width*sizePixel)+'-'+Math.floor(position.height*sizePixel), 'label', (70, 70), 0.2,(255,255,255),1,1);
        // im.putText('HCN theo vat: '+widthReal+'-'+heightReal, 'label', (120, 120), 0.2,(255,255,255),1,1);
        // im.putText('RS/PX: '+(sizePixel), 'label', (170, 170), 0.2,(255,255,255),1,1);
        
      }
    }
    console.log('Width: ' + widthReal);
    console.log('Height: ' + heightReal);
    im.putText('HCN theo vat: '+widthReal+'-'+heightReal, 'label', (70, 70), 0.2,(255,255,255),1,1);
    window.show(im);
    window.blockingWaitKey(0, 50);
  });
}, 100);
