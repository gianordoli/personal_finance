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
  // allDebit.reverse();
  allCredit = splitArray('credit');
  // allCredit.reverse();

  //Create categories colors
  palette = extractCategories(allDebit);
  createColors(palette);

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

  var nextDate;

  ctx.save();
    ctx.translate(0, canvas.height/2);

    //Debit
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0, 0);
    for(var i = 0; i < allDebit.length; i++){
        //Get next date
        if(i < allDebit.length - 1){
          nextDate = new Date(allDebit[i+1].date);
        }

        if(allDebit[i].date.valueOf() != nextDate.valueOf()){
          var yPos = map(allDebit[i].amount, 0, maxAmount, 0, canvas.height/2);
          allDebit[i].draw(yPos);          
        }
        // console.log('this: ' + allDebit[i].date + ' | next: ' + allDebit[i].date);
    }
    ctx.lineTo(0, 0);
    ctx.fill();

    //Credit
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0, 0);
    for(var i = 0; i < allCredit.length; i++){
        //Get next date
        if(i < allCredit.length - 1){
          nextDate = new Date(allCredit[i+1].date);
        }

        if(allCredit[i].date.valueOf() != nextDate.valueOf()){
          var yPos = map(allCredit[i].amount, 0, maxAmount, 0, canvas.height/2);
          allCredit[i].draw(-yPos);          
        }
        // console.log('this: ' + allDebit[i].date + ' | next: ' + allDebit[i].date);
    }
    ctx.lineTo(0, 0);
    ctx.fill();

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
    ctx.fillStyle = parseHslaColor(120, 80, 70, 1);
    // ctx.fillRect(this.xPos, 0, 10, -y);
  }else{
    ctx.fillStyle = parseHslaColor(340, 80, 50, 1);
    // ctx.fillRect(this.xPos, 0, 10, y);
  }
  ctx.lineTo(this.xPos, y);
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
        console.log('exists: ' + myArray[i].category);
        break;
      }
    }
    
    if(!isStored){
      var paletteObj = new Object();
      // console.log('store: ' + myArray[i].category);
      paletteObj.category = myArray[i].category;
      console.log('store: ' + paletteObj.category);
      categoriesList.push(paletteObj);
    }
  }
  
  //Debug
  console.log(categoriesList.length);
  for(var i = 0; i < categoriesList.length; i++){
    console.log('[' + i + ']' + categoriesList[i].category);
  }
  return categoriesList;
}

function createColors(myArray){
  for(var i = 0; i < myArray.length; i++){
    myArray[i].hue = map(i, 0, myArray.length - 1, 0, 360);
  }

  //Debug
  for(var i = 0; i < myArray.length; i++){
    console.log('hue: ' + myArray[i].hue + ', category: ' + myArray[i].category);
  }
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

