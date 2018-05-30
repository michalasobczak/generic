Camera = function() {
  profiler.log("Camera - new");
  return {
    refreshRate: 25,
    distanceToDraw: 1500,
    rotationStep: 0.05,
    rotationStep1: 0.01, 
    rotationStep2: 0.06,
    rotationStep3: 0.20,    
    initialDirection: Vector3(0,0,1),
    currentDirection: Vector3(0,0,0),
    position: Vector3(200,335,-250),
    initPosition: Vector3(200,335,-250),
    size: 500,
    r: 500,
    angle: Vector3(0.0, 0.00*Math.PI, 0.0),
    viewer: Vector3(0,0,-700),
    xDiff: 160,
    rotating: false,
    getPosition: function() {
      return this.position;
    },
    getOrigin: function() {
         v = Vector3(this.position.x + this.currentDirection.multiply(100).x, 
                335,
                this.position.z + this.currentDirection.multiply(100).z);
      return v;
    },
    noTurn: function() {
      this.updateDirection();
      this.rotating = false;
    },
    turnLeft: function() {
      this.angle.y += this.rotationStep;
      this.updateDirection();
      this.rotating = true;
      this.calcRotPos();
    },
    turnRight: function() {
      this.angle.y -= this.rotationStep;
      this.updateDirection();
      this.rotating = true;
      this.calcRotPos();
    },
    moveForward: function() {
      if (this.rotating == false) {
           speed = 50;
        this.translate(this.currentDirection.multiply(speed));
      }
    },
    moveBackward: function() {
      if (this.rotating == false) {
           speed = -40;
        this.translate(this.currentDirection.multiply(speed));
      }
    },
    updateDirection: function() {
      this.currentDirection = this.initialDirection.rotate(-1*this.angle.y, Vector3(0,0,0), Vector3(0,1,0)).normalize();
    },
    translate: function(v) {
      this.position.inc(v);
      this.initPosition.inc(v);
    },
    update: function() {
    },
    calcRotPos: function() {
      try {
           thNew;
           th = this.angle.y;
           thBis = Math.floor(Math.abs(th) / Math.PI);

        if (th >= 0.0) {
          if (thBis==0 || thBis%2==0) {
            thNew = Math.abs(th % Math.PI);
          }
          else if (thBis==1 || thBis%2!=0) {
            thNew = -1 * (Math.PI - Math.abs(th % Math.PI));
          }
        }
        else if (th < 0.0) {
          if (thBis==0 || thBis%2==0) {
            thNew = -1 * Math.abs(th % Math.PI);
          }
          else if (thBis==1 || thBis%2!=0) {
            thNew = Math.PI - Math.abs(th % Math.PI);
          }
        }
                
                
        if (thNew >= 0.0 && thNew <= Math.PI/2) {
             thPXZ = thNew / (Math.PI/2);
          this.position.x = this.initPosition.x + this.r*thPXZ;
          this.position.z = this.initPosition.z + this.r*thPXZ;
        }
        else if (thNew > Math.PI/2 && thNew <= Math.PI) {
             thPXZ = (Math.PI-thNew) / (Math.PI/2);
          this.position.x = this.initPosition.x + this.r - (this.r*(1-thPXZ));
          this.position.z = this.initPosition.z + this.r + (this.r*(1-thPXZ));
        }
        else if (thNew < 0.0 && thNew >= -Math.PI/2) {
             thPXZ = Math.abs(thNew) / (Math.PI/2);
          this.position.x = this.initPosition.x - this.r*thPXZ;
          this.position.z = this.initPosition.z + this.r*thPXZ;
        }
        else if (thNew < -Math.PI/2 && thNew >= -Math.PI) {
             thPXZ = (Math.PI-Math.abs(thNew)) / (Math.PI/2);
          this.position.x = this.initPosition.x - this.r + (this.r*(1-thPXZ));
          this.position.z = this.initPosition.z + this.r + (this.r*(1-thPXZ));
        }
      }
      catch (err) {
        profiler.log("CALC POSROT ERR => " + err.message);
      }
    }
  };
}


function doSteer() {
  try {
    x = accReading.x;
    y = accReading.y;
    z = accReading.z;

    xPerc = x/maxW;
    yPerc = y/maxH;

    if (xPerc >= 0.4 && xPerc <= 0.6) {
      camera.noTurn();
    }
    else if (xPerc < 0.4) {
      if (xPerc > 0.3 && xPerc <= 0.4) {
        camera.rotationStep = camera.rotationStep1;
      }
      else if (xPerc > 0.2 && xPerc <= 0.3) {
        camera.rotationStep = camera.rotationStep2;
      }
      else if (xPerc > 0.0 && xPerc <= 0.2) {
        camera.rotationStep = camera.rotationStep3;
      }

      camera.turnLeft();
      return;
    }
    else if (x > 0.6) {
      if (xPerc > 0.6 && xPerc <= 0.7) {
        camera.rotationStep = camera.rotationStep1;
      }
      else if (xPerc > 0.7 && xPerc <= 0.8) {
        camera.rotationStep = camera.rotationStep2;
      }
      else if (xPerc > 0.8 && xPerc <= 1.0) {
        camera.rotationStep = camera.rotationStep3;
      }

      camera.turnRight();
      return;
    }

    if (yPerc < 0.4) {
      camera.moveForward();
    }
    else if (yPerc > 0.6) {
      camera.moveBackward();
    }
  }
  catch (err) {
    profiler.log("DO STEER ERR => " + err.message);
  }
}
