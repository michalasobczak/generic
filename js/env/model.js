var Model = function(_filename, _mr, _type) {  
  occlusionCulling.sortArray.push({"modelID":modelsCounter, "distance":0});

  modelsCounter+=1;
  //profiler.log("\Model - creating " + _filename + "/" + _mr);  

  return {
    modelRef: _mr,
    // ////////
    // FIELDS
    // ////////
    isTextured: false,
    active: true,
    sectorType: 0,
    loaded: false,    
    center3DUpdateInterval: 1,
    center3D: Vector3(0,0,0),
    center2D: Vector2(0,0),
    getPosition: function() {
      return this.center3D;
    },
    name: _filename,
    type: _type,
    sprite: undefined,
    // DATA
    vertices: [],
    faces: [],
    normals: [],
    textureVertices: [],    
    // CAMERA
    cameraChase: false,    
    distanceFromCamera: 0,
    previousDirection: Vector3(0,0,0),
    currentDirection: Vector3(0,0,0),
    th: 0,    
      directionFromCamera: Vector3(0,0,0),
      dot: 0,
    insideScreen: true,
    // //////////////////
    // TEXTURE
    // //////////////////
    initTexture: function(imgID) {
      this.isTextured = true;
      for (var index=0; index<=this.faces.length-1; index++) {
        this.faces[index].initTexture(imgID);
      }
    },
    // ///////////////
    // COLOR SET
    // ///////////////
    setColor: function(color) {
      for (var index=0; index<=this.faces.length-1; index++) {
        this.faces[index].color = color;
      }
    },
    // ///////////////
    // TYPE CHECK
    // ///////////////
    isObj: function() {
      if (this.type == "obj") {
        return true;
      }
      else {
        return false;
      }
    },
    isSpr: function() {
      if (this.type == "spr") {
        return true;
      }
      else {
        return false;
      }
    },
    // ///////////////
    // SIZE CALC
    // ///////////////
    size: 0,
    setSize: function() {
      var currentRadius = 0;
      for (var index=0; index<=this.vertices.length-1; index++) {
        // OBJ
        if (this.isObj()) {
          var currentVertex = this.vertices[index];
          var distanceFromCenter = (getDistance3(this.getPosition(), currentVertex)) | 0;
          while (distanceFromCenter >= currentRadius) {
            currentRadius++;
          }
        }
        // SPR
        else {
        }
      }

      this.size = currentRadius;
    },
    // ///////////////
    // COLLISIONS
    // ///////////////
    collidable: undefined,
    isCollidable: function() {
      if (this.isObj() ||  (!this.isObj() && this.sprite.dimensions == 3)) {
        if (this.collidable != undefined) {
          return this.collidable;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    },
    destroyable: false,
    // ///////////////
    // FETCHING
    // ///////////////
    getData: function() {
      if (this.isObj())
        this.askForData();
    },
    askForData: function() {
      if (this.isObj()) {        
        var self = this;
        $.ajax({
          url: "/models/" + self.name + ".obj",
          async: false
        }).done(function(data) {
          parseData(self.modelRef, data);
        });
      }
    },    
    // ////////////
    // POSITIONING
    // ////////////
    updateCenter3D: function() {
      if (this.isObj()) {
        var sum = Vector3(0,0,0);
        var vlen = this.vertices.length;
        for (var index=0; index<=this.vertices.length-1; index++) {
          sum.inc(this.vertices[index]);
        }
        this.center3D = Vector3(sum.x/vlen, sum.y/vlen, sum.z/vlen);
      }
      else {        
        this.center3D = this.sprite.position;
      }
    },
    updateInsideScreen: function() {
      // VIEWING FRUSTUM FILTERING
      this.center2D = this.center3D.get2D();
      if (this.isObj()) {
        // IF BOTH X OR Y INSIDE
        if (
          (this.center2D.x>=-180 && this.center2D.x<=canvasWidth+180) 
          &&
          (this.center2D.y>=0 && this.center2D.y<=canvasHeight)
           ) 
        {
          this.insideScreen = true;
        }
        // IF EITHER X OR Y IS OUT THEN MODEL IS OUTSIDE
        else {
          this.insideScreen = false;
        }
      }
      else {        
        if (this.sprite.dimensions == 2) {
          this.insideScreen = true;
        }
      }
    },
    translate: function(P) {
      if (this.isObj()) {
        // VERTICES
        for (var index=0; index<=this.vertices.length-1; index++) {
          if (P != undefined) {
            this.vertices[index].inc(P);
          }
        }

        // NORMALS
        for (var index=0; index<=this.faces.length-1; index++) {
          if (P != undefined) {          
            this.faces[index].currentNormal.inc(P);
          }
        }

        // UPDATE CAMERA IF CAMERA CHASE SELECTED
        if (this.cameraChase == true) {
          camera.translate(Vector3(P.x, P.y, P.z));
        }
      }
    },
    rotate: function(th, axis) {
      if (this.isObj()) {
        this.updateCenter3D();
    
        // VERTICES
        for (var index=0; index<=this.vertices.length-1; index++) {
          this.vertices[index] = this.vertices[index].rotate(th, this.center3D, axis);
        }
        // NORMALS
        for (var index=0; index<=this.faces.length-1; index++) {
          this.faces[index].currentNormal = this.faces[index].currentNormal.rotate(th, this.center3D, axis);
        }
      }  
    },
    // //////////
    // DRAWING
    // //////////    
    drawVertices: function() {      
      if (this.isObj()) {
        for (var index = 0; index <= this.vertices.length-1; index++) {
          this.vertices[index].draw(1);
        }
      }
    },
    drawFaces: function() {
      if (this.isObj()) {
        for (var index = 0; index <= this.faces.length-1; index++) {
          this.faces[index].update();
        }
      }
    },
    drawObject: function() {
      if (this.active) {
          if (this.isObj()) {
            this.drawFaces();
          }
          else {
            this.sprite.updateScale();
            this.sprite.draw();
          }
      }
    },    
    // ////////////
    // UPDATE
    // ////////////
    updateDistanceAndDirectionFromCamera: function() {
      if (this.isObj()) {
        this.distanceFromCamera = getDistance3(camera.getOrigin(), this.center3D);  
      }
      else {
        if (this.sprite.dimensions == 3) {
          this.distanceFromCamera = getDistance3(camera.getOrigin(), this.sprite.position);
        }
        else if (this.sprite.dimensions == 2) {
          this.distanceFromCamera = 0;
        }
      }
    },
    updateDirection: function() {
      this.currentDirection = getDirection(this.previousDirection, this.currentDirection);
      this.previousDirection = this.currentDirection;
    },
    update: function() {      
      //this.updateCenter3D();
      //this.updateDistanceAndDirectionFromCamera();
    }    
  }
}


// //////////////////////////////////////////////////////
// DATA FROM THE HOST
// //////////////////////////////////////////////////////
function receiveData(modelID, _data_) {
  try {
    var decoded = Base64.decode(_data_);  
    parseData(modelID, decoded);
  }
  catch (err) {
    profiler.log("RECEIVE DATA ERR => " + err.message);
  }
}


function parseData(modelID, _data_) {  
  var lines = _data_.split("\n");

  var resultObject = {};
  var vertices = [];
  var normals = [];
  var faces = [];
  var textureVertices = [];
  
  for(var lindex=0; lindex<=lines.length-1; lindex++) {
    //profiler.log("LINE: " + lines[lindex]);

    var splitedLine = lines[lindex].split(' ');
    // VERTICES
    if (splitedLine[0] == "v") {      
      var x = parseFloat(splitedLine[1]);
      var y = parseFloat(splitedLine[2]);
      var z = parseFloat(splitedLine[3]);
      x = (x * 100);
        x = Math.abs(x + 200);
      y = (y * 100);
        y = Math.abs(y + 200);
      z = (z * 100);
      z = Math.abs(z + 500);
      var vertex = Vector3(x,y,z);      
      vertices.push(vertex);
    }
    // NORMALS
    else if (splitedLine[0] == "vn") {
      var x = parseFloat(splitedLine[1]);
      var y = parseFloat(splitedLine[2]);
      var z = parseFloat(splitedLine[3]);
      var normal = Vector3(x,y,z);
      normals.push(normal);
    }
    // TEXTURE VERTICES
    else if (splitedLine[0] == "vt") {
      var x = parseFloat(splitedLine[1]);
      var y = parseFloat(splitedLine[2]);
      var textureVertex = Vector2(x,y);
      textureVertices.push(textureVertex);
    }
  }  
  models[modelID].vertices = vertices;
  models[modelID].normals = normals;
  models[modelID].textureVertices = textureVertices;

  // FACES
  // INCLUDING TEXTURE VERTICES AND MATERIALS
  var facesCounter = 0;
  var currentTextureMaterial = "blank";
  for(var findex=0; findex<=lines.length-1; findex++) {
    var splitedLine = lines[findex].split(' ');
    if (splitedLine[0] == "f") {
      try {
        // VERTICES REFS
        var p1RefString = splitedLine[1].split('/')[0];
        var p2RefString = splitedLine[2].split('/')[0];
        var p3RefString = splitedLine[3].split('/')[0];
        var p1Ref = parseInt(p1RefString) - 1;
        var p2Ref = parseInt(p2RefString) - 1;
        var p3Ref = parseInt(p3RefString) - 1;
        // TEXTURE VERTICES
        var t1RefString = splitedLine[1].split('/')[1];
        var t2RefString = splitedLine[2].split('/')[1];
        var t3RefString = splitedLine[3].split('/')[1];
        var t1Ref = parseInt(t1RefString) - 1;
        var t2Ref = parseInt(t2RefString) - 1;
        var t3Ref = parseInt(t3RefString) - 1;
        // NORMALS
        var n1RefString = splitedLine[1].split('/')[2];
        var n2RefString = splitedLine[2].split('/')[2];
        var n3RefString = splitedLine[3].split('/')[2];        
        var n1Ref = parseInt(n1RefString) - 1;
        var n2Ref = parseInt(n2RefString) - 1;
        var n3Ref = parseInt(n3RefString) - 1;
        // APPLY DATA
        var modelIDInt = parseInt(modelID);
        var face = Face(p1Ref,p2Ref,p3Ref,modelIDInt);    
          //face.initTexture("itest");
        face.id = facesCounter;
          // TEXTURE VERTICES 2D
          face.t1Ref = textureVertices[t1Ref];
          face.t2Ref = textureVertices[t2Ref];
          face.t3Ref = textureVertices[t3Ref];
          face.textureMaterial = currentTextureMaterial;
        // IMPORTANT!: Need to set normals per each vertex of the face, for now one normal is enough
        face.initialNormal = normals[n1Ref];
        face.applyNormal();
        faces.push(face);
        facesCounter += 1;
      }
      catch (err) {
        profiler.log("ERROR parseData.faces => " + err.message);
      }
    }
    // SET CURRENT TEXTURE MATERIAL
    else if (splitedLine[0] == "usemtl") {
      currentTextureMaterial = splitedLine[1];
    }    
  }
  models[modelID].faces = faces;
  
  //profiler.log("<=== PARSED MODEL: " + modelID);
  //profiler.log("\tVERTICES:" + vertices.length);
  //profiler.log("\tNORMALS:" + normals.length);
  //profiler.log("\tFACES:" + faces.length);  

  models[modelID].loaded = true;
  models[modelID].updateCenter3D();
  models[modelID].setSize();

  return;  
}
