var canvas = document.getElementById("gameCanvas");

var Enemy = function() {
	this.image = document.createElement("img");
	
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 159;
	this.height = 163;
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "Art/HeroI.png";
};

Enemy.prototype.update = function(deltaTime){
	if(this.xPos >= canvas.width + (this.width / 2)){
		this.xPos = 0 - (this.width / 2)
	}
	this.xPos += deltaTime * 300;
}

Enemy.prototype.draw = function(){
	context.save();
		context.translate(this.xPos, this.yPos);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}