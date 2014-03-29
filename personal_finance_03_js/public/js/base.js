/*---------- REQUEST ANIMATION FRAME ----------*/
var request;
window.requestAnimFrame = (function(callback) {
  return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
          function(callback) {
              return window.setTimeout(callback, 1000 / 60);
          };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )(); 



//1. Create World
function createWorld() {
	console.log('called createWorld');
	var worldAABB = new b2AABB();
	//Physics boundaries
	worldAABB.minVertex.Set(0, 0);
	worldAABB.maxVertex.Set(canvas.width, canvas.height);
	var gravity = new b2Vec2(0, 300);
	var doSleep = true;
	var world = new b2World(worldAABB, gravity, doSleep);
	createGround(world);

	//Boundaries
	createBox(world, 0, 0, 1, canvas.height);
	createBox(world, 0, 0, canvas.width, 1);
	createBox(world, canvas.width, 0, 1, canvas.height);
	return world;
}

function createGround(world) {
	console.log('called ground');
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(canvas.width, 1);
	groundSd.restitution = 0.2;
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(0, canvas.height);
	return world.CreateBody(groundBd)
}

function createBall(world, index, pos, size, color) {
	console.log('called createBall');
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = size;
	ballSd.restitution = 0.7;
	ballSd.friction = 0;
	ballSd.color = color;
	ballSd.index = index;

	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(pos.x, pos.y);
	// console.log(ballBd);
	return world.CreateBody(ballBd);
}

function createBox(world, x, y, width, height, fixed) {
	console.log('called createBox');
	if (typeof(fixed) == 'undefined') fixed = true;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd)
}

// var initId = 0;
// var world;
// var ctx;
// var canvas;
// var canvasPosition;
// var mousePos = new Object();

function step(cnt) {
	var stepping = false;
	var timeStep = 2/60;
	var iteration = 1;

	world.Step(timeStep, iteration);
	drawWorld(world, ctx);
	// setTimeout('step(' + (cnt || 0) + ')', 10);

	//Loop
	request = requestAnimationFrame(step);
}