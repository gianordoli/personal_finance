//BUBBLE CATEGORIES
//-----------------
function initBubbleCategory(obj, description, totalAmount, type){
  //Variables
  obj.description = description;
  obj.totalAmount = totalAmount;
  obj.type = type;
  obj.isSelected = true;
  obj.isHovered = false;

  obj.pos = new Object();
  obj.radius = 0;

  obj.setColor = setColorBubbleCategory;
  obj.setPos = setPosBubbleCategory;
  obj.setSize = setSizeBubbleCategory;
  obj.checkMouse = checkMouseBubleCategory;

  obj.update = updateBubbleCategory;
  obj.draw = drawBubbleCategory;
}

function updateBubbleCategory(pos){
  this.radius = map(value, 0, 1, getRadiusFromArea(this.totalAmount)*bubbleScale, 40);
  this.pos = pos;
  // console.log(this.color);
  // if(this.checkMouse()){
  //   this.color = parseHslaColor(0, 0, 90, 1);
  //   canvas.style.cursor = 'pointer';    
  // }else{
  //   this.color = parseHslaColor(0, 0, 70, 1);
  //   canvas.style.cursor = 'default'; 
  // }
}

function drawBubbleCategory(){
  // console.log('called drawBubbleCategory');
  // ctx.fillStyle = this.color;
  // ctx.beginPath();
  // ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, false);
  // ctx.fill();
  var message = this.description;
  // ctx.fillStyle = 'white';
  ctx.fillStyle = 'black';
  ctx.font = '400 16px Raleway';
  ctx.textAlign = 'center';  
  ctx.textBaseline = 'middle';  
  if(message.indexOf(' ') != -1){
    var newMessage = message.substr(0, message.indexOf(' '));
    ctx.fillText(newMessage, this.pos.x, this.pos.y - 16);
    newMessage = message.substr(message.indexOf(' ') + 1);
    ctx.fillText(newMessage, this.pos.x, this.pos.y);
  }else{
    ctx.fillText(this.description, this.pos.x, this.pos.y);  
  }

  // if(targetValue == 0 && this.isSelected){
  if(this.isSelected){  
    ctx.font = '600 16px Raleway';
    ctx.fillText('$' + Math.round(this.totalAmount), this.pos.x, this.pos.y + 16);  
  }
}

function checkMouseBubleCategory(index){
  if(dist(mousePos.x, mousePos.y, this.pos.x, this.pos.y) < this.radius){
    // console.log(this.description);
    // console.log(index);
    
    //Deactive all
    for(var i = 0; i < bubbleCategories.length; i++){
      bubbleCategories[i].isSelected = false;
      lineCategories[i].isSelected = false;
    }

    this.isSelected = (this.isSelected) ? (0):(1);
    // console.log(this.isSelected);

    //Deactive corresponding line too
    lineCategories[index].isSelected = (lineCategories[index].isSelected) ? (0):(1);
    // console.log(lineCategories[index].isSelected);
  }
}

function setColorBubbleCategory(myArray, i){
  var hue = map(i, 0, myArray.length, 360, 0);
  var brightness = 50;
  var saturation = 100;
  if(i % 2 == 0){
  // if(200 < hue && hue < 360){
    brightness = 80;  
  }
  // if(200 < hue && hue < 300){
  //   brightness = 70;  
  // }

  // if(50 < hue && hue < 180){
  //   brightness = map(hue, 50, 180, 30, 50);  
  // }

  this.myColor = { h: hue, s: saturation, b: brightness, a: 0.8 };
  }
}

function setPosBubbleCategory(){
  this.pos = { x: this.radius + margin + Math.random() * (canvas.width - 2*(this.radius + margin)),
               // y: this.radius + bubbleCeil + Math.random() * (canvas.height - bubbleCeil - 2*(this.radius + margin)) };
               y: this.radius + Math.random() * (canvas.height - 2*(this.radius)) };
               // y: this.radius + Math.random() * this.radius };
}

function setSizeBubbleCategory(){
  this.radius = getRadiusFromArea(this.totalAmount)*bubbleScale;
}