const cv = require('opencv');
const config = require('./config');
var fs = require('fs');
const { camId, lowThresh, highThresh, nIters, maxArea, minArea, maxPixel, size, RED,
    highThresh_Object, lowThresh_Object, lowThresh_Object_Ref, highThresh_Object_Ref } = config.config;
let widthOb = 1000000;
let sizePixel = 0;
const camera = new cv.VideoCapture(camId);
const window = new cv.NamedWindow('Camera 1', cv.WINDOW_NORMAL);
var imRef;
var imObj;
var widthReal = 0;
var heightReal = 0;
exports.detectObject = function(){
    let main = setInterval( () => {
      camera.read(function(err, im) {
        if (err) throw err;
        const width = im.width();
        const height = im.height();
        if (width < 1 || height < 1) throw new Error('Image has no size');
      
        // detect object 
        imRef = im.copy();
        imObj = im.copy();
        imObj.inRange(lowThresh_Object, highThresh_Object);
        imRef.inRange(lowThresh_Object_Ref, highThresh_Object_Ref);

        im.convertGrayscale();
        // get size of Detect Object
        const {widthR, heightR} = handleIm(im, im, lowThresh, highThresh, nIters, maxArea, true);
        // get size of refer Object
        const {widthR: wR, heightR: hR} = handleIm(im, imRef, lowThresh, highThresh, nIters, maxArea, false);
        sizePixel = size/wR;
        widthReal = Math.floor(widthR*sizePixel);
        heightReal = Math.floor(heightR*sizePixel);
        fs.writeFile( __dirname +"/rs.txt", "Width: " + widthReal +" --- Height: " + heightReal, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      }); 
        // if width > 50px then close window
        if(widthR > 50){
            setTimeout(function(){ 
                clearInterval(main);
              }, 2000);
        }
        // console.log('Width: ' + widthReal);
        // console.log('Height: ' + heightReal);
        // im.putText('HCN theo vat: '+widthReal+'-'+heightReal, 'label', (70, 70), 0.2,(255,255,255),1,1);
        window.show(im);
        window.blockingWaitKey(0, 50);
      });
    }, 100);
  };
var handleIm = function(imOriginal, im, lowThresh, highThresh, nIters, maxArea, isDraw){
    let position;
    let width = 0, height = 0;
    let im_canny = im.copy();
    
      im_canny.canny(lowThresh, highThresh);
      im_canny.dilate(nIters);
    
      let contours = im_canny.findContours();
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
            console.log(rotated_rect.size);
            var angle = rotated_rect.angle;
            
            // if( rotated_rect.size.width <  widthOb){
            //   widthOb = rotated_rect.size.width;
            // }
            // sizePixel = size/widthOb;
            // ve khung hcn 
            if(isDraw){
                imOriginal.rectangle([position.x, position.y],[position.width,position.height], RED, 2);
            }
            
            // ve khung hcn theo 4 dinh 
            im.line([x1.x,x1.y], [x2.x, x2.y], (255,0,0), 2);
            im.line([x2.x,x2.y], [x3.x, x3.y], (255,0,0), 2);
            im.line([x3.x,x3.y], [x4.x, x4.y], (255,0,0), 2);
            im.line([x4.x,x4.y], [x1.x, x1.y], (255,0,0), 2);
            // hien thong so
            // widthReal = Math.floor((rotated_rect.size.width - 10)*sizePixel);
            // heightReal = Math.floor((rotated_rect.size.height -10)*sizePixel);
          width: rotated_rect.size.width;
          height: rotated_rect.size.height;
          }
          // im.putText('HCN dung: '+Math.floor(position.width*sizePixel)+'-'+Math.floor(position.height*sizePixel), 'label', (70, 70), 0.2,(255,255,255),1,1);
          // im.putText('HCN theo vat: '+widthReal+'-'+heightReal, 'label', (120, 120), 0.2,(0,0,0),1,1);
          // im.putText('RS/PX: '+(sizePixel), 'label', (170, 170), 0.2,(255,255,255),1,1);
        }
      }
      return {
          widthR: width,
          heightR: height
      }
}