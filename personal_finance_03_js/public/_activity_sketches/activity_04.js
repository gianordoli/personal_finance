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

var palette;  //Categories and hues


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
  // console.log(allDebit.length);  
  allCredit = splitArray('credit');

  //Create categories colors
  palette = extractCategories(allDebit);
  createColors(palette);

  //Set color
  for(var i = 0; i < allDebit.length; i++){
    allDebit[i].setColor();
  }

  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  var pos = { x: 0, y: 0 };
  var prevMonth = -1;
  for(var i = allDebit.length - 1; i > 0; i--){
    pos.x = map(i, 0, allDebit.length - 1, canvas.width, 0);
    pos.y = map(i, 0, allDebit.length - 1, canvas.height, 0);
    var drawMonth = false;
    if(allDebit[i].date.getMonth() != prevMonth){
      drawMonth = true;
      prevMonth = allDebit[i].date.getMonth();
      console.log(prevMonth);
    };
    allDebit[i].draw(pos, drawMonth);
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

  obj.setColor = setColorTransaction;
  obj.draw = drawTransaction;
}

function drawTransaction(pos, drawMonth){
  // console.log(pos);
  ctx.fillStyle = this.color;
  ctx.fillRect(pos.x, 0, canvas.width/allDebit.length, canvas.height);
  // console.log(this.date.getDate());

  if(drawMonth){
    ctx.fillStyle = 'black';
    ctx.font = '400 8px Raleway';
    ctx.textAlign = 'center';
    ctx.fillText(this.date.getMonth(), pos.x + 10, pos.y + 10);    
  }
}

function setColorTransaction(){
  for(var i = 0; i < palette.length; i++){
    if (palette[i].category == this.category){
      this.color = parseHslaColor(palette[i].hue, 100, 50, 0.5);
      break;
    };
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


//Extract categories from a given array
var extractCategories = function(myArray){

  var categoriesList = [];

  //Store the first category
  var paletteObj = new Object();
  paletteObj.category = myArray[0].category;
  categoriesList.push(paletteObj);

  //1. Go through the full array of spendings
  for(var i = 0; i < myArray.length; i++){
    // console.log(myArray[i].category);

    //2. Go through the full array of categories
    var isStored = false;
    for(var j = 0; j < categoriesList.length; j++){
      //If the category is already stored...
      if(myArray[i].category == categoriesList[j].category){
        isStored = true;
        // console.log('exists: ' + myArray[i].category);
        break;
      }
    }
    
    if(!isStored){
      var paletteObj = new Object();
      // console.log('store: ' + myArray[i].category);
      paletteObj.category = myArray[i].category;
      // console.log('store: ' + paletteObj.category);
      categoriesList.push(paletteObj);
    }
  }
  
  //Debug
  // console.log(categoriesList.length);
  // for(var i = 0; i < categoriesList.length; i++){
  //   console.log('[' + i + ']' + categoriesList[i].category);
  // }
  return categoriesList;
}

function createColors(myArray){
  for(var i = 0; i < myArray.length; i++){
    myArray[i].hue = map(i, 0, myArray.length - 1, 0, 360);
  }

  //Debug
  // for(var i = 0; i < myArray.length; i++){
  //   console.log('hue: ' + myArray[i].hue + ', category: ' + myArray[i].category);
  // }
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

