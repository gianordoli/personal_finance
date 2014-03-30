//BUBBLE CATEGORIES
//-----------------
function initBubbleCategory(obj, description, totalAmount, type){
  //Variables
  obj.description = description;
  obj.totalAmount = totalAmount;
  obj.type = type;
  obj.isSelected = true;

  obj.pos = new Object();
  obj.radius = 0;

  obj.setColor = setColorCategory;
  obj.setPos = setPosBubbleCategory;
  obj.setSize = setSizeBubbleCategory;
  obj.checkMouse = checkMouseBubleCategory;

  obj.update = updateBubbleCategory;
  obj.draw = drawBubbleCategory;
}

function updateBubbleCategory(pos){
  this.radius = map(value, 0, 1, getRadiusFromArea(this.totalAmount)*bubbleScale, 40);
  this.pos = pos;
}

function drawBubbleCategory(){
  // console.log('called drawBubbleCategory');
  // ctx.fillStyle = this.color;
  // ctx.beginPath();
  // ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, false);
  // ctx.fill();
  var message = this.description;
  ctx.fillStyle = 'white';
  ctx.font = '400 16px Raleway';
  ctx.textAlign = 'center';  
  ctx.textBaseline = 'middle';  
  if(message.indexOf(' ') != -1){
    var newMessage = message.substr(0, message.indexOf(' '));
    ctx.fillText(newMessage, this.pos.x, this.pos.y - 8);
    newMessage = message.substr(message.indexOf(' ') + 1);
    ctx.fillText(newMessage, this.pos.x, this.pos.y + 8);
  }else{
    ctx.fillText(this.description, this.pos.x, this.pos.y);  
  }
}

function checkMouseBubleCategory(index){
  if(dist(mousePos.x, mousePos.y, this.pos.x, this.pos.y) < this.radius){
    // console.log(this.description);
    this.isSelected = (this.isSelected) ? (0):(1);
    // console.log(this.isSelected);
    lineCategories[index].isSelected = (lineCategories[index].isSelected) ? (0):(1);
    console.log(lineCategories[index].isSelected);
  }
}

function setPosBubbleCategory(){
  this.pos = { x: this.radius + margin + Math.random() * (canvas.width - 2*(this.radius + margin)),
               // y: this.radius + bubbleCeil + Math.random() * (canvas.height - bubbleCeil - 2*(this.radius + margin)) };
               y: Math.random() * (canvas.height - 2*(this.radius + margin)) };
}

function setSizeBubbleCategory(){
  this.radius = getRadiusFromArea(this.totalAmount)*bubbleScale;
}