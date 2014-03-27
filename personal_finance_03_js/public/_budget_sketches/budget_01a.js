//1. Set up socket connection

var socket = io.connect('http://localhost:9001');

//2. Whe the document is ready, ask server for data
$(document).ready(function(){
  console.log('Called server.');
  socket.emit('load', true);
});

//3. When data comes in through the port
socket.on('write', function(data) {
  // console.log(data);
  setup(data);
});


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


/*-------------- CANVAS VARIABLES -------------*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var canvasPosition = canvas.getBoundingClientRect();



/*--------------- DATA VARIABLES --------------*/
var activity; //Array; list of all transactions (objects)
var spending;
var budget;

/*------------------- EASING ------------------*/
var value = 0;
var targetValue = 1;
var easingSpeed = 0.05;


/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(data){
  console.log('called setup');

  spending = 70;
  budget = 50;

  update();
}

function update(){
  
  //Easing
  if(Math.abs(targetValue - value) > 0.0005){
    value += (targetValue - value) * easingSpeed;    
    // console.log(value);
  }
  // console.log(budget/spending);
  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Canvas frame
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  //Chart
  var pos = { x: canvas.width/2, y: canvas.height/2 };
  var strokeWidth = 80;
  var finalAngle = map(spending/budget, 0, 1, - Math.PI * 0.5, Math.PI * 1.5);

    //Inner arc
    var angle = map(value, 0, 1, - Math.PI * 0.5, finalAngle);
    var step = Math.PI/100;
    // var limit = (angle > Math.PI * 1.5) ? (Math.PI * 1.5) : (angle);
    for(var i = - Math.PI * 0.5; i < angle; i += step){
      var radius = canvas.width * 0.25;
      var hue = map(i, - Math.PI * 0.5, Math.PI * 1.5, 140, 60);
          // hue = constrain(hue, 55, 140);

      if(i > Math.PI * 1.5){
        radius += strokeWidth;
      }
      ctx.strokeStyle = parseHslaColor(hue, 90, 50, 1);
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, i, i+step, false);
      ctx.stroke();          
    }

  //Text
  var message;
  var fontSize = 21;
  var textPos = { x: pos.x, y: pos.y - fontSize };
  ctx.font = '400 ' + fontSize + 'px Raleway';
  ctx.fillStyle = parseHslaColor(0, 0, 50, value);
  ctx.textAlign = 'center';

  if(budget > spending){
    message = 'Your savings are';
  }else{
    message = 'You overspent';
  }
  ctx.fillText(message, textPos.x, textPos.y);
  
  fontSize = 42;  
  textPos.y += fontSize;
  ctx.font = '600 ' + fontSize + 'px Raleway';
  message = '$' + Math.abs((budget - spending));
  ctx.fillText(message, textPos.x, textPos.y);
  
  fontSize = 21;  
  textPos.y += fontSize * 1.2;
  ctx.font = '400 ' + fontSize + 'px Raleway';  
  message = 'today';
  ctx.fillText(message, textPos.x, textPos.y);

  request = requestAnimFrame(update);
}

canvas.addEventListener('mouseup', function(evt){
  targetValue = (targetValue == 1) ? (0):(1); 
}, false);