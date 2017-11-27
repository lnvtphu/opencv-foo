const cv = require('opencv');

// (B)lue, (G)reen, (R)ed
var lower_threshold = [45,100,50];
var upper_threshold = [75,255,255];
const camera = new cv.VideoCapture(1);
camera.read((err, im) => {
  if (err) throw err;
  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

  im.inRange(lower_threshold, upper_threshold);
  im.save('./tmp/coin_detected.jpg');
  console.log('Image saved to ./tmp/coin_detected.jpg');
});