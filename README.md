# generic

In the repository root run the following (assuming you've got Ruby 1.9.2+ installed):

```ruby
ruby -run -ehttpd . -p8000
```

Point your browser at http://localhost:8000/html/core.html. You should see a map made of square tiles. The very first tile will have a texture applied. You can navigate camera using keyboard letters AD/WS.

Application utilizes custom made 3D rendering environment with faces texturing, occlusion culling, light source and simple collision detection. Source code has been written in early 2013. 

It is worth to look at js/env/3d.js file which contains rendering algorithms such as:

```javascript
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
```
