// //////////////
// //////////////
// RUN
// //////////////
// //////////////
var signA = 1;
//
function run() {
  profiler.start();
  // UPDATE && DRAW  
  if (paused == false && ctx != undefined) {
    // CLEAR
    clearCanvas();
    // OCCLUSION CULLING
    occlusionCulling.update();
    //
    for (var mindex=0; mindex<=occlusionCulling.sortArray.length-1; mindex++) {    
      midSorted = occlusionCulling.sortArray[mindex].modelID;
      model = models[midSorted];              
      if (model != null && model != undefined && model.loaded) {        
        model.drawObject();
      }
    } // for
    // COLLISIONS
    //collisionDetector.checkCollisions();
    // CAMERA
    camera.update();    
  } // if !paused
  //
  profiler.finish();  
} // run


function vertices_counter_funtion() {
  console.log(vertices_counter);
  vertices_counter = 0;
} //timer


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
  ctx = _canvas_.getContext("2d");
  ctx.scale(scaleW, scaleH);
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
    //
    $("#theCanvas").mousedown(function(e) {
      if (e.which == 1) {
        ;
      }
      else if (e.which == 3) {
        e.preventDefault();
      }
    }); // mousedown
    //
    $("#theCanvas").click(function(e) {
      ;
    }); // click
    //
    $("body").bind('contextmenu', function(e){
      return false;
    }); //contextmenu
    //
    $("body").keypress(function(e) {      
      //profiler.log("Pressed " + e.keyCode);
      if (e.keyCode == '13') {
        if (paused) {
          paused = false;
        }
        else {
          paused = true;
        }
      } // 13
      else if (e.keyCode == '119') {
        profiler.log("FWD");
        try {
          camera.moveForward();
        }
        catch (err) {
          profiler.log("FWD => " + err.message);
        }
      } // FWD 119
      else if (e.keyCode == '115') {
        profiler.log("BCK");
        camera.moveBackward();
      } // BCK 115
      else if (e.keyCode == '97') {
        profiler.log("LFT");
        camera.turnLeft();
        camera.noTurn();
      } // LFT 97
      else if (e.keyCode == '100') {
        profiler.log("RGT");
        camera.turnRight();
        camera.noTurn();
      } // RGT 100
    }); // keypress
  } // if browser GENERAL
  //
  try {
    // MAP && MODELS    
    map.create();    
    map.load();    
    map.applyPositioning();      
    // PF
    map.updatePathFindingGrid();    
    // CAMERA INIT
    camera.calcRotPos();
  } // try
  catch (err) {
    profiler.log("CORE ERR = > " + err.message);
  } // catch
  //
  // MODEL AT 0 POSITON
  models[0].initTexture("itest");
  // SAMPLE ROTATION
  models[3].rotate(-Math.PI/32, Vector3(0,0,1));
  //
  // TODO: verify if still needed
  setInterval(function() {
    if (paused == false) {
      ;
    }
  }, 100);
  //
  // COLLECTIONS  
  setInterval(function() {
    try {
      map.collectVisibles();
    } // try
    catch (err) {
      profiler.log("COLLECT: " + err.message);
    } // catch
  }, 300); // setInterval
  //
  // ////
  // RUN
  // ////
  profiler.log("About to set RUNNER...");    
  //
  setInterval(vertices_counter_funtion, 1000);
  setInterval(run, camera.refreshRate);
}); // document ready
