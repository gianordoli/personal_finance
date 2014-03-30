//LINE CATEGORIES
//---------------
function initLineCategory(obj, description, type, transaction){
  //Variables
  obj.description = description;
  obj.type = type;
  obj.transactions = [];  //amount, date
  obj.transactions.push(transaction);

  obj.isSelected = true;

  obj.setTransactionsPerDay = setTransactionsPerDayLineCategory;
  obj.setPos = setPosLineCategory;
  obj.setColor = setColorLineCategory;
  obj.update = updateLineCategory;
  obj.draw = drawLineCategory;
}

function updateLineCategory(myArray, index){
  //update y coordinates
  for(var i = 0; i < this.vertices.length; i++){

    var prevSum = 0;
    for(var j = 0; j < index; j++){
      if(myArray[j].isSelected){
        prevSum += myArray[j].transactionsPerDay[i].amount;
      }
    }
    prevSum += this.transactionsPerDay[i].amount;

    // this.vertices[i].y = map(this.transactionsPerDay[i].amount, 0, maxAmount, chartBasis, 50);
    this.vertices[i].y = map(prevSum, 0, maxAmountAday, chartBasis, 50);
  }
}

function drawLineCategory(){
  // console.log('called drawLineCategory()');
  // console.log(this.vertices[0]);
  // console.log(this.vertices[this.vertices.length - 1].x);
  ctx.fillStyle = 'black';

  if(this.isSelected){
    ctx.beginPath();

    // ctx.moveTo(0, chartBasis);
    // ctx.bezierCurveTo(offset, chartBasis,
    //                     this.vertices[0].x - offset, this.vertices[0].y,
    //                     this.vertices[0].x, this.vertices[0].y);   

    for(var i = 0; i < this.vertices.length - 1; i++){
      // ctx.bezierCurveTo(this.vertices[i].x + offset, this.vertices[i].y,
      //                   this.vertices[i + 1].x - offset, this.vertices[i + 1].y,
      //                   this.vertices[i + 1].x, this.vertices[i + 1].y);        
      ctx.fillText(i, this.vertices[i].x, this.vertices[i].y);
    }

    // ctx.lineTo(canvas.width - margin, chartBasis);
    // ctx.fillStyle = this.color;
    // ctx.fill();
  }
  // else{
  //   console.log('not selected');
  // }
}

function setTransactionsPerDayLineCategory(){
  // console.log(this.description);

  //1. Creating empty array with all dates and 0 amount
  var transactionsPerDay = [];
  // console.log('max days difference: ' + daysInBetween(firstDay, lastDay));
  for(var i = 0; i < daysInBetween(firstDay, lastDay); i ++){
    var obj = new Object();
    obj.date = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()+i);
    obj.amount = 0;
    // console.log(obj.date.toDateString());
    transactionsPerDay.push(obj);
  }  

  //2. Calculate total amount per day
  for(var i = 0; i < transactionsPerDay.length; i++){
    // console.log('Date: ' + transactionsPerDay[i].date.toDateString());
    for(var j = 0; j < this.transactions.length; j++){
      // console.log('this amount: ' + this.transactions[j].amount);
      if(transactionsPerDay[i].date.toDateString() == this.transactions[j].date.toDateString()){
        // console.log('sum!');
        transactionsPerDay[i].amount += this.transactions[j].amount;
      }
    }
  }
  //Debug
  // for(var i = 0; i < transactionsPerDay.length; i ++){
  //   console.log(transactionsPerDay[i].date.toDateString() + ': $ ' + transactionsPerDay[i].amount);
  // }    
  this.transactionsPerDay = transactionsPerDay;
}

function setColorLineCategory(myArray, i){
  var hue = map(i, 0, myArray.length, 360, 0);
  var brightness = 50;
  var saturation = 100;
  if(i % 2 == 0){
    brightness = 80;
  }
  this.color = parseHslaColor(hue, saturation, brightness, 1);
}

function setPosLineCategory(myArray, index){
  //3. Setting vertices positions
  var vertices = [];
  for(var i = 0; i < this.transactionsPerDay.length; i++){
    console.log(daysInBetween(firstDay, this.transactionsPerDay[i].date));
    // console.log(this.transactionsPerDay[i].date.toDateString());
    // console.log(firstDay.toDateString());
    console.log(daysInBetween(this.transactionsPerDay[i].date, firstDay));
    // console.log('---------------------------------------');
    var vertex = {   x: map(daysInBetween(firstDay, this.transactionsPerDay[i].date),
                         0, daysInBetween(firstDay, lastDay),
                         margin + offset, canvas.width - margin - offset),
                     // y: map(this.transactionsPerDay[i].amount, 0, maxAmount, chartBasis, 50)
                     // y: map(prevSum, 0, maxAmountAday, chartBasis, 50)
                     y: 0
                 };
    // console.log(pos);
    vertices.push(vertex);
  }
  this.vertices = vertices;
  // console.log('vertices: ');
  // console.log(this.vertices);
}