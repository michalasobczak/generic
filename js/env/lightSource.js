var LightSource = function() {
  profiler.log("LightSource - new");
  return {
    cacheLight: {},
    position: Vector3(0,0,0),
    getFaceColor: function(faceCenter, requestedColor) {
      var distance = getDistance3(camera.position, faceCenter);
      return this.getColor(requestedColor, 20-(distance/15));
    },
    getColor: function(color, percent) {
      var lookup = color + "=" + percent;
      var existingEntry = this.cacheLight[lookup];
      if (existingEntry != undefined) {
        return existingEntry;
      }
      else {
        var newEntry;

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
  
        R = (R * (100 + percent) / 100) | 0;
        G = (G * (100 + percent) / 100) | 0;
        B = (B * (100 + percent) / 100) | 0;
  
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
  
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  
        newEntry = "#"+RR+GG+BB;
        this.cacheLight[lookup] = newEntry;
        return newEntry;
      }
    }
  };
}
