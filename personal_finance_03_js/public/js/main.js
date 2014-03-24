var socket = io.connect('http://localhost:9001');

$(document).ready(function(){   //When the document is ready...
  console.log('Called server.');
  socket.emit('load', true);
});

//When data comes in through the port
socket.on('write', function(data) {
  console.log(data);
});

function processData(data){
  // console.log(data);
  var rawData = data.split(/\r\n|\n/);
  console.log(rawData);
//   for (int i = 1; i < rawData.length; i++) {
//     String[] thisRow = split(rawData[i], "\t");
// //    println(thisRow);
//     String description = thisRow[1];
//     String category = thisRow[5];    
//     float amount = parseFloat(thisRow[3]);
//     String dateString = thisRow[0];
//     int month = parseInt(dateString.substring(0, dateString.indexOf('/')));
// //    println(month);
//     dateString = dateString.substring(dateString.indexOf('/') + 1);
// //    println(dateString);    
//     int day = parseInt(dateString.substring(0, dateString.indexOf('/')));
// //    println(day);    
//     int year = parseInt(dateString.substring(dateString.indexOf('/') + 1));
// //    println(dateString);

//     String type = trim(thisRow[4]);
// //    println(type);
//     if(!type.equals("credit")){
//       activity.add(new Transaction(description, category, amount, year, month, day));
//     }
//   }   
}

/*---------- REQUEST ANIMATION FRAME ----------*/
var request;
window.requestAnimFrame = (function(callback) {
  return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
          function(callback) {
              return window.setTimeout(callback, 1000 / 60);
          };
})();
/*---------------------------------------------*/

/*-------------- CANVAS VARIABLES -------------*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var canvasPosition;

setup();

/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(){
  console.log('called setup');
  canvasResize();

  update();
}

function update(){
  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.fillRect(0, 0, canvas.width, canvas.height); 

  // request = requestAnimFrame(update);   
}

var calculateDistance = function(x1, y1, x2, y2){
  var angle = Math.atan2(y1 - y2, x1 - x2);
  var dist;
  if( (y1 - y2) == 0 ){
    dist = (x1 - x2) / Math.cos( angle );
  }else{
    dist = (y1 - y2) / Math.sin( angle );
  }
  return dist;
} 

function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  marginTop = $('#title').height();
  // console.log('margin top: ' + marginTop);

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.width = 1136;
  canvas.height = 640;
  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position again!
  console.log(canvasPosition);
} 

var parseHslaColor = function(h, s, l, a){
  var myHslColor = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a +')';
  //console.log('called calculateAngle function');
  return myHslColor;
}

function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
  update();
}