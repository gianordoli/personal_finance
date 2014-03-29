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
var categories;
var lineCategories;
var firstDay, lastDay;
var maxAmount;


/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(data){
  console.log('called setup');

  //Size
  canvasResize();

  //Listeners
  mousePos = new Object();
  // canvas.addEventListener('mouseup', function(evt){
  //   isPressed = false;  // Set my "isPressed" variable to false
  //   getMousePos(evt);
  // }, false);    

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

  //Create categories colors
  categories = extractCategories(activity, 'debit');

  lineCategories = extractLineCategories(activity, 'debit');
  for(var i = 0; i < lineCategories.length; i++){
    lineCategories[i].setColor(lineCategories, i);
    lineCategories[i].setPos(activity);
  }

  //Set
  for(var i = 0; i < categories.length; i++){
    categories[i].setColor(categories, i);
  }

  for(var i = 0; i < categories.length; i++){
    var pos = { x: Math.random()*canvas.width, y: Math.random()*canvas.height };
    var size = getRadiusFromArea(categories[i].totalAmount)*8;
    categories[i].pos = pos;
    categories[i].size = size;
  }
  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // for(var i = 0; i < categories.length; i++){
  //   categories[i].draw();
  // }

  for(var i = 0; i < lineCategories.length; i++){
    lineCategories[i].draw();
  }

  // request = requestAnimFrame(update);   
}

/*------------------ OBJECTS ------------------*/
//TRANSACTIONS
//------------
function initTransaction(obj, data){
  //Variables
  obj.description = data.description;
  obj.category = data.category;
  obj.amount = data.amount;
  obj.date = new Date(data.date);
  obj.type = data.type;
}


//CATEGORIES
//----------
function initCategory(obj, description, totalAmount, type){
  //Variables
  obj.description = description;
  obj.totalAmount = totalAmount;
  obj.type = type;

  obj.setColor = setColorCategory;
  obj.draw = drawCategory;
}

function drawCategory(){
  // var pos = { x: Math.random()*canvas.width,
  //             y: Math.random()*canvas.height };
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, getRadiusFromArea(this.totalAmount)*5, 0, Math.PI*2, false);
  ctx.fill();

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(this.description, this.pos.x, this.pos.y);
}

function setColorCategory(myArray, i){
  var hue = map(i, 0, myArray.length, 0, 360);
  this.color = parseHslaColor(hue, 100, 50, 0.8);
}


//LINE CATEGORIES
//---------------
function initLineCategory(obj, description, type, transaction){
  //Variables
  obj.description = description;
  obj.type = type;
  obj.transactions = [];  //amount, date
  obj.transactions.push(transaction);

  obj.setPos = setPosLineCategory;
  obj.setColor = setColorCategory;
  obj.draw = drawLineCategory;
}

function drawLineCategory(){
  console.log('called drawLineCategory()');
  ctx.beginPath();
  ctx.lineTo(0, canvas.height);
  for(var i = 0; i < this.vertices.length; i++){
    ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    // console.log(this.vertices[i].x);
  }
  ctx.strokeStyle = this.color;
  ctx.stroke();
}

function setPosLineCategory(){
  // console.log(this.description);

  //1. Creating empty array with all dates and 0 amount
  var transactionsPerDay = [];
  // console.log('max days difference: ' + daysInBetween(firstDay, lastDay));
  for(var i = 0; i < daysInBetween(firstDay, lastDay); i ++){
    var obj = new Object();
    obj.date = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()+i);
    obj.amount = 0;
    transactionsPerDay.push(obj);
  }  

  //2. Calculate total amount per day
  for(var i = 0; i < transactionsPerDay.length; i++){
    for(var j = 0; j < this.transactions.length; j++){
      if(transactionsPerDay[i].date.valueOf() == this.transactions[j].date.valueOf()){
        transactionsPerDay[i].amount += this.transactions[j].amount;
      }
    }
  }
  //Debug
  // for(var i = 0; i < transactionsPerDay.length; i ++){
  //   console.log(transactionsPerDay[i].date.toDateString() + ': $ ' + transactionsPerDay[i].amount);
  // }    
  this.transactionsPerDay = transactionsPerDay;


  //3. Setting vertices positions
  var vertices = [];
  for(var i = 0; i < transactionsPerDay.length; i++){
    var vertex = {   x: map(daysInBetween(firstDay, transactionsPerDay[i].date),
                         0, daysInBetween(firstDay, lastDay),
                         0, canvas.width),
                     y: map(transactionsPerDay[i].amount, 0, maxAmount, canvas.height, 0)
                 };
    // console.log(pos);
    vertices.push(vertex);
  }
  this.vertices = vertices;
  // console.log('vertices: ');
  // console.log(this.vertices);
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
  console.log(max);
  return max;
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
  console.log(categoriesList);
  // for(var i = 0; i < categoriesList.length; i++){
  //   console.log('[' + i + ']' + categoriesList[i].category);
  // }
  return categoriesList;
}


//Extract categories from a given array
var extractCategories = function(myArray, filter){

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
        initCategory(categoriesObj, myArray[i].category, myArray[i].amount, filter);
        categoriesList.push(categoriesObj);
      }
    }
  }
  
  //Debug
  console.log(categoriesList);
  // for(var i = 0; i < categoriesList.length; i++){
  //   console.log('[' + i + ']' + categoriesList[i].category);
  // }
  return categoriesList;
}

/*--------------- LISTENERS ---------------*/
function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
  // createBall(world, mousePos.x, mousePos.y);
}

