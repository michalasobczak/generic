var Face = function(_p1, _p2, _p3, _mr) {
  return {        
    updateCounter: 0,
    // 3D POINTS REFERENCES
    p1Ref: _p1,
    p2Ref: _p2,
    p3Ref: _p3,
    // CACHED 3D POINTS
    p1_3DCached: Vector3(0,0,0),
    p2_3DCached: Vector3(0,0,0),
    p3_3DCached: Vector3(0,0,0),
    // /////////////
    // 2D
    // /////////////
    p1_2D: Vector2(0,0),
    p2_2D: Vector2(0,0),
    p3_2D: Vector2(0,0),    
    // TEXTURE
    id: 0,
    texture: undefined,
    t1Ref: Vector2(0,0),
    t2Ref: Vector2(0,0),
    t3Ref: Vector2(0,0),
    textureMaterial: "blank",    
    color: "#63C6FF",   
    //    
    getColor: function() {
      return this.color;
    }, // getColor
    initTexture: function(imgID) {
      this.texture = Texture(imgID);
    }, // initTexture
    // MODEL REF
    modelRef: _mr,
    // 2D POINTS REPRESENTATION OF 3D VERTICES
    get_p1_2D: function() {
      return models[this.modelRef].vertices[this.p1Ref].get2D();
    }, // get_p1_2D
    get_p2_2D: function() {
      return models[this.modelRef].vertices[this.p2Ref].get2D();      
    }, // get_p2_2D
    get_p3_2D: function() {
      return models[this.modelRef].vertices[this.p3Ref].get2D();
    }, // get_p3_2D
    // NORMAL
    normalInitialized: false,
    initialNormal: Vector3(0,0,0),
    currentNormal: Vector3(0,0,0),    
    //
    applyNormal: function() {    
      var startPoint = this.getCenter();
      if (this.normalInitialized == false) {
        var p = Vector3(0,0,0);
        p.x = startPoint.x + (this.initialNormal.x*50);
        p.y = startPoint.y + (this.initialNormal.y*50);
        p.z = startPoint.z + (this.initialNormal.z*50);
        this.currentNormal = p;
        this.normalInitialized = true;
      } // if    
    }, // applyNormal          
    // BACK-FACE CULLING
    th: 0.0,
    // CENTER
    getCenter: function() {
      var p1 = models[this.modelRef].vertices[this.p1Ref];
      var p2 = models[this.modelRef].vertices[this.p2Ref];
      var p3 = models[this.modelRef].vertices[this.p3Ref];
      var sum = p1.add(p2).add(p3);
      var center = Vector3(sum.x/3, sum.y/3, sum.z/3);
      return center;
    }, // getCenter
    applyBackfaceCulling: function() {      
      var faceCenter = this.getCenter();
      var a = getDirection(camera.getPosition(), faceCenter).normalize();
      var b = getDirection(this.currentNormal, faceCenter).normalize();        
      this.th = getDotProduct(a,b);      
    }, // applyBackfaceCulling
    getArea: function(p1,p2,p3) {
      var a = getDistance2(p1,p2);
      var b = getDistance2(p2,p3);
      var c = getDistance2(p3,p1);      
      var p = (a+b+c) >> 1;
      var area = Math.sqrt(p*(p-a)*(p-b)*(p-c));
      return area;
    }, // getArea
    // UPDATE AND DRAW
    update: function() {
      // UPDATE CACHED POINTS    
      this.p1_3DCached = models[this.modelRef].vertices[this.p1Ref];
      this.p2_3DCached = models[this.modelRef].vertices[this.p2Ref];
      this.p3_3DCached = models[this.modelRef].vertices[this.p3Ref];
      //
      // ////////////
      // CACHE 2D
      // ////////////
      if (models[this.modelRef].isTextured) {
          this.p1_2D = this.p1_3DCached.get2D();
          this.p2_2D = this.p2_3DCached.get2D();
          this.p3_2D = this.p3_3DCached.get2D();
          // 3D
          this.texture.p1 = this.p1_3DCached;
          this.texture.p2 = this.p2_3DCached;
          this.texture.p3 = this.p3_3DCached;
          // 2D
          this.texture.p1_2D = this.p1_2D;
          this.texture.p2_2D = this.p2_2D;
          this.texture.p3_2D = this.p3_2D;
      } // if
      // ////////////
      //
      this.updateCounter++;
      // BACKFACE CULLING
      if (this.updateCounter%2==0) {
        this.applyBackfaceCulling();
      } // if
      //
      if (this.th > 0.0) {
        if (models[this.modelRef].isTextured) {
          this.texture.apply(this.id, this.modelRef);
        } // if
        else {
          var p1 = this.get_p1_2D();
          var p2 = this.get_p2_2D();
          var p3 = this.get_p3_2D();
          //
          ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          //       
          ctx.strokeStyle = ctx.fillStyle;
          ctx.stroke();
          //
          ctx.fillStyle = lightSource.getFaceColor(this.getCenter(), this.getColor());
          ctx.fill();
        } // else       
      } // if th > 0.0
    } // update
  }; // return
} // Face
