var canvas = document.getElementById("gameCanvas");

var Vector2 = function() {
	this.image = document.createElement("img");
	
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 159;
	this.height = 163;
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "vector2.png";
};

Vector2.prototype.setPos = function(x, y){
	Vector2.xPos = x;
	Vector2.yPos = y;
}