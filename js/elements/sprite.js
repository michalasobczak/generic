var SpriteFrame = function(sx, sy, _w, _h) {
  return {
    startX: sx,
    startY: sy,
    w: _w,
    h: _h    
  }; // return
}; // SpriteFrame
//
//
var Sprite = function(_name, dims) {  
  return {
    name: _name,
    dimensions: dims,
    position: Vector3(0, 0, 0),
    size: 0,    
    radius: 0,
    direction: Vector3(0,0,0),
    frames: [],
    sequences: {},
    currentSequence: "",
    currentSequencePosition: 1,
    nextSequence: "",
    isRunning: true,
    shouldTerminate: false,
    currentFrameDrawn: false,
    intervalReference: undefined,
    scale: 1,
    distanceFromCamera: 0,
    //
    start: function() {
      var self = this;  
      //      
      this.intervalReference = setInterval(function() {
        if (self.isRunning == true) {
          // GO TO NEXT FRAME
          if ((self.currentSequencePosition + 1) <= self.sequences[self.currentSequence].length-1) {
            if (self.currentFrameDrawn == true) {
              self.currentSequencePosition++;
              self.currentFrameDrawn = false;
            } // if
          } // if
          // END HIT
          else {
            var recurr = self.sequences[self.currentSequence][0];
            //
            if (recurr == true) {
              self.currentSequencePosition = 1;
            } // if
            else {
              self.currentSequencePosition = 1;
              self.currentSequence = self.nextSequence;
              self.nextSequence = "";
            } // else
          } // else
        } // if
        else {
          if (self.shouldTerminate == true) {
            clearInterval(self.intervalReference);
          } // if
        } // else
      }, 100); // setInterval
    }, // start
    stop: function() {
      clearInterval(this.intervalReference);
    }, // stop
    getImage: function() {
      return document.getElementById(this.name);
    }, // getImage  
    updateScale: function() {
      this.distanceFromCamera = getDistance3(camera.getPosition(), this.position);
      this.scale = 1/(this.distanceFromCamera/2000);
    }, // updateScale
    draw: function() {
      try {
        var currentSequenceObject;
        var cf;
        //
        currentSequenceObject = this.sequences[this.currentSequence];
        cf = this.frames[currentSequenceObject[this.currentSequencePosition]];      
        //
        if (this.dimensions == 3) {            
          var position2D = this.position.get2D();
          ctx.drawImage(this.getImage(), cf.startX, cf.startY,
                           cf.w, cf.h, 
                           position2D.x-(cf.w*this.scale/2),
                           position2D.y-(cf.h*this.scale),                      
                           cf.w*this.scale,
                           cf.h*this.scale);
        } // if
        else if (this.dimensions == 2) {
          ctx.drawImage(this.getImage(), cf.startX, cf.startY,
                           cf.w, cf.h,
                           this.position.x,
                           this.position.y,
                           cf.w,
                           cf.h);
        } // else
        //
        this.currentFrameDrawn = true;
      } // try
      catch (err) {
        profiler.log("DRAW => " + err.message);
      } // catch
    } // draw
  }; // return
}; // Sprite
//
//
function receiveScale(val) {
  for (var index=0; index<=sprites.length-1; index++) {    
    var sprite = sprites[index];
    if (val == "+") {
      sprite.scale += 0.2;
    } // if
    else if (val == "-") {
      sprite.scale -= 0.2;
    } // else    
  } // for
} // receiveScale
