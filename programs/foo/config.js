exports.config = {
    camId: 1,
    lowThresh: 20,
    highThresh: 200,
    // orange
    highThresh_Object: [35, 220, 240],
    lowThresh_Object: [0, 80, 100],
    // green
    highThresh_Object_Ref: [65, 186, 72],
    lowThresh_Object_Ref: [0, 104, 0],
    nIters: 2,
    maxArea: 6000,
    minArea: 30000,
    maxPixel: 400,
    size: 116, // real size of the refer object
    widthOb:  1000000,
    sizePixel: 0,
    GREEN: [0, 255, 0],
    WHITE: [255, 255, 255], // B, G, R
    RED: [0, 0, 255]
}