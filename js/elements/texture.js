cacheTriangle = {};
Texture = function(_imgID) {
  return {
    modelID: 0,    
    faceID: 0,
    // /////////
    // GENERATE
    // /////////
    p1: Vector3(0,0,0),
    p2: Vector3(0,0,0),
    p3: Vector3(0,0,0),
    p1_2D: Vector2(0,0),
    p2_2D: Vector2(0,0),
    p3_2D: Vector2(0,0),
    scaleW: 0,
    scaleH: 0,
    realW: 0,
    realH: 0,
    logW: 0,
    logH: 0,
    canvasWidthHalf: 0,
    texW: 0,
    texH: 0,
    // ////////
    // 2D
    // ////////
    //p1_2D: Vector2(0,0),
    xDir200: Vector2(0,0),  // 200
    xStep200: Vector2(0,0), // 200
    zDir200: Vector2(0,0),  // 200
    zStep200: Vector2(0,0), // 200
    xDir280: Vector2(0,0),  // 280
    xStep280: Vector2(0,0), // 280
    zDir280: Vector2(0,0),  // 280
    zStep280: Vector2(0,0), // 280
    // UNIVERSAL
    xStep: Vector2(0,0),
    zStep: Vector2(0,0),
    //
    mode: 0,
    minXOnScreen: 1000, // X
    maxXOnScreen: -1, // X
    minYOnScreen: 1000, // Y
    maxYOnScreen: -1, // Y
    // ////////
    cachedAlready: false,
    rects: [],
    size: 128,
    data: [],
    imgID: _imgID,
    dataArray: [],
    textureLoadCanvas: undefined,
    textureLoadCanvasContext: undefined,
    textureCacheCanvas: undefined,
    textureCacheCanvasContext: undefined,
    imageToDraw: undefined,
    factor: 2,
    dotSize:4,
    isLoaded:false,
    isOnline:true,
    imageData: undefined,
    sizeDivFactor: undefined,
    min: Vector2(0,0),
    max: Vector2(0,0),
    texCached: undefined,
    init: function() {
        this.sizeDivFactor = this.size / this.factor;

         // 200 
         // DIR
        this.xDir200 = getDirection2(this.p1_2D, this.p2_2D);
        // STEP
         this.xStep200 = this.xDir200.div(this.sizeDivFactor);

        // 280
         // DIR
         this.xDir280 = getDirection2(this.p3_2D, this.p2_2D);
        // STEP
         this.xStep280 = this.xDir280.div(this.sizeDivFactor);
    },
    loadData: function() {
      var loaded = false;
      if (this.isLoaded) {
        return;
      }

      this.scaleW = 2/zoom;
      this.scaleH = 2/zoom;
      this.realW = 630/zoom;
      this.realH = 317/zoom;
      this.logW = 320;
      this.logH = 212;

      // CANVASES
      var canvas3 = document.createElement("canvas");
      var ctx3 = canvas3.getContext("2d");
      this.textureCacheCanvas = document.createElement("canvas");
      this.textureCacheCanvasContext = this.textureCacheCanvas.getContext("2d");

      // IMAGE
      this.imageToDraw = new Image();
      var imgObject = new Image();
      imgObject.onload = function() {        
        loaded = true;
        canvas3.width = imgObject.width;
        canvas3.height = imgObject.height;
      };
      imgObject = document.getElementById("itest");
      loaded = true;

      // OUTPUT
      while (true) {
        if (loaded) {
          ctx3.drawImage(imgObject, 0,0);                  
          break;
        }
      }        

      // FILL PIXELS ARRAY      
      var imgData = ctx3.getImageData(0, 0, this.size, this.size);
      var counter = 0;
      for(var i=0; i<=this.size-1; i++) {        
        for(var j=0; j<=this.size-1; j++) {                    
          var cR = imgData.data[counter+0];
          var cG = imgData.data[counter+1];
          var cB = imgData.data[counter+2];
          var a =  imgData.data[counter+3];
          var rgba = "rgb(" + cR + "," + cG + "," + cB + ")";

          var index = i + j*this.size;
          this.dataArray[index] = rgba;

          counter = counter + 4;
        }
      }      
      this.isLoaded = true;
    },
    pointInTriangleTest: function(A,B,C,P) {
      var v0 = C.subtract(A);
      var v1 = B.subtract(A);
      var v2 = P.subtract(A);

      var dot00 = v0.dot(v0);
      var dot01 = v0.dot(v1);
      var dot02 = v0.dot(v2);
      var dot11 = v1.dot(v1);
      var dot12 = v1.dot(v2);

      var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
      var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

      return ((u >= 0) && (v >= 0) && (u + v < 1));
    },
    getTriangle: function(v1,v2,v3) {
      var lookup = this.modelID + "=" + this.faceID;
      var existingEntry = cacheTriangle[lookup];
      if (existingEntry !== undefined) {
        return existingEntry;
      }
      else {
        var newEntry = new Array(this.size);
        for(var i=0; i<=this.size-1; i++) {
          newEntry[i] = new Array(this.size);
        }
        for(var cind=0; cind<=this.size-1; cind++) {
          for(var rind=0; rind<=this.size-1; rind++) {
            currentPoint = $V([rind, cind, 0]);
            if (this.pointInTriangleTest(v1,v2,v3,currentPoint)) {
              newEntry[rind][cind] = 0; 
            }
          }
        }
        cacheTriangle[lookup] = newEntry;
        return newEntry;
      }
    },
    getDetails: function(abLen, p1_3D, p2_3D, p3_3D) {
      var A = $V([0, 0, 0]);
      var C = $V([this.size, this.size, 0]);
      if (abLen >= 280) {
        this.xStep = this.xStep280.dup();
        this.zStep = this.zStep280.dup();
        this.mode = 280;
        var bcDir = getDirection(p3_3D,p2_3D);
        var caDir = getDirection(p1_3D,p3_3D);        
        var B = $V([0, this.size, 0]);
        return [280, bcDir, caDir, A, B, C];
      }
      else if (abLen == 200) {
        this.xStep = this.xStep200.dup();
        this.zStep = this.zStep200.dup();
        this.mode = 200;
        var abDir = getDirection(p1_3D,p2_3D);
        var cbDir = getDirection(p2_3D,p3_3D);        
        var B = $V([this.size, 0, 0]);
        return [200, abDir, cbDir, A, B, C];
      }
    },
    findMin: function() {
      var x = 1000;
      var y = 1000;

      if (this.p1_2D.x < x) {
        x = this.p1_2D.x;
      }
      if (this.p1_2D.y < y) {
        y = this.p1_2D.y;
      }

      if (this.p2_2D.x < x) {
        x = this.p2_2D.x;
      }
      if (this.p2_2D.y < y) {
        y = this.p2_2D.y;
      }

      if (this.p3_2D.x < x) {
        x = this.p3_2D.x;
      }
      if (this.p3_2D.y < y) {
        y = this.p3_2D.y;
      }

      return Vector2(x,y);
    },
    findMax: function() {
      var x = 0;
      var y = 0;

      if (this.p1_2D.x > x) {
        x = this.p1_2D.x;
      }
      if (this.p1_2D.y > y) {
        y = this.p1_2D.y;
      }

      if (this.p2_2D.x > x) {
        x = this.p2_2D.x;
      }
      if (this.p2_2D.y > y) {
        y = this.p2_2D.y;
      }

      if (this.p3_2D.x > x) {
        x = this.p3_2D.x;
      }
      if (this.p3_2D.y > y) {
        y = this.p3_2D.y;
      }

      var r = Vector2(x,y);
      return r;
    },
    //////////////////////////////////
    // DRAW => EXECUTE ONLY THIS ONE
    //////////////////////////////////
    draw: function(mode, ar, p1_3D, p2_3D, stepCol, stepRow) {      
      // THE LATTER    
      var p_;
      var beg;
      var end;
      var pp;
      var rewindToX;
      var stepColSign;
      var cindexStart;
      var cindexCondition;
      var cindexStep;
      var stepCol200;
      var stepCol280;
      var stepCol200MulSizeDivFactor;
      var stepCol280MulSizeDivFactor;

      var stepColXHalf = stepCol.x >> 1;
      var stepRowZHalf = stepRow.z >> 1;

      if (mode == 200) {
        p_ = Vector3(p2_3D.x, p2_3D.y, p2_3D.z);
        rewindToX = p2_3D.x;
        stepColSign = -1;
        cindexStep = this.factor;
        stepCol200 = stepCol.mul(stepColSign);
        // 2D
        // COL/X
        pp = p_.get2D().dup();
        stepCol200MulSizeDivFactor = stepCol200.mul(this.sizeDivFactor);
         endX = p_.add(stepCol200MulSizeDivFactor).get2D().dup();
         this.xDir200 = getDirection2(endX, pp).dup();
           this.xStep200 = this.xDir200.div(this.sizeDivFactor).dup();
      }
      else if (mode == 280) {
        p_ = Vector3(p1_3D.x, p1_3D.y, p1_3D.z);
        rewindToX = p1_3D.x;
        stepColSign = 1;
        cindexStep = -1*this.factor;
        stepCol280 = stepCol.mul(stepColSign);
        // 2D
        // COL/X
        pp = p_.get2D().dup();
        stepCol280MulSizeDivFactor = stepCol280.mul(this.sizeDivFactor);
         endX = p_.add(stepCol280MulSizeDivFactor).get2D().dup();
         this.xDir280 = getDirection2(pp, endX).dup();
           this.xStep280 = this.xDir280.div(this.sizeDivFactor).dup();
      }
      
      if (mode == 200) {
        // ROWS
        for (var rindex=ar.length-1; rindex>=0; rindex-=this.factor) {
            // COLS
            var rlen = ar[rindex].length;
            for (var cindex=0, len=rlen-1; cindex<=len; cindex+=cindexStep) {
              if (ar[rindex][cindex] !== undefined) {
                var index = rindex + cindex * rlen;
                p_.color = this.dataArray[index];
                p_.inc(stepCol200);

                pp.inc(this.xStep200.mul(stepColSign));
                this.textureCacheCanvasContext.fillStyle = p_.color;
                this.textureCacheCanvasContext.fillRect(pp.x-this.minXOnScreen, pp.y-this.minYOnScreen, this.dotSize, this.dotSize);
              }    
              else {
                break;
              }      
            }//COLS
            p_.inc(stepRow);
            p_.x = rewindToX;
            pp = p_.get2D().dup();
            endX = p_.add(stepCol200MulSizeDivFactor).get2D().dup();
            this.xDir200 = getDirection2(endX, pp).dup();
              this.xStep200 = this.xDir200.div(this.sizeDivFactor).dup();
        }//ROWS
      }//200
      else if (mode == 280) {
        // ROWS
        for (var rindex=ar.length-1; rindex>=0; rindex-=this.factor) {
            // COLS
            var rlen = ar[rindex].length;
            for (var cindex=rlen-1; cindex>=0; cindex+=cindexStep) {
              if (ar[rindex][cindex] !== undefined) {
                var index = rindex + cindex * rlen;
                p_.color = this.dataArray[index];
                p_.inc(stepCol280);

                pp.inc(this.xStep280);
                this.textureCacheCanvasContext.fillStyle = p_.color;
                this.textureCacheCanvasContext.fillRect(pp.x-this.minXOnScreen, pp.y-this.minYOnScreen, this.dotSize, this.dotSize);
              }    
              else {
                break;
              }      
            }//COLS
            p_.inc(stepRow);
            p_.x = rewindToX;
            pp = p_.get2D().dup();
            endX = p_.add(stepCol280MulSizeDivFactor).get2D().dup();
            this.xDir280 = getDirection2(pp, endX).dup();
              this.xStep280 = this.xDir280.div(this.sizeDivFactor).dup();
        }//ROWS
      }//280
    },
    apply: function(faceID, modelID) {
      // IDs
      this.faceID = faceID;
      this.modelID = modelID;

      this.loadData();
      this.init();

      if (this.getFace().updateCounter%2==0) {
        var tex = this.generate("blankKey");
        this.imageToDraw.src = tex;          
        this.texCached = tex;
      }
      
      var min = this.findMin();
      ctx.drawImage(this.imageToDraw, min.x, min.y);
    },
    generate: function(key) {      
        var p1_3D = this.p1.dup();
        var p2_3D = this.p2.dup();
        var p3_3D = this.p3.dup();

        var abLen = getDistance3(p1_3D, p2_3D);
        var results = this.getDetails(abLen, p1_3D, p2_3D, p3_3D);
        var mode = results[0];
        var dirX = results[1];
        var dirZ = results[2];
        var A = results[3];
        var B = results[4];
        var C = results[5];
        var stepRow = dirZ.div(this.sizeDivFactor);
        var stepCol = dirX.div(this.sizeDivFactor);

      var ar = this.getTriangle(A, B, C);
      var max = this.findMax().dup();
      var min = this.findMin().dup();
      this.maxXOnScreen = max.x;
      this.maxYOnScreen = max.y;
      this.minXOnScreen = min.x;
      this.minYOnScreen = min.y;  
      this.textureCacheCanvas.width = (this.maxXOnScreen-this.minXOnScreen);
      this.textureCacheCanvas.height = (this.maxYOnScreen-this.minYOnScreen);
      this.draw(mode, ar, p1_3D, p2_3D, stepCol, stepRow);
      var _url = this.textureCacheCanvas.toDataURL();
      return _url;
    },
    getFace: function() {
      return models[this.modelID].faces[this.faceID];
    },
  };
};
