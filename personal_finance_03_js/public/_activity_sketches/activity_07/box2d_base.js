var myGround;

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
	myGround = createGround(world);

	//Boundaries
	createBox(world, 0, 0, 1, canvas.height);
	createBox(world, canvas.width, 0, 1, canvas.height);	
	// createBox(world, canvas.width/2, bubbleGround, canvas.width*2, 1);

	return world;
}

function createGround(world) {
	console.log('called ground');
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(canvas.width * 2, 10);
	groundSd.restitution = 0.1;
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(-canvas.width, bubbleGround + 50);
	return world.CreateBody(groundBd)
}

function createBall(world, index, pos, radius, color) {
	console.log('called createBall');
	var ballSd = new b2CircleDef();
	ballSd.density = 2;
	ballSd.radius = radius;
	ballSd.restitution = 0.1;
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