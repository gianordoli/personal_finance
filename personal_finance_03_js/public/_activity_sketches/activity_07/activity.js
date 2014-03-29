/*------------------ SOCKETS ------------------*/
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


/*-------------- CANVAS VARIABLES -------------*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var canvasPosition;
var mousePos;
var world;


/*--------------- DATA VARIABLES --------------*/
var activity; //Array; list of all transactions (objects)
var lineCategories;
var bubbleCategories;
var firstDay, lastDay;
var maxAmount;


/*------------------- EASING ------------------*/
var value = 0;
var targetValue = 0;
var easingSpeed = 0.05;


/*------------------- VISUALS -----------------*/
var chartBasis = 100;
var bubbleCeil = chartBasis + 32;
var bubbleScale = 7;


/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(data){
  // console.log('called setup');

  //Size
  canvasResize();  

  canvas.addEventListener('mouseup', function(evt){
    targetValue = (targetValue == 1) ? (0):(1); 
  }, false);  

  //Data
  activity = new Array();
  for(var i = 0; i < data.length; i++){
    // console.log(data[i]);
    var transaction = new Object();  //creating object
    initTransaction(transaction, data[i]);   //initializing
    activity.push(transaction);
  }

  // console.log(activity[0].date.getDate() + '/' + activity[0].date.getMonth());
  // console.log(activity[activity.length - 1].date.getDate() + '/' + activity[activity.length - 1].date.getMonth());
  firstDay = new Date(activity[activity.length - 1].date);
  lastDay = new Date(activity[0].date);

  maxAmount = getMaxAmount('debit');

  //Lines
  lineCategories = extractLineCategories(activity, 'debit');
  for(var i = 0; i < lineCategories.length; i++){
    lineCategories[i].setColor(lineCategories, i);
    lineCategories[i].setPos(activity);
  }

  //Bubbles
  bubbleCategories = extractBubbleCategories(activity, 'debit');
  for(var i = 0; i < bubbleCategories.length; i++){
    bubbleCategories[i].setColor(bubbleCategories, i);
    bubbleCategories[i].setSize();
    bubbleCategories[i].setPos();
  }

  //Box 2D
  world = createWorld();
  for(var i = 0; i < bubbleCategories.length; i++){
    createBall(world, i, bubbleCategories[i].pos, bubbleCategories[i].radius, bubbleCategories[i].color);
  }  

  update();
}

function update(){
  //Easing
  if(Math.abs(targetValue - value) > 0.0005){
    value += (targetValue - value) * easingSpeed;    
    // console.log(value);
  }
  chartBasis = map(value, 0, 1, 100, canvas.height - 200);
  bubbleCeil = chartBasis + 32;
  for(var i = 0; i < lineCategories.length; i++){
    lineCategories[i].update();
  }

  var stepping = false;
  var timeStep = 2/60;
  var iteration = 1;

  world.Step(timeStep, iteration);
  // setTimeout('step(' + (cnt || 0) + ')', 10);

  var ceilPosition = {x: 0, y: bubbleCeil };
  myCeil.SetOriginPosition( ceilPosition, 0 );
  // console.log(myCeil.m_position.y);
  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // lineCategories[12].draw();

  //Lines
  for(var i = 0; i < lineCategories.length; i++){
    lineCategories[i].draw();
  }

  //Bubbles
  drawWorld(world, ctx);

  //bubbles text
  for(var i = 0; i < bubbleCategories.length; i++){
    bubbleCategories[i].draw();
  }

  //Months
  drawMonthScale();

  request = requestAnimFrame(update);   
}

function drawMonthScale(){
  //months
  var prevMonth;
  ctx.fillStyle = 'gray';
  ctx.font = '400 21px Raleway';
  for(var i = 0; i < lineCategories[0].transactionsPerDay.length; i++){
    var month = lineCategories[0].transactionsPerDay[i].date.getMonth();
    var pos= { x: lineCategories[0].vertices[i].x,
               y: chartBasis + 21
              }
    if(month != prevMonth || prevMonth === 'undefined'){
      ctx.fillText(monthNames[month], pos.x + 10, pos.y);  
      prevMonth = month;
    }
  }
  ctx.strokeStyle = 'gray';
  ctx.textAlign = 'left';
  ctx.moveTo(0, bubbleCeil);
  ctx.lineTo(canvas.width, bubbleCeil);
  ctx.stroke();  
}


/*--------------- AUX FUNCTIONS ---------------*/
function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  marginTop = $('#title').height();
  // console.log('margin top: ' + marginTop);

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position again!
  // console.log(canvasPosition);
} 

function setColorCategory(myArray, i){
  var hue = map(i, 0, myArray.length, 0, 360);
  this.color = parseHslaColor(hue, 100, 50, 0.8);
}

var getMaxAmount = function(filter){
  var max = 0;

  for(var i = 0; i < activity.length; i++){
    if(activity[i].type == filter){
      if(activity[i].amount > max){
        max = activity[i].amount;
      }
    }
  }
  // console.log(max);
  return max;
}

var extractLineCategories = function(myArray, filter){

  var categoriesList = [];

  //1. Go through the full array of spendings
  for(var i = 0; i < myArray.length; i++){
    
    if(myArray[i].type == filter){

      var transaction = { amount: myArray[i].amount,
                          date: new Date(myArray[i].date) };

      //2. Go through the full array of categories
      var isStored = false;
      for(var j = 0; j < categoriesList.length; j++){
        //If the category is already stored...
        if(myArray[i].category == categoriesList[j].description){
          isStored = true;
          categoriesList[j].transactions.push(transaction);
          // console.log('exists: ' + myArray[i].category);
          break;
        }
      }
      
      if(!isStored){
        var categoriesObj = new Object();
        // console.log('store: ' + myArray[i].category);
        initLineCategory(categoriesObj, myArray[i].category, filter, transaction);
        categoriesList.push(categoriesObj);
      }
    }
  }
  
  //Debug
  // console.log(categoriesList);
  // for(var i = 0; i < categoriesList.length; i++){
  //   console.log('[' + i + ']' + categoriesList[i].category);
  // }
  return categoriesList;
}


var extractBubbleCategories = function(myArray, filter){

  var categoriesList = [];

  //1. Go through the full array of spendings
  for(var i = 0; i < myArray.length; i++){
    
    if(myArray[i].type == filter){

      //2. Go through the full array of categories
      var isStored = false;
      for(var j = 0; j < categoriesList.length; j++){
        //If the category is already stored...
        if(myArray[i].category == categoriesList[j].description){
          isStored = true;
          categoriesList[j].totalAmount += myArray[i].amount;
          // console.log('exists: ' + myArray[i].category);
          break;
        }
      }
      
      if(!isStored){
        var categoriesObj = new Object();
        // console.log('store: ' + myArray[i].category);
        initBubbleCategory(categoriesObj, myArray[i].category, myArray[i].amount, filter);
        categoriesList.push(categoriesObj);
      }
    }
  }
  
  //Debug
  // console.log(categoriesList);
  // for(var i = 0; i < categoriesList.length; i++){
  //   console.log('[' + i + ']' + categoriesList[i].category);
  // }
  return categoriesList;
}