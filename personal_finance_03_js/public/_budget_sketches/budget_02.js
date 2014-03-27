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
var canvasPosition;



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
//   activity = new Array();
//   for(var i = 0; i < data.length; i++){
//     // console.log(data[i]);
//     var transaction = new Object();  //creating object
//     initTransaction(transaction, data[i]);   //initializing
//     activity.push(transaction);
//   }

  spending = 70;
  budget = 50;

  canvasResize();
  update();
}

function update(){
  // console.log('called update');
  // for(var i = 0; i < activity.length; i++){
  //   activity[i].update();
  // }
  
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

    var totalRadius = canvas.width * 0.25;
    var finalRadius = map(spending/budget, 0, 1, 0, totalRadius);    

    //Total circle
    ctx.fillStyle = parseHslaColor(0, 0, 90, 1);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, totalRadius, 0, Math.PI * 2, false);
    ctx.fill();

    //Outer circle
    if(finalRadius > totalRadius){
      // console.log('oi');
      var radius2 = map(value, 0, 1, 0, finalRadius);
      var hue2 = map(radius2, 0, totalRadius, 140, 55);
      var grd2 = ctx.createRadialGradient(pos.x, pos.y, radius2/2, pos.x, pos.y, radius2);
      ctx.fillStyle = grd2;
      grd2.addColorStop(0, parseHslaColor(hue2, 90, 70, 1));
      grd2.addColorStop(1, parseHslaColor(hue2, 90, 50, 1));    
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius2, 0, Math.PI * 2, false);
      ctx.fill();
    }    

    //Inner circle
    var radius = map(value, 0, 1, 0, finalRadius);
        radius = constrain(radius, 0, totalRadius);
    var hue = map(radius, 0, totalRadius, 140, 55);
        hue = constrain(hue, 55, 140);    
    var grd = ctx.createRadialGradient(pos.x, pos.y, totalRadius/2, pos.x, pos.y, totalRadius);
    grd.addColorStop(0, parseHslaColor(hue, 90, 85, 1));
    grd.addColorStop(1, parseHslaColor(hue, 90, 50, 1));

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);
    ctx.fill();

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



/*------------------ OBJECTS ------------------*/
function initTransaction(obj, data){
  //Variables
  obj.description = data.description;
  obj.category = data.category;
  obj.amount = data.amount;
  obj.date = new Date(data.date);
  obj.type = data.type;

  //Functions
  obj.update = updateTransaction;
  obj.draw = drawTransaction;
}

function updateTransaction(){
  // console.log(this);
}

function drawTransaction(x, y){
  // console.log(y);
  ctx.fillStyle = parseHslaColor(120, 50, 50, 0.2);
  ctx.beginPath();
  ctx.arc(x, y, this.amount/10, this.amount/10, 0, Math.PI*2, false);
  ctx.fill();  
}

/*--------------- AUX FUNCTIONS ---------------*/
function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  marginTop = $('#title').height();
  // console.log('margin top: ' + marginTop);

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.width = 640;
  canvas.height = 1136;
  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position again!
  // console.log(canvasPosition);
} 


/*--------------- LISTENERS ---------------*/
function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
  // update();
}

canvas.addEventListener('mouseup', function(evt){
  targetValue = (targetValue == 1) ? (0):(1); 
}, false);