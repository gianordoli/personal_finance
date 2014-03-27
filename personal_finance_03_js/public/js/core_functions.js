/*--------------- CORE FUNCTIONS ---------------*/
var dist = function(x1, y1, x2, y2){
  var angle = Math.atan2(y1 - y2, x1 - x2);
  var totalDist;
  if( (y1 - y2) == 0 ){
    totalDist = (x1 - x2) / Math.cos( angle );
  }else{
    totalDist = (y1 - y2) / Math.sin( angle );
  }
  return totalDist;
}

var map = function(value, aMin, aMax, bMin, bMax){
    var srcMax = aMax - aMin,
      dstMax = bMax - bMin,
      adjValue = value - aMin;
    return (adjValue * dstMax / srcMax) + bMin;
} 

var constrain = function(value, min, max){
  var constrained = value;
  if(value < min){
    constrained = min;
  }else if(value > max){
    constrained = max;
  }
  return constrained;
}

var parseHslaColor = function(h, s, l, a){
  var myHslColor = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a +')';
  //console.log('called calculateAngle function');
  return myHslColor;
}

//calculate radius from area
var getRadiusFromArea = function(area){
  var r = Math.sqrt(area/Math.PI);
  return r;
}