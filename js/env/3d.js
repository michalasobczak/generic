require("../libs/sylvester.src.js");


matM = function(a,b) {
  var p1,p2,p3,p4,p5,p6,p7,p8,p9 = 0.0;
  p1 = a[0]*b[0] + a[1]*b[3] + a[2]*b[6];
  p2 = a[0]*b[1] + a[1]*b[4] + a[2]*b[7];
  p3 = a[0]*b[2] + a[1]*b[5] + a[2]*b[8];
  
  p4 = a[3]*b[0] + a[4]*b[3] + a[5]*b[6];
  p5 = a[3]*b[1] + a[4]*b[4] + a[5]*b[7];
  p6 = a[3]*b[2] + a[4]*b[5] + a[5]*b[8];

  p7 = a[6]*b[0] + a[7]*b[3] + a[8]*b[6];
  p8 = a[6]*b[1] + a[7]*b[4] + a[8]*b[7];
  p9 = a[6]*b[2] + a[7]*b[5] + a[8]*b[8];

  return [
    p1,p2,p3,
    p4,p5,p6,
    p7,p8,p9
  ];
}


matMV = function(a,b) {
  var p1,p2,p3 = 0.0;

  var p1 = a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  var p2 = a[3]*b[0] + a[4]*b[1] + a[5]*b[2];
  var p3 = a[6]*b[0] + a[7]*b[1] + a[8]*b[2];

  return [p1,p2,p3];
}


matS = function(a,b) {
  return [
    a[0]-b[0], a[1]-b[1], a[2]-b[2],
    a[3]-b[3], a[4]-b[4], a[5]-b[5],
    a[6]-b[6], a[7]-b[7], a[8]-b[8]
  ];
}


cacheB = {};
getB = function(dx,dy,dz) {
  var lookup = ""+dx+dy+dz;
  var existingEntry = cacheB[lookup];
  if (existingEntry !== undefined) {
    return existingEntry;
  }
  else {
    var newEntry = Vector2(0,0);
    var ezDivDz = -700 / dz;
    newEntry.x = -1*(dx*ezDivDz) + canvasWidthHalf;
    newEntry.y = dy*ezDivDz;
    cacheB[lookup] = newEntry;
    return newEntry;
  }
}

cacheT = {};
getT = function(f, val) {
  var lookup = f+val;
  var existingEntry = cacheT[lookup];
  if (existingEntry !== undefined) {
    return existingEntry;
  }
  else {
    var newEntry;
    if (f == "sin") {
      newEntry = Math.sin(val);
    }
    else if (f == "cos") {
      newEntry = Math.cos(val);
    }
    cacheT[lookup] = newEntry;
    return newEntry;
  }  
}

cacheM = {};
getM = function(th) {
  var lookup = ""+th.x+th.y+th.z;
  var existingEntry = cacheM[lookup];
  if (existingEntry !== undefined) {
    return existingEntry;
  }
  else {
    var d1 = [
      1, 0,                0                  ,
      0, getT("cos",th.x), -1*getT("sin",th.x),
      0, getT("sin",th.x), getT("cos",th.x)   ];
    var d2 = [
      getT("cos",th.y),    0, getT("sin",th.y),
      0,                   1, 0               ,
      -1*getT("sin",th.y), 0, getT("cos",th.y)];
    var d3 = [
      getT("cos",th.z), -1*getT("sin",th.z), 0,
      getT("sin",th.z), getT("cos",th.z),    0,
      0,                0,                   1];

    var d1d2 = matM(d1,d2);  
    var newEntry = matM(d1d2,d3);

    cacheM[lookup] = newEntry;
    return newEntry;
  } 
}

cacheMain = {};
transform3Into2_NEW = function(x,y,z, cx,cy,cz, th) {
  var lookup = ""+x+y+z+cx+cy+cz+th.y;
  var existingEntry = cacheMain[lookup];
  if (existingEntry !== undefined) {
    return existingEntry;
  }
  else {
    var d_1x2x3 = getM(th);

    var d4 = [
      x,
      y,
      z
    ];
    var d5 = [
      cx,
      cy,
      cz
    ];

    var d4subd5 = matS(d4,d5);
    var d = matMV(d_1x2x3, d4subd5);
    var b = getB(d[0],d[1],d[2]);
    cacheMain[lookup] = b;
    return b;
  }
}
