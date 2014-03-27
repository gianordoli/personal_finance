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
var maxAmount;
var allDebit;
var allCredit;


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

  maxAmount = getMaxAmount();

  //Spliting the full array into credit and debit
  allDebit = splitArray('debit');
  allCredit = splitArray('credit');
  
  //Set positions
  for(var i = 0; i < activity.length; i++){
    activity[i].setPosition();
  }

  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.save();
    ctx.translate(0, canvas.height/2);

    for(var i = 0; i < allDebit.length; i++){

        //Get next
        // if(i < activity.length - 1){
        //   nextDate = activity[i+1].date;
        // }
        
        var yPos = map(allDebit[i].amount, 0, maxAmount, 0, canvas.height/2);
        allDebit[i].draw(yPos);
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

  obj.setPosition = setPositionTransaction;
  obj.draw = drawTransaction;
}

function drawTransaction(y){
  // console.log(y);
  // console.log(this.xPos);
  if(this.type == 'credit'){
    ctx.fillStyle = parseHslaColor(120, 60, 50, 0.5);
    ctx.fillRect(this.xPos, 0, 10, -y);
  }else{
    ctx.fillStyle = parseHslaColor(340, 100, 50, 1);
    ctx.fillRect(this.xPos, 0, 10, y);
  }
}

function setPositionTransaction(){
  // console.log(daysInBetween(activity[0].date, this.date));
  this.xPos = map(daysInBetween(activity[0].date, this.date),
                  0, daysInBetween(activity[0].date, activity[activity.length - 1].date),
                  canvas.width, 0);
  // console.log(this.xPos);
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

var splitArray = function(thisType){
  var newArray = new Array();

  for(var i = 0; i < activity.length; i++){
    if(activity[i].type == thisType){
      newArray.push(activity[i]);
    }
  }
  return newArray;
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

/*--------------- LISTENERS ---------------*/
function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
}

