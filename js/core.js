// //////////////
// //////////////
// RUN
// //////////////
// //////////////

var signA = 1;

function run() {
  profiler.start();
  
  // UPDATE && DRAW  
  if (paused == false && ctx != undefined) {
    // CLEAR
    clearCanvas();
    
    //try {
      // OCCLUSION CULLING
      occlusionCulling.update();

      for (var mindex=0; mindex<=occlusionCulling.sortArray.length-1; mindex++) {    
        midSorted = occlusionCulling.sortArray[mindex].modelID;
        model = models[midSorted];              
        if (model != null && model != undefined && model.loaded) {        
          model.drawObject();
        }
      }  
    //}  
    //catch (err) {
    //  profiler.log("DRAW ERR => " + err.message);
    //}

    // COLLISIONS
    //collisionDetector.checkCollisions();

    // CAMERA
    camera.update();    
  }
    
  profiler.finish();  
}


// //////////////
// //////////////
// MAIN
// //////////////
// //////////////
$(document).ready(function() {
  // LOGGER
  profiler = Profiler();
  profiler.log("Logger created");


  // INITIALIZERS #1
  initializeCanvas();      


  // CANVAS
  profiler.log("Creating canvas context...");  
  var _canvas_ = document.getElementById("theCanvas");
  _canvas_.style.border = "1px solid silver";
    var _statusBar_ = document.getElementById("statusBar");
  ctx = _canvas_.getContext("2d");
    ctxSb = _statusBar_.getContext("2d");
  ctx.scale(scaleW, scaleH);
    ctxSb.scale(scaleW, scaleH);
  profiler.log("Canvas created");  
  
  
  // INIT
  camera = Camera();
  occlusionCulling = OcclusionCulling();  
  lightSource = LightSource();  
  lightSource.position = camera.getOrigin();
  map = Map();    
  collisionDetector = CollisionDetector();  

  
  // PC KEYBOARD
  if (getBrowserType() == GENERAL) {
    camera.updateDirection();

    $("#theCanvas").mousedown(function(e) {
      if (e.which == 1) {
      }
      else if (e.which == 3) {
        e.preventDefault();
      }
    });
    $("#theCanvas").click(function(e) {
    });
    $("body").bind('contextmenu', function(e){
      return false;
    }); 
    $("body").keypress(function(e) {      
      //profiler.log("Pressed " + e.keyCode);
      if (e.keyCode == '13') {
        if (paused) {
          paused = false;
        }
        else {
          paused = true;
        }
      }
      else if (e.keyCode == '119') {
        profiler.log("FWD");
        try {
          camera.moveForward();
        }
        catch (err) {
          profiler.log("FWD => " + err.message);
        }
      }
      else if (e.keyCode == '115') {
        profiler.log("BCK");
        camera.moveBackward();
      }
      else if (e.keyCode == '97') {
        profiler.log("LFT");
        camera.turnLeft();
        camera.noTurn();
      }
      else if (e.keyCode == '100') {
        profiler.log("RGT");
        camera.turnRight();
        camera.noTurn();
      }

    });
  }

  
  try {
    // MAP && MODELS    
    map.create();    
    map.load();    
    map.applyPositioning();      
    // PF
    map.updatePathFindingGrid();    
    // CAMERA INIT
    camera.calcRotPos();
  }
  catch (err) {
    profiler.log("CORE ERR = > " + err.message);
  }

  
  models[0].initTexture("itest");
  //models[1].initTexture("itest");
  models[3].rotate(-Math.PI/32, Vector3(0,0,1));

  
  setInterval(function() {
    if (paused == false) {
      //doSteer();
    }
  }, 100);

  // COLLECTIONS  
  setInterval(function() {
    try {
      map.collectVisibles();
    }
    catch (err) {
      profiler.log("COLLECT: " + err.message);
    }
  }, 300);


  // ////
  // RUN
  // ////
  profiler.log("About to set RUNNER...");    

  setInterval(run, camera.refreshRate);
});
