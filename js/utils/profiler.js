var Profiler = function() {
  return {
    counter: 0,
    time1: new Date(),
    time2: new Date(),
    timeCounter: 0,
    timeCounterAcc: 0,
    timeCounterVisibles: 0,
    timeCounterFire: 0,
    fpsRate: 0,
    diff: 0,
    x: 20,
    y: 20,
    //
    start: function() {
      this.counter += 1;
      this.time1 = new Date();
    }, // start
    finish: function() {
      if (ctx != undefined) {
        ctx.fillStyle = "#000000";
        ctx.fillText("FPS: " + this.fpsRate, this.x,this.y);
        //
        if (cacheRectsTimes.length>0) {
          ctx.fillText("LST:  " + cacheRectsTimes[cacheRectsTimes.length-1], this.x, this.y+10);  
        } // if
      } // if
      //
      this.time2 = new Date();
      this.diff = this.time2.getTime() - this.time1.getTime();
      //
      // TIME COUNTERS
      this.timeCounter += this.diff;
      this.timeCounterAcc += this.diff;
      this.timeCounterVisibles += this.diff;
      this.timeCounterFire += this.diff;
      //
      // /////////////////////////
      // FPS
      // /////////////////////////
      if (this.timeCounter >= 1000) {
        // FPS
        this.fpsRate = this.counter;
        this.counter = 0;
        this.timeCounter = 0;
      } // if
      //
      // /////////////////////////
      // SET ACC READINGS
      // /////////////////////////
      if (this.timeCounterAcc >= 200) {
        this.timeCounterAcc = 0;
      } // if
      //
      // /////////////////////////
      // PROCESS MODELS VISIBLITY
      // /////////////////////////
      if (this.timeCounterVisibles >= 1000) {
        this.timeCounterVisibles = 0;
        //getStatistics();
      } // if
    }, // finish
    log: function(msg) {
      console.log(msg);
    } // log
  }; // return
}; // Profiler
