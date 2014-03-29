//LINE CATEGORIES
//---------------
function initLineCategory(obj, description, type, transaction){
  //Variables
  obj.description = description;
  obj.type = type;
  obj.transactions = [];  //amount, date
  obj.transactions.push(transaction);

  obj.setTransactionsPerDay = setTransactionsPerDayLineCategory;
  obj.setPos = setPosLineCategory;
  obj.setColor = setColorCategory;
  obj.update = updateLineCategory;
  obj.draw = drawLineCategory;
}

function updateLineCategory(){
  for(var i = 0; i < this.vertices.length; i++){
    this.vertices[i].y = map(this.transactionsPerDay[i].amount, 0, maxAmount, chartBasis, 50);
  }
}

function drawLineCategory(){
  // console.log('called drawLineCategory()');
  ctx.beginPath();

  var offset = 10;
  
  for(var i = 0; i < this.vertices.length - 1; i++){
    ctx.moveTo(this.vertices[i].x, this.vertices[i].y);    
    ctx.bezierCurveTo(this.vertices[i].x + offset, this.vertices[i].y,
                      this.vertices[i + 1].x - offset, this.vertices[i + 1].y,
                      this.vertices[i + 1].x, this.vertices[i + 1].y);
  }
  ctx.strokeStyle = this.color;
  ctx.stroke();
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
}

function setPosLineCategory(){
  //3. Setting vertices positions
  var vertices = [];
  for(var i = 0; i < this.transactionsPerDay.length; i++){
    var vertex = {   x: map(daysInBetween(firstDay, this.transactionsPerDay[i].date),
                         0, daysInBetween(firstDay, lastDay) - 1,
                         margin, canvas.width - margin),
                     y: map(this.transactionsPerDay[i].amount, 0, maxAmount, chartBasis, 50)
                 };
    // console.log(pos);
    vertices.push(vertex);
  }
  this.vertices = vertices;
  // console.log('vertices: ');
  // console.log(this.vertices);
}