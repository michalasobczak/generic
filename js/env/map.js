var Map = function() {
  profiler.log("Map - new");
  return {
    zeroPosition: Vector3(0,0,0),
    setZero: function(v) {
      this.zeroPosition.x = v.x-100;
      this.zeroPosition.y = v.y;
      this.zeroPosition.z = v.z-100;
    },
    getZero: function() {
      return this.zeroPosition.dup();
    },
    collectVisiblesCounter: 0,
    cols: 10,
    rows: 10,    
    size: (this.cols*this.rows),
    baseSize: 0,
    scale: 0,
    startCol: 0,
    startRow: 0,
    sectors: {},
    // ////////////
    // LEVELS
    // ////////////
    currentLevelIndex: 0,
    getCurrentLevelNumber: function() {
      return this.currentLevelIndex+1;
    },
    getCurrentLevel: function() {
      return this.levels[this.currentLevelIndex];
    },
    levels: [
      {
         enemiesLeft: 6,
         maxEnemiesAtOnce: 1,         
         data: [[2,2,2,2,2,2,2,2,2,2],
            [1,1,0,1,1,1,1,1,1,2],
            [1,1,0,1,1,1,1,1,1,2],
            [1,1,0,1,1,1,1,1,1,2],
            [1,1,0,1,1,1,1,1,1,2],
            [1,1,0,1,1,1,1,1,1,2],
            [1,1,0,1,1,1,1,1,1,2],
            [1,1,1,1,1,1,1,1,1,2],
            [1,1,1,1,1,1,1,1,1,2],
            [2,2,2,2,2,2,2,2,2,2]]
      },
      {
         enemiesLeft: 20,
         maxEnemiesAtOnce: 4,
         data:[[2,2,2,2,2,2,2,2,2,2],
           [2,1,1,1,2,2,1,1,1,2],
           [2,1,1,1,2,2,1,1,1,2],
           [2,1,1,1,2,2,1,1,1,2],
           [2,1,1,1,2,2,1,1,1,2],
           [2,1,1,1,2,2,1,1,1,2],
           [2,1,1,1,2,2,1,1,1,2],
           [2,1,1,1,1,1,1,1,1,2],
           [2,1,1,1,1,1,1,1,1,2],
           [2,2,2,2,2,2,2,2,2,2]]
      }
    ],    
    getRandomSectorPosition: function() {
      var randomX = getRandomNumberBetween1And10() - 1;
      var randomZ = getRandomNumberBetween1And10() - 1;
      return Vector3(randomX,0,randomZ);
    },
    getNonOccupiedRandomSectorPosition: function() {
      while (true) {
        var randomSectorPosition = this.getRandomSectorPosition();        
        var sector = this.sectors[randomSectorPosition.sig()];

        if (sector.type == 1) {
          return randomSectorPosition;
        }
      }
    },
    // ////////////////////
    // PATH FINDING
    // ////////////////////
    clearColouring: function() {
      for (var x=0; x<=this.cols-1; x++) {
        for (var z=0; z<=this.rows-1; z++) {
          var sector = this.sectors[x + ":" + z];
          if (sector.type == 2) {
            //models[sector.modelRef].setColor("red");
          }
          else {
            //models[sector.modelRef].setColor("black");
          }
        }
      }
    },
    pathFindingGrid: undefined,
    updatePathFindingGrid: function() {      
      this.pathFindingGrid = new PF.Grid(this.cols, this.rows);

      // PARSE MAP MODELS
      for (var x=0; x<=this.cols-1; x++) {
        for (var z=0; z<=this.rows-1; z++) {
          var sector = this.sectors[x + ":" + z];
          // WALL
          if (sector.type == 2) {
            this.pathFindingGrid.setWalkableAt(x,z,false);            
          }
        }
      }

      // PARSE OTHER ENEMIES        
    },
    // ////////////
    // NON-LEVEL
    // ////////////
    collectVisibles: function() {
      this.collectVisiblesCounter++;
      var counter = 0;
      // clear visibles
      occlusionCulling.sortArray = [];
      // set new visibles
      for (var index=0; index<=models.length-1; index++) {
        var model = models[index];
        if (model.active) {
          model.updateInsideScreen();
          model.updateDistanceAndDirectionFromCamera();
          if (this.collectVisiblesCounter % model.center3DUpdateInterval == 0) {
            model.updateCenter3D();
          }

          // add model as visible to future occlusion culling sorting
          if (model.insideScreen == true && model.distanceFromCamera <= camera.distanceToDraw) {
            occlusionCulling.sortArray.push({"modelID":index, "distance":model.distanceFromCamera});
            counter++;
          }
        }
      }
    },
    // ///////////////
    // CREATE MODELS
    // ///////////////
    create: function() {
      // CREATE FLOOR TILING
      for (var col=0; col<=this.cols-1; col++) {
        for (var row=0; row<=this.rows-1; row++) {  
          models.push(Model("plane", modelsCounter, "obj"));  
          models[modelsCounter-1].center3DUpdateInterval = 10;          
          var  sectorLookup = col + ":" + row;
          var sector = MapSector();          
          sector.modelRef = modelsCounter-1;
            sector.type = this.getCurrentLevel().data[col][row];
          models[modelsCounter-1].sectorType = sector.type;
          this.sectors[sectorLookup] = sector;
        }
      }

      profiler.log("Map - created all the models");
    },
    load: function() {      
      for(var mindex=0; mindex<=models.length-1; mindex++) {
        var mod = models[mindex];
        mod.getData();
      }
    },
    // ///////////////////
    // POSITION MODELS    
    // ///////////////////
    applyPositioning: function() {
      // POSITIONING PARAMETERS
      this.baseSize = 200;
      this.scale = this.baseSize*1.0;

      // POSITION FLOOR TILING
      var counter = 0;
      for (var cindex=0; cindex<=this.cols-1; cindex++) {
        for (var rindex=0; rindex<=this.rows-1; rindex++) {
          models[counter].translate(Vector3(this.startCol + cindex*this.scale, 0, this.startRow + rindex*this.scale));          
          models[counter].updateCenter3D();          
          counter++;
        }
      }

      // ZERO POSITION SET    
      var sector = this.sectors["0:0"];
      profiler.log("SECTOR => " + models[sector.modelRef].center3D.toString());
      this.setZero(models[sector.modelRef].center3D);

      profiler.log("Map - applied position on all the models");
    }    
  };
}
