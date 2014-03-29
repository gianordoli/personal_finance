/*--------------- CORE FUNCTIONS ---------------*/
var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec' ];

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

var daysInBetween = function(date1, date2) {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);
}