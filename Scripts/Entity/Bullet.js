var bullets = [];
var bulletImagePlayer = document.createElement("img");
bulletImagePlayer.src = 'Art/laser.png';
var player = new Player();
var enemy = new Enemy();

var Bullet = function() {
	
}

Bullet.prototype.update = function(deltaTime){
	this.position.x += this.speed;
}

Bullet.prototype.draw = function(){
	bullet.rotation = player.rotation + Math.PI / 2;
	
	context.save();
		context.translate(this.xPos, this.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2)
	context.restore();
}

Bullet.prototype.shootPlayer = function(){
	var bullet = {
		image : bulletImagePlayer,
			
		x : player.position.x,
		y : player.position.y,
			
		width : 5,
		height : 5,
		velocityX : 0,
		velocityY : 0,
			
		isDead : false,
			
		speed : 900,
	}
	var velX = 0;
	var velY = 1;
	
	var sine = Math.sin(player.angle + Math.PI);
	var cos = Math.cos(player.angle + Math.PI);
	
	var xVel = (velX * cos) - (velY * sine);
	var yVel = (velX * sine) + (velY * cos);
	
	bullet.velocityX = xVel * bullet.speed;
	bullet.velocityY = yVel * bullet.speed;

	bullet.x = player.position.x;
	bullet.y = player.position.y;
	
	bullet.isDead = false;	
	
	bullets.push(bullet);
}