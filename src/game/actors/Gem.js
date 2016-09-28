import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var gemImageList = [
	"resources/images/gems/gem_01.png",
	"resources/images/gems/gem_02.png",
	"resources/images/gems/gem_03.png",
	"resources/images/gems/gem_04.png",
	"resources/images/gems/gem_05.png"
]; 
var gemImages = [];

exports = Class(ui.View, function (supr) {
	
	this.init = function (opts) {
		opts = merge(opts, {
			width:	66,
			height: 66,
			canHandleEvents: true
		});

		supr(this, 'init', [opts]);
		loadImages(gemImageList);

		loadImages(gemImageList);
		this.build();
		
	};  

	this.build = function () {
		
		this.gemView = new ui.ImageView({
			superview: this,
			canHandleEvents: false,
			image: gemImages[this.gemType = getRandom(1, 5)],
			x: 0,
			y: 0,
			width: 66,
			height: 66
		});

		this.on('gem:swap', function(grid){

		});

		this.on('InputStart', function (event, point) {
			this.startDrag({
				inputStartEvt: event,
				radius: 10 
			});
		});

		this.on('gem:swipe', function(direction){

				var game = this.getSuperview();
				var x = this.style.x;
				var y = this.style.y;
				var gemsOnScreen = game.gemsOnScreen;
				
				var row = getPosition(gemsOnScreen, this).row
				var col = getPosition(gemsOnScreen, this).col
				

				if (direction === 'up' &&
					gemsOnScreen[row - 1] &&
					gemsOnScreen[row - 1][col]) {

					animate(this).now({y: y - 67}).then(function(){
						game.inactive = true;
					});
					animate(gemsOnScreen[row - 1][col]).now({y: gemsOnScreen[row - 1][col].style.y + 67});
					game.gemsOnScreen = transpose(gemsOnScreen, row, col, 0, -1);
					
				}
				
				else if(direction === 'down' &&
						 gemsOnScreen[row + 1] &&
						 gemsOnScreen[row + 1][col]) {
					
					animate(this).now({y: y + 67}).then(function(){
						game.inactive = true;
					});
					animate(gemsOnScreen[row + 1][col]).now({y: gemsOnScreen[row + 1][col].style.y - 67});
					game.gemsOnScreen = transpose(gemsOnScreen, row, col, 0, 1);;
				}
				
				else if(direction === 'left' &&
				 		gemsOnScreen[row] &&
						gemsOnScreen[row][col - 1]) {
					
					animate(this).now({x: x - 67}).then(function(){
						game.inactive = true;
					});
					animate(gemsOnScreen[row][col - 1]).now({x: gemsOnScreen[row][col - 1].style.x + 67});
					game.gemsOnScreen = transpose(gemsOnScreen, row, col, -1, 0);

				}
				
				else if(direction === 'right'&&
						gemsOnScreen[row] &&
						gemsOnScreen[row][col + 1]) {
					
					animate(this).now({x: x + 67}).then(function(){
						game.inactive = true;
					});
					animate(gemsOnScreen[row][col + 1]).now({x: gemsOnScreen[row][col + 1].style.x - 67});
					game.gemsOnScreen = transpose(gemsOnScreen, row, col, 1, 0);
				} else {
					game.inactive = true;
				}
		game.step()


		});



		this.on('Drag', function (startEvt, dragEvt, delta) {
			var game = this.getSuperview();
			if (game.inactive) {
				game.inactive = false;
				this.emit('gem:swipe',
					getSwipeDirection(startEvt.srcPt.x,
					startEvt.srcPt.y,
					dragEvt.srcPt.x,
					dragEvt.srcPt.y
				));
			}
		});
	};



});


function loadImages (imageList){
	for (var image = 0; image < imageList.length; image++){
		gemImages.push(new Image({url: imageList[image]}));
	}
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSwipeDirection (x1, y1, x2, y2) {
        var rad = Math.atan2(y1-y2,x2-x1) + Math.PI;
        var deg = (rad*180/Math.PI + 180)%360;
        if(deg >= 45 && deg <=135) {
            return "up";
        } else if (deg >= 0 && deg < 45 || deg >= 315 && deg <= 360)  {
            return "right";
        } else if (deg >= 225 && deg < 314) {
            return "down";
        } else {
            return "left";
        }
}

function getPosition(array, element) {
	for (var row = 0; row < array.length; row++) {
		var col = array[row].indexOf(element)
		if (col !== -1){
			return {row:row, col:col};
		}
	}
	return null;
}

function transpose(array, row, col, x, y) {
  var temp = array[row + y][col + x];
  array[row + y][col + x] = array[row][col]
  array[row][col] = temp;
  return array;
}

