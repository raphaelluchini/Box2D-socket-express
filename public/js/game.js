var war = {};

war.demo = (function(){
	this.canvas       = null;
	this.context      = null;
	this.stage        = null;
	this.box2d        = null;
	var focused       = true;
	this.setup = function(box2d) {

		this.createCanvas = function(){
			this.canvas = document.getElementById('demoCanvas');
			this.context = this.canvas.getContext('2d');
			this.stage = new createjs.Stage(this.canvas);
			this.stage.snapPixelsEnabled = true;

			createjs.Ticker.setFPS(30);
			createjs.Ticker.useRAF = true;
			createjs.Ticker.addListener(war.demo);  // looks for "tick" function within the war.demo object
		};
		this.box2d = box2d;
		return this;
	};

	this.tick = function(dt, paused) {
		if(focused) {
			stage.update();
			box2d.update();
		}
	};

	return this;
})();

$(document).ready(function() {
	var box2dGame = new Box2dGame();
	war.demo.setup(box2dGame).createCanvas();
	box2dGame.setup();
	box2dGame.addDebug(war.demo.context);

	$('#go').on('click', function(){
		client.attack($('#angle').val(), $('#force').val());
		box2dGame.addBall(100, 400, $('#angle').val(), $('#force').val());
	});

	game.attack = function(angle, force){
		box2dGame.addBall(100, 400, angle, force);
	};
});
