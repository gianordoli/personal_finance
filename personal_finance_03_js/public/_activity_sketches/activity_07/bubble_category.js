//BUBBLE CATEGORIES
//-----------------
function initBubbleCategory(obj, description, totalAmount, type){
  //Variables
  obj.description = description;
  obj.totalAmount = totalAmount;
  obj.type = type;

  obj.pos = new Object();
  obj.radius = 0;

  obj.setColor = setColorCategory;
  obj.setPos = setPosBubbleCategory;
  obj.setSize = setSizeBubbleCategory;

  obj.update = updateBubbleCategory;
  obj.draw = drawBubbleCategory;
}

function setPosBubbleCategory(){
  this.pos = { x: this.radius + margin + Math.random() * (canvas.width - 2*(this.radius + margin)),
               y: this.radius + bubbleCeil + Math.random() * (canvas.height - bubbleCeil - 2*(this.radius + margin)) };
}

function setSizeBubbleCategory(){
  this.radius = getRadiusFromArea(this.totalAmount)*bubbleScale;
}

function updateBubbleCategory(pos){
  this.pos = pos;
}

function drawBubbleCategory(){
  // console.log('called drawBubbleCategory');
  // ctx.fillStyle = this.color;
  // ctx.beginPath();
  // ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, false);
  // ctx.fill();
  var message = this.description;
  ctx.fillStyle = 'black';
  ctx.font = '400 16px Raleway';
  ctx.textAlign = 'center';  
  if(message.indexOf(' ') != -1){
    var newMessage = message.substr(0, message.indexOf(' '));
    ctx.fillText(newMessage, this.pos.x, this.pos.y - 8);
    newMessage = message.substr(message.indexOf(' ') + 1);
    ctx.fillText(newMessage, this.pos.x, this.pos.y + 8);
  }else{
    ctx.fillText(this.description, this.pos.x, this.pos.y);  
  }
}