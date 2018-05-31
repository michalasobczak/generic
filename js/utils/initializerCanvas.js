function initializeCanvas() {
  profiler.log("Canvas - initializer");
  //
  var c = document.getElementById("theCanvas");
  var currentW = w;
  var currentH = h;  
  //
  maxW = 640/zoom;
  maxH = 480/zoom;
  //
  // CALCULATE CANVAS SIZES
  if (currentW <= maxW && currentH <= maxH) {
    while (currentW <= maxW && currentH <= maxH) {
      currentW += wStep;
      currentH += hStep;      
    } // while
  } // if
  else {
    while (currentW >= maxW || currentH >= maxH) {
      currentW -= wStep;
      currentH -= hStep;
    } // while
  } // else
  //
  // SET SCALE
  scaleW = currentW / w;
  scaleH = currentH / h;
  //    
  // SET CANVAS SIZE  
  c.width = maxW; //w*scaleW;
  c.height = (h*scaleH)*0.75;
  //
  // LEFT POSITION CANVAS
  translateByX = Math.round((maxW-currentW)/2);
  var factor = maxW / (w*scaleW);
  w = w * factor;
  //
  // FOR DRAWING
  canvasWidth = w;
  canvasHeight = h;
  canvasWidthClear = wClear;
  canvasHeightClear = hClear;
  canvasWidthHalf = canvasWidth/2;
  canvasHeightHalf = canvasHeight/2; 
  //
  profiler.log("SCALE  = " + scaleW + "," + scaleH);
  profiler.log("C REAL = " + c.width + "," + c.height);
  profiler.log("C LOG  = " + canvasWidth + "," + canvasHeight);
  //
  profiler.log("Canvas - initializer DONE");
} // initializeCanvas
