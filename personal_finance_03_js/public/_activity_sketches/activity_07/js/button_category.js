function initBtCategory(obj, label, pos){
  //Variables
  obj.label = label;
    var padding = 5;
    ctx.font = '400 16px Raleway';
    obj.size = { x: ctx.measureText(obj.label).width + 2*padding, y: 16 + 2*padding };
  obj.pos = pos;
  obj.color = parseHslaColor(0, 0, 70, 1);

  obj.update = updateBtCategory;
  obj.draw = drawBtCategory;

  obj.checkMouse = checkMouseBtCategory;
}

function updateBtCategory(){
  // this.checkMouse();
  if(this.checkMouse()){
    this.color = parseHslaColor(0, 0, 90, 1);
    canvas.style.cursor = 'pointer';    
  }else{
    this.color = parseHslaColor(0, 0, 70, 1);
    canvas.style.cursor = 'default'; 
  }
}

var checkMouseBtCategory = function(){
  var isHovered = false;
  if(this.pos.x < mousePos.x && mousePos.x < this.pos.x + this.size.x &&
     this.pos.y < mousePos.y && mousePos.y < this.pos.y + this.size.y){
    // console.log(this.label);
    isHovered = true;
  }else{
    isHovered = false;  
  } 
  return isHovered; 
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