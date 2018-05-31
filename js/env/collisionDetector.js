var CollisionDetector = function() {
  profiler.log("CollisionDetector - new");
  //
  return {
    checkCollisions: function() {
      for (var index=0; index<=models.length-1; index++) {
        currentModel = models[index];
        //
        if (currentModel.isCollidable()) {
          var dist = getDistance3(camera.getPosition(), currentModel.getPosition());
          var radius1 = currentModel.size;
          var radius2 = camera.size;
          var radiusSum = radius1 + radius2;
          //
          if (dist <= radiusSum) {
            profiler.log("COLL CAM W/ " + currentModel.modelRef);
            //models[index].setColor("#FF0000");
          } // if
          else {
            //models[index].setColor("#63C6FF");
          } // else
        } // if
      } // for
    } // checkCollisions
  }; // return
}; // CollisionDetector
