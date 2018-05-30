function initializeCanvas() {
  profiler.log("Canvas - initializer");

  var c = document.getElementById("theCanvas");
  var csb = document.getElementById("statusBar");
  var currentW = w;
  var currentH = h;  

  maxW = 640/zoom;
  maxH = 480/zoom;
  
  // CALCULATE CANVAS SIZES
  if (currentW <= maxW && currentH <= maxH) {
    while (currentW <= maxW && currentH <= maxH) {
      currentW += wStep;
      currentH += hStep;      
    }
  }
  else {
    while (currentW >= maxW || currentH >= maxH) {
      currentW -= wStep;
      currentH -= hStep;
    }
  }
  
  // SET SCALE
  scaleW = currentW / w;
  scaleH = currentH / h;
      
  // SET CANVAS SIZE  
  c.width = maxW; //w*scaleW;
  c.height = (h*scaleH)*0.75;

  // STATUS BAR  
  csb.width = maxW; //w*scaleW;
  csb.height = (h*scaleH)*0.25;

  // LEFT POSITION CANVAS
  translateByX = Math.round((maxW-currentW)/2);
  csb.style.marginTop = "-6px";
  var factor = maxW / (w*scaleW);
  w = w * factor;
  
  // FOR DRAWING
  canvasWidth = w;
  canvasHeight = h;
  canvasWidthClear = wClear;
  canvasHeightClear = hClear;
  canvasWidthHalf = canvasWidth/2;
  canvasHeightHalf = canvasHeight/2; 
  
  profiler.log("SCALE = " + scaleW + "," + scaleH);
  profiler.log("C REAL = " + c.width + "," + c.height);
  profiler.log("C LOG = " + canvasWidth + "," + canvasHeight);
  
  profiler.log("Canvas - initializer DONE");
}
