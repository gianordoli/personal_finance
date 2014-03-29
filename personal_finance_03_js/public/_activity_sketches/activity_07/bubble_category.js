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
  obj.draw = drawBubbleCategory;
}

function setPosBubbleCategory(){
  this.pos = { x: this.radius + Math.random() * (canvas.width - 2*this.radius),
               y: this.radius + bubbleCeil + Math.random() * (canvas.height - bubbleCeil - 2*this.radius) };
}

function setSizeBubbleCategory(){
  this.radius = getRadiusFromArea(this.totalAmount)*bubbleScale;
}

function drawBubbleCategory(pos){
  this.pos = pos;
  // console.log('called drawBubbleCategory');
  // ctx.fillStyle = this.color;
  // ctx.beginPath();
  // ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, false);
  // ctx.fill();
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(this.description, this.pos.x, this.pos.y);  
}