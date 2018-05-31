getDirection = function(p1,p2) {  
  return p2.sub(p1);
} // getDirection
//
getDirection2 = function(p1,p2) {
  return p2.sub(p1);
} // getDirection2
//
getDistance3 = function(a, b) {
  var xDiff = Math.abs(b.x - a.x);
  var yDiff = Math.abs(b.y - a.y);
  var zDiff = Math.abs(b.z - a.z);
  var diff = Math.sqrt(
               Math.pow(xDiff, 2) 
               + 
               Math.pow(yDiff, 2)
               +
               Math.pow(zDiff, 2)
             ); 
  return diff;
} // getDistance3
//
getDistance2 = function(a, b) {
  var xDiff = Math.abs(b.x - a.x);
  var yDiff = Math.abs(b.y - a.y);
  var diff = Math.sqrt(
               Math.pow(xDiff, 2) 
               +
               Math.pow(yDiff, 2)         
             ); 
  return diff;
} // getDistance2
//
getDotProduct = function(v1, v2) {
  return (v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
} // getDotProduct
//
clearCanvas = function() {
  ctx.clearRect(0, 0, maxW, maxH);
} // clearCanvas
//
getStatistics = function() {
} // getStatistics
//
getRandomNumberBetween1And10 = function() {
  return Math.floor((Math.random()*10)+1);
} // getRandomNumberBetween1And10
//
getSectorPosition = function(v) {
  var zero = map.getZero();
  var xDiff = Math.abs(v.x - zero.x);
  var zDiff = Math.abs(v.z - zero.z);
  //
  var x = parseInt((xDiff/200));
  var y = 0;
  var z = parseInt((zDiff/200));
  return Vector3(x,y,z);
} // getSectorPosition
//
getRealPosition = function(v) {
  var zero = map.getZero();
  var x = zero.x + (v.x*200);
  var y = 200;
  var z = zero.z + (v.z*200);
  return Vector3(x,y,z);
} // getRealPosition
//
degreesToRadians = function(deg) {
  return (deg * (Math.PI/180));
} // degreesToRadians
//
radiansToDegrees = function(rad) {
  return (rad * (180/Math.PI));
} // radiansToDegrees
//
checkIntersection = function(cameraOrigin, cameraDirection, sphereCenter, radius) {
  var result = [];
  //
  var cameraOrigin_SphereCenter_dir = getDirection(cameraOrigin, sphereCenter);
  var cameraOrigin_SphereCenter_dist = getDistance3(cameraOrigin, sphereCenter);
  var angle = cameraOrigin_SphereCenter_dir.ang(cameraDirection);
  var beta = radiansToDegrees(angle);
  var alfa = 90 - beta;
  var c = cameraOrigin_SphereCenter_dist;
  var a = c * Math.sin(degreesToRadians(alfa));
  var b = c * Math.cos(degreesToRadians(alfa));
  //
  if (b <= radius) {
    result.push(true);
  } // if
  else {
    result.push(false);
  } // else
  //
  result.push(c);
  return result;
} // checkIntersection
