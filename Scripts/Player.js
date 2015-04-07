var canvas = document.getElementById("gameCanvas");

var Player = function() {
	this.image = document.createElement("img");
	
	this.a = new Vector2();
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 159;
	this.height = 163;
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "Art/Hero.png";
};

Player.prototype.update = function(deltaTime){
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true){
		this.rotation -= deltaTime;
	}else{
		this.rotation += deltaTime;
	}
}

Player.prototype.draw = function(){
	context.save();
		context.translate(this.a.xPos, this.a.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}