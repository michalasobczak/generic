var OcclusionCulling = function() {
  profiler.log("OcclusionCulling - new");
  return {
    sortArray: [],
    arrayCompare: function(a,b) {
      if (a.distance > b.distance) {
        return -1;
      }
      else if (a.distance < b.distance) {
        return 1;
      }
      else {
        return 0;
      }
    },
    updateZ: function() {
      for (var sindex=0; sindex<=this.sortArray.length-1; sindex++) {
        var sortObject = this.sortArray[sindex];
        var modelLookup = models[sortObject.modelID];
        if (modelLookup != null || modelLookup != undefined) {          
          sortObject.distance = modelLookup.distanceFromCamera;
        }
        else {
          sortObject.distance = 10000;
        }
      }
    },
    update: function() {      
      this.updateZ();      
      this.sortArray.sort(this.arrayCompare);
    }
  };
}
