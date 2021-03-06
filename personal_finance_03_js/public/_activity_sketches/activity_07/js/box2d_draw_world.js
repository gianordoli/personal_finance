function drawWorld(world, context) {
	// console.log('drawWorld');
	// ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}

function drawShape(shape, context) {
	// console.log(shape);

	var index;
	var pos;
	var color;

	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{

			var circle = shape;

			index = circle.m_index;
			pos = circle.m_position;
			color = circle.m_color;
			
			bubbleCategories[index].update(pos);
			// circle.m_radius = map(value, 0, 1, bubbleCategories[index].radius, 40);
			circle.m_radius = bubbleCategories[index].radius;
			var r = circle.m_radius;

			//Creating a sort of 'halo' to prevent text overlapping
			// if(targetValue == 1){
				r = circle.m_radius - 7;
			// }
			// var segments = 16.0;
			var segments;
			segments = Math.floor(r);	//Changing circle 'resolution' according to radius
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
	
			// draw radius
			context.moveTo(pos.x, pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x, pos2.y);
		}

		if(bubbleCategories[index].isSelected){
			context.fillStyle = color;
		}else{
			context.fillStyle = parseHslaColor(0, 0, 50, 0.5);
		}
		context.fill();			
		// console.log(index);

		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			// console.log(poly.m_position);
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
		}
		context.fillStyle = parseHslaColor(0, 100, 100, 0);
		context.fill();

		break;
	}
}