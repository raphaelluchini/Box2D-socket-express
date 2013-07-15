var Box2dGame = function() {
	var box2d = {
		b2Vec2 : Box2D.Common.Math.b2Vec2,
		b2BodyDef : Box2D.Dynamics.b2BodyDef,
		b2Body : Box2D.Dynamics.b2Body,
		b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
		b2Fixture : Box2D.Dynamics.b2Fixture,
		b2World : Box2D.Dynamics.b2World,
		b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
		b2DebugDraw : Box2D.Dynamics.b2DebugDraw
	};
	var SCALE = 30, STEP = 30, TIMESTEP = 1/STEP;

	var world;
	var debugActive = false;

	this.setup = function() {
		world = new box2d.b2World(new box2d.b2Vec2(0,10), true);
		this.createObjs();
	};

	this.createObjs = function(){
		this.addWall(550, 10, -25, 509);
		this.addWall(10, 550, -9, 25);
		this.addWall(10, 550, 509, -25);

	};

	this.addWall = function(w, h, px, py){
		var floorShape = new box2d.b2PolygonShape();
		floorShape.SetAsBox(w / SCALE, h / SCALE);

		var floorFixture = new box2d.b2FixtureDef();
		floorFixture.density = 0;
		floorFixture.friction = 10;
		floorFixture.restitution = 0.5;
		floorFixture.shape = floorShape;

		var floorBodyDef = new box2d.b2BodyDef();
		floorBodyDef.position.Set(px / SCALE, py / SCALE);
		world.CreateBody(floorBodyDef).CreateFixture(floorFixture);
	};

	this.addBall = function(x ,y, angle, force){
		this.createBall(24, x, y).SetLinearVelocity(new box2d.b2Vec2(-force*Math.cos(angle)/4,-force*Math.sin(angle)/4));
	};

	this.createBall = function(radius, x, y){
		var birdFixture = new box2d.b2FixtureDef();
		birdFixture.density = 1;
		birdFixture.restitution = 0.6;
		birdFixture.shape = new box2d.b2CircleShape(radius / SCALE);
		var birdBodyDef = new box2d.b2BodyDef();
		birdBodyDef.type = box2d.b2Body.b2_dynamicBody;
		birdBodyDef.position.x = x / SCALE;
		birdBodyDef.position.y = y / SCALE;
		var ball = world.CreateBody(birdBodyDef);
		ball.CreateFixture(birdFixture);
		return ball;
	};

	// box2d debugger
	this.addDebug = function() {
		var debugDraw = new box2d.b2DebugDraw();
		debugDraw.SetSprite(context);
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
		debugActive = true;
	};

	this.update = function() {
		if(debugActive){
			world.m_debugDraw.m_sprite.graphics.clear();
			world.DrawDebugData();
		}
		world.Step(TIMESTEP, 10, 10);
		world.ClearForces();
	};

	var pauseResume = function(p) {
		if(p) { TIMESTEP = 0;
		} else { TIMESTEP = 1/STEP; }
		lastTimestamp = Date.now();
	};

	return this;
};