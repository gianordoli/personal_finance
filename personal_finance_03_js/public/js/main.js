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



/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(data){
  console.log('called setup');
  activity = new Array();
  for(var i = 0; i < data.length; i++){
    // console.log(data[i]);
    var transaction = new Object();  //creating object
    initTransaction(transaction, data[i]);   //initializing
    activity.push(transaction);
  }
  canvasResize();
  update();
}

function update(){
  for(var i = 0; i < activity.length; i++){
    activity[i].update();
  }
  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  var ySpacing = 20;
  var x = 100;
  var y = 0;
  for(var i = 0; i < activity.length; i++){
    activity[i].draw(x, y);
    y += ySpacing;
    if(y > canvas.height){
      y = 0;
      x += 200;
    }
  }
  // request = requestAnimFrame(update);   
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
  // ctx.arc(x, y, 5, 5, 0, Math.PI*2, false);
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