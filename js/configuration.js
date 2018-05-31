//
exports = {}
zoom = 1;
cacheRectsTimes = [];
draws = 0;
cached = 0;
notCached = 0;
//
// //////////////
// CANVAS
// //////////////
var ctx = undefined;
var ctxSb = undefined;
// MAX DIMS
var maxW = parseInt($(window).width());
var maxH = parseInt($(window).height());
// HOLDERS
var w = 320;
var wClear = 320;
var wStep = w/1000;
var h = 212;
var hClear = 212;
var hStep = h/1000;
// SCALE
var scaleW;
var scaleH;
var translateByX;
// RELATIVE DIMS
var canvasWidth;
var canvasHeight;
var canvasWidthClear;
var canvasHeightClear;
var canvasWidthHalf;
var canvasHeightHalf;
//
// //////////////
// GENERAL
// //////////////
var paused = false;
var profiler;
var accReading = Vector3(0,0,0);
var accReadingPrevious = Vector3(0,0,0);
var accCounter = 0;
var vertexCounter = 0;
var collisionDetector;
var queue = {};
//
// //////////////
// DATA
// //////////////
var map;
var models = [];
var modelsCounter = 0;
var textureCache = {};
//
// //////////////
// CAMERA
// //////////////
var camera;
var occlusionCulling;
var sign = 1;
//
// //////////////
// LIGHT SOURCE
// //////////////
var lightSource;
