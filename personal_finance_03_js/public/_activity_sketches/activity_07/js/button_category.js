function initBtCategory(obj, label, pos){
  //Variables
  obj.label = label;
    var padding = 5;
    ctx.font = '400 16px Raleway';
    obj.size = { x: ctx.measureText(obj.label).width + 2*padding, y: 16 + 2*padding };
  obj.pos = pos;
  obj.color = parseHslaColor(0, 0, 70, 1);

  obj.isSelected = false;
  obj.isHovered = false;

  obj.update = updateBtCategory;
  obj.draw = drawBtCategory;
}

function updateBtCategory(){
  if(this.pos.x < mousePos.x && mousePos.x < this.pos.x + this.size.x &&
     this.pos.y < mousePos.y && mousePos.y < this.pos.y + this.size.y){
    // console.log(this.label);

    this.color = parseHslaColor(0, 0, 90, 1);

    if(mouseIsDown){
      targetValue = (targetValue == 1) ? (0):(1);   
    }
  }else{
    this.color = parseHslaColor(0, 0, 70, 1);    
  }
}

function drawBtCategory(){
  ctx.fillStyle = this.color;
  ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

  ctx.fillStyle = 'black';
  ctx.font = '400 16px Raleway';
  ctx.textAlign = 'center';  
  ctx.textBaseline = 'middle'; 
  ctx.fillText(this.label, this.pos.x + this.size.x/2, this.pos.y + this.size.y/2);
}