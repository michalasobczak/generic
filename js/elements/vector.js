Vector3 = function(_x,_y,_z) {
  return {
    x: parseFloat(_x),
    y: parseFloat(_y),
    z: parseFloat(_z),
    size: 1,
    color: " #000000",
    getAsSylv: function() {
      return $V([this.x, this.y, this.z]);
    },
    normalize: function() {      
      var result = this.getAsSylv().toUnitVector();      
      this.x = result.e(1);
      this.y = result.e(2);
      this.z = result.e(3);

      return this;
    },
    rotate: function(th, linePoint, lineDirection) {      
      var dir = this.getAsSylv().rotate(th, 
                    $L(
                       $V([linePoint.x,linePoint.y,linePoint.z]),
                       $V([lineDirection.x,lineDirection.y,lineDirection.z])
                      ) 
                      );
      var r = Vector3(dir.e(1), dir.e(2), dir.e(3));      
      return r;
    },
    dup: function() {
      var r = Vector3(this.x, this.y, this.z);
      return r;
    },
    multiply: function(val) {
      var r = Vector3(this.x*val, this.y*val, this.z*val);
      return r;
    },
    mul: function(val) {
      var r = Vector3(this.x*val, this.y*val, this.z*val);
      return r;
    },
    div: function(val) {
      var r = Vector3(this.x/val, this.y/val, this.z/val);
      return r;
    },
    inc: function(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    },
    dec: function(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    },
    add: function(v) {
      var r = Vector3(this.x+v.x, this.y+v.y, this.z+v.z);
      return r;
    },
    sub: function(v) {
      var r = Vector3(this.x-v.x, this.y-v.y, this.z-v.z);
      return r;
    },    
    len: function() {
      var r = this.getAsSylv().modulus();
      return r;
    },
    ang: function(v) {
      var r = this.getAsSylv().angleFrom(v.getAsSylv());
      return r;
    },
    inv: function() {
      var x = this.z;
      var z = this.x;
      var r = Vector3(x,this.y,z);
      return r;
    },
    sig: function() {
      var r = this.x + ":" + this.z;
      return r;
    },
    toString: function() {
      var r = this.x + "/" + this.y + "/" + this.z;
      return r;
    },
    get2D: function() {      
      var r = transform3Into2_NEW(this.x,this.y,this.z, camera.position.x,camera.position.y,camera.position.z, camera.angle);
      return r;
    },
    draw: function(size) {
      var S = transform3Into2_NEW(this);
      ctx.fillStyle = this.color;
      ctx.fillRect(S.x, S.y, size, size);
    }
  };
};


Vector2 = function(_x,_y) {
  return {
    x: _x,
    y: _y,
    dup: function() {
      var r = Vector2(this.x, this.y);
      return r;
    },
    sub: function(v) {
      var r = Vector2(this.x-v.x, this.y-v.y);
      return r;
    },
    div: function(val) {
      var r = Vector2(this.x/val, this.y/val);
      return r;
    },
    inc: function(v) {
      this.x += v.x;
      this.y += v.y;      
    },
    dec: function(v) {
      this.x -= v.x;
      this.y -= v.y;      
    },
    mul: function(val) {
      var r = Vector2(this.x*val, this.y*val);
      return r;
    },
    draw: function(size, color) {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, size, size);
    },    
    drawCtx: function(_ctx_, size, color) {
      _ctx_.fillStyle = color;
      _ctx_.fillRect(this.x, this.y, size, size);
    },
    toString: function() {
      var r = this.x + "/" + this.y;
      return r;
    }
  };
};
