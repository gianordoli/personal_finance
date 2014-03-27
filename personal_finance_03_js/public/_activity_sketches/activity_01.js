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
var mousePos;



/*--------------- DATA VARIABLES --------------*/
var activity; //Array; list of all transactions (objects)
var totalDays;
var maxAmount;


/*------------------- EASING ------------------*/


/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(data){
  console.log('called setup');

  //Size
  canvasResize();

  //Listeners
  mousePos = new Object();
  canvas.addEventListener('mousemove', function(evt){
    getMousePos(evt);
  }, false);

  //Data
  activity = new Array();
  for(var i = 0; i < data.length; i++){
    // console.log(data[i]);
    var transaction = new Object();  //creating object
    initTransaction(transaction, data[i]);   //initializing
    activity.push(transaction);
  }

  totalDays = getTotalDays();
  maxAmount = getMaxAmount();

  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  var xSpacing = canvas.width/totalDays;
  var pos = { x: 0, y: 0 };
  var prevDate = new Date();

  ctx.save();
    ctx.translate(0, canvas.height/2);

    for(var i = 0; i < activity.length; i++){
      pos.y = map(activity[i].amount, 0, maxAmount, 0, canvas.height/2);
      activity[i].draw(pos.x, pos.y);

      if(activity[i].date.getDate() != prevDate.getDate()){
        prevDate = new Date(activity[i].date);
        pos.x += xSpacing;
      }
    }

  ctx.restore();
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

  obj.draw = drawTransaction;
}

function drawTransaction(x, y){
  // console.log(y);
  if(this.type == 'credit'){
    ctx.fillStyle = parseHslaColor(120, 50, 50, 1);
    ctx.fillRect(x, 0, 10, -y);
  }else{
    ctx.fillStyle = parseHslaColor(0, 50, 50, 1);
    ctx.fillRect(x, 0, 10, y);
  }
  
}
/*--------------- AUX FUNCTIONS ---------------*/
function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  marginTop = $('#title').height();
  // console.log('margin top: ' + marginTop);

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.height = 640;
  canvas.width = 1136;
  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position again!
  // console.log(canvasPosition);
} 


var getTotalDays = function(){
  var nDays = 0;
  var prevDate = new Date();
  for(var i = 0; i < activity.length; i++){
    if(activity[i].date.getDate() != prevDate.getDate()){
      // console.log(activity[i].date);
      nDays ++;
      prevDate = new Date(activity[i].date);
    }
  }
  console.log(nDays);
  return nDays;
}

var getMaxAmount = function(){
  var max = 0;

  for(var i = 0; i < activity.length; i++){
    if(activity[i].amount > max){
      max = activity[i].amount;
    }
  }
  console.log(max);
  return max;
}

/*--------------- LISTENERS ---------------*/
function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
}

