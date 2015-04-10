var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();
var bullet = new Bullet();

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var tileset = document.createElement("img");
tileset.src = "Art/tileset.png";

var heart = document.createElement("img");
heart.src = "Art/health.png";

var heart2 = document.createElement("img");
heart2.src = "Art/health2.png";

var MAP = {tw:70, th:20};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var LAYER_COUNT = 6;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_DECOR = 2;
var LAYER_DOOR = 3;
var LAYER_BREAKABLES = 4;
var LAYER_LADDERS = 5;

var shootTimer = 0;
var gameTimer = 0;
var textTimer = 0;

var winner = "No winner yet!";

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

var cells = [];
function initialize(){
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++){
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < MyLevel2.layers[layerIdx].height; y++){
			cells[layerIdx][y] = [];
			for(var x = 0; x < MyLevel2.layers[layerIdx].width; x++){
				if(MyLevel2.layers[layerIdx].data[idx] != 0){
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}else if(cells[layerIdx][y][x] != 1){
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
}

/** Axis Aligned Bounding Box checks **/
function intersects(x1, y1, w1, h1, x2, y2, w2, h2){
	if(y2 + h2 < y1 || x2 + w2 < x1 || x2 > x1 + w1 || y2 > y1 + h1){
		return false;
	}else
		return true;
}

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

function tileToPixel(tileCoord){
	return tileCoord * TILE;
}

function pixelToTile(pixel){
	return Math.floor(pixel / TILE);
}

function cellAtTileCoord(layer, tx, ty){
	if(tx<0 || tx>=MAP.tw || ty<0){
		return 1;
	}
	if(ty>=MAP.th){
		return 0;
	}
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y){
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}

function drawBorderedRect(x, y, width, height, insideColour, borderColour, borderWidth){
	context.fillStyle = "" + borderColour;
	context.fillRect(x, y, width, height);
	context.fillStyle = "" + insideColour;
	context.fillRect(x + borderWidth, y + borderWidth, width - (borderWidth * 2), height - (borderWidth * 2));
}

function drawMap(){
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++){
		var idx = 0;
		for( var y = 0; y < MyLevel2.layers[layerIdx].height; y++ ){
			for( var x = 0; x < MyLevel2.layers[layerIdx].width; x++ ){
				if( MyLevel2.layers[layerIdx].data[idx] != 0 ){
					var tileIndex = MyLevel2.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

function run()
{
	if(player.shooting){
		shootTimer = 0.25;
	}

	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	if(deltaTime > 0.03){
		deltaTime = 0.03;
	}
	
	shootTimer -= deltaTime;
	textTimer += deltaTime * 200;
	gameTimer += deltaTime;
	
	if(player.shooting && shootTimer < 0){
		//shootTimer = 1 / player.fireRate;
		//player.shootPlayer();
	}
	
	drawMap();
	drawBorderedRect(0, canvas.height - 100, canvas.width, 100, "black", "White", 5);
	
	if((player.position.x >= canvas.width / 2 - TILE && player.position.x <= canvas.width / 2 + 70) && (player.position.y >= 64 && player.position.y <= 64 + 110) && enemy.isDead){
		winner = "Player!";
	}
	
	if((enemy.position.x >= canvas.width / 2 - TILE && enemy.position.x <= canvas.width / 2 + 70) && (enemy.position.y >= 64 && enemy.position.y <= 64 + 110) && player.isDead){
		winner = "Enemy!";
	}
	
	if(textTimer >= canvas.width){
		textTimer = -100
	}
	var text = "Game Time: " + Math.floor(gameTimer) + " || Winner: " + winner;
	context.beginPath();
	context.fillStyle = "#FFFFFF";
	context.font="70px ONYX";
	context.fillText(text, canvas.width / 2 - 250, canvas.height - 20, canvas.width);
	
	for(var i = 0; i < player.lives; i++){
		context.drawImage(heart, 5 + ((heart.width+5) * i), canvas.height - 85);
	}
	
	for(var i = 0; i < enemy.lives; i++){
		context.drawImage(heart2, canvas.width - ((heart.width+5) * i) - 78, canvas.height - 85);
	}
	
	player.update(deltaTime);
	player.draw();
	
	enemy.update(deltaTime);
	enemy.draw();
	
	for(var j = 0; j < bullets.length; j++){
		if(bullets[j].isDead == false){
			bullets[j].xPos += bullets[j].velocityX * deltaTime;
			bullets[j].yPos += bullets[j].velocityY * deltaTime;
			context.drawImage(bullets[j].image, bullets[j].xPos - bullets[j].width / 2, bullets[j].yPos - bullets[j].height / 2);
			
			//for(var i = 0; i < asteroids.length; i++){		
				//if(asteroids[i].isDead == false){
					//var hit = intersects(bullets[j].xPos - bullets[j].width / 2, bullets[j].yPos - bullets[j].height / 2, bullets[j].width, bullets[j].height, asteroids[i].xPos - asteroids[i].width / 2, asteroids[i].yPos - asteroids[i].height / 2, asteroids[i].width, asteroids[i].height);
					//if(hit == true){
						//bullets[j].isDead = true;
						//asteroids[i].isDead = true;
						//player.score += 1;
						
						//if(asteroids[i].size > 1){
						//	spawnAsteroid(asteroids[i].size - 1, asteroids[i].xPos, asteroids[i].yPos);
						//	spawnAsteroid(asteroids[i].size - 1, asteroids[i].xPos, asteroids[i].yPos);
						//}
					//}
				//}
			//}
		}else{
			bullets.splice(j, 1);
		}
	}
	
	//context.beginPath();
	//context.strokeRect(player.position.x, player.position.y, TILE, TILE);
	//context.strokeRect(canvas.width / 2, 64, 70, 110);
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#000000";
	context.font="20px Verdana";
	//context.fillText("FPS: " + fps, 5, 20, 100);
}

initialize();
//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
