var OcclusionCulling = function() {
  profiler.log("OcclusionCulling - new");
  //
  return {
    sortArray: [],
    //
    arrayCompare: function(a,b) {
      if (a.distance > b.distance) {
        return -1;
      } // if
      else if (a.distance < b.distance) {
        return 1;
      } // else
      else {
        return 0;
      } // else
    }, // arrayCompare
    updateZ: function() {
      for (var sindex=0; sindex<=this.sortArray.length-1; sindex++) {
        var sortObject = this.sortArray[sindex];
        var modelLookup = models[sortObject.modelID];
        //
        if (modelLookup != null || modelLookup != undefined) {          
          sortObject.distance = modelLookup.distanceFromCamera;
        } // if
        else {
          sortObject.distance = 10000;
        } // else
      } // for sindex
    }, // updateZ
    update: function() {      
      this.updateZ();      
      this.sortArray.sort(this.arrayCompare);
    } // update
  }; // return
} // OcclusionCulling
