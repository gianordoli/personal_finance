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
var categories;  //Categories and hues


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

  //Create categories colors
  categories = extractCategories(activity, 'debit');

  //Set
  for(var i = 0; i < categories.length; i++){
    categories[i].setColor(categories, i);
  }

  //Box 2D
  world = createWorld();
  for(var i = 0; i < categories.length; i++){
    var pos = { x: Math.random()*canvas.width, y: Math.random()*canvas.height };
    var size = getRadiusFromArea(categories[i].totalAmount)*8;
    var color = categories[i].color;
    createBall(world, i, pos, size, color);
  }
  step();
  // draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  for(var i = 0; i < categories.length; i++){
    categories[i].draw();
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

  obj.draw = drawTransaction;
}

function drawTransaction(){
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

function drawCategory(pos){
  // var pos = { x: Math.random()*canvas.width,
  //             y: Math.random()*canvas.height };
  // ctx.fillStyle = this.color;
  // ctx.beginPath();
  // ctx.arc(pos.x, pos.y, getRadiusFromArea(this.totalAmount)*5, 0, Math.PI*2, false);
  // ctx.fill();

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(this.description, pos.x, pos.y);
}

function setColorCategory(myArray, i){
  var hue = map(i, 0, myArray.length, 0, 360);
  this.color = parseHslaColor(hue, 100, 50, 0.8);
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

