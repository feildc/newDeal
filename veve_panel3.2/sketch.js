let uiWidth = 812;
let uiHeight = 417;
let checkbox;

let touchLoc = new p5.Vector(0,0);
let currentLoc = new p5.Vector(0,0);
let prevLoc = new p5.Vector(0,0);
let difference = 0;
let prevDist = 0;
let dragDist = 0;
let isDown = false;
let isMoved = false;
let dragAngle = 0;
let blobColor = "#FFFFFF";
let touchTime = 0;

let devMode = "false";


let blob1;
let blob2;
let blob3;

let midPlane;
let colBound1;
let colBound2;
let colBound3;

let touchZone = 0;

bgColor = "#33334A";

function setup() {
	var canvas = createCanvas(uiWidth, uiHeight);

	// Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');

	midPlane = uiHeight/2;
	colBound1 = uiWidth*.35;
	colBound2 = uiWidth*.65;
	colBound3 = uiWidth;

	blob1 = new Blob(1,uiWidth*.2,midPlane,uiWidth*.2);
	blob2 = new Blob(2,uiWidth*.5,midPlane,uiWidth*.2);
	blob3 = new Blob(3,uiWidth*.8,midPlane,uiWidth*.2);

	checkbox = createCheckbox(' Toggle Developer Mode Annotations', true);
	checkbox.style('margin-top', '15px');
	checkbox.style('margin-left', '15px');
	checkbox.parent('sketch-holder');
  checkbox.changed(myCheckedEvent);
}

function draw() {
	background(bgColor);

	stroke(255,10);
	line(colBound1,0,colBound1,uiHeight); //column line
	line(colBound2,0,colBound2,uiHeight); //lolumn line 2
	textSize(60);
	noStroke();
	//text(dragAngle,uiWidth*.49,100);
	fill(blobColor);
	blob1.run();
	blob2.run();
	blob3.run();
	trackDrag();
}


function touchStarted(event) {
  //console.log(event); //logs info about touch event could delete
	isDown = true;
	touchLoc.x = event.pageX;
	touchLoc.y = event.pageY;
}

function touchEnded(event) {
	isDown = false;
	isMoved = false;
	bgColor = "#33334A";
  //console.log(event);
	touchZone = 0;
	touchTime = 0;
}

function touchMoved(event) {
console.log(dragDist);
if(dragDist > 10){
isMoved = true;
}
}



function  trackDrag(){
	if(isDown == true){
		touchTime += 1;
		//console.log(touchTime);
	}
	if(isMoved == true || touchTime > 15){

		if(touchLoc.x <= colBound1){
			touchZone = 1;
		}

		if(touchLoc.x > colBound1 && touchLoc.x < colBound2){
			touchZone = 2;
		}

		if(touchLoc.x >= colBound2){
			touchZone = 3;
		}



		//draw text next to mouse showing dist
		noStroke();
		textSize(24);
		//text(dragDist,mouseX,mouseY);
		//calculate drag distance
	  dragDist = dist(touchLoc.x,touchLoc.y,mouseX,mouseY);
		//create Vector for mouse
		let mouseV = createVector(mouseX-touchLoc.x, mouseY-touchLoc.y);
		//calculate angle of drag
		dragAngle = mouseV.heading();
		dragAngle = degrees(dragAngle)*-1;


		difference = dragDist - prevDist;
		//text(difference,mouseX,mouseY-20);
		prevDist = dragDist;



	}
	else{
		//bgColor = "#33334A"
	}
}





class Blob{
	constructor(num,x,y,d) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.num = num;
		this.color = 255;
		this.setting = this.d;
		this.angleThreshRight = -60;
		this.angleThreshLeft = -180;
		this.settingMax = uiWidth*1.1;
		if (this.num === 2) {
			this.settingMax = uiWidth*.9;
			this.angleThreshRight = -30;
			this.angleThreshLeft = -150;
		}
		if (this.num === 3) {
			this.angleThreshRight = -1;
			this.angleThreshLeft = -120;
		}
	}


	run(){
		this.checkClick();
		this.turnOn();
		if(touchZone === 0){
		this.display();
		}
		else if (touchZone === this.num && (touchTime > 15 || isMoved == true )) {
			this.showSetting();
			this.adjustSize();
			if(checkbox.checked() === true){
				this.showThresh();
			}
		}
	}

	checkClick(){
		if(touchZone === this.num){
		}
		else{
			this.color = 255;
		}
	}

// 	adjustSize(){
// 		if(this.setting < this.settingMax && this.setting >= this.d){
// 		this.setting = this.setting + (difference*3) * Math.sign(dragAngle);
// 	}
// 	else{
// 		if(Math.sign(dragAngle) > 0){
// 		this.setting += -1;
// 	}
// 	if(Math.sign(dragAngle) < 0){
// 	this.setting += +
//
// 	1;
// }
// 	}
// 	}


adjustSize(){
	let dirrection;

	if((dragAngle > this.angleThreshLeft && dragAngle < this.angleThreshRight) || dragAngle === 0) {
		dirrection = -1;
		if(this.setting >= this.d && this.setting <= this.settingMax ){
			this.setting = this.setting + (difference*3) * Math.sign(dragAngle);
		}
		else{
			this.setting = this.d;
		}
	}
	else{
		dirrection = 1;
		if(this.setting <= this.settingMax && this.setting >= this.d){
		this.setting = this.setting + (difference*2.5) * dirrection;
		}
		else{
			this.setting = this.settingMax;
		}
	}
	if(this.setting < this.d){
		this.setting = this.d;
	}
	if(this.setting > this.settingMax){
		this.setting = this.settingMax;
	}

}

	display(){
		noStroke();
		fill(this.color,50);
		ellipse(this.x,this.y,this.d,this.d);
		let value = Math.floor(map(this.setting,this.d,this.settingMax,0,100));
		textSize(20);
		fill(255);
		text(value+" %",this.x-11,this.y+150);
	}


	showSetting(){
		stroke(255);
		strokeWeight(2);
	  noFill();
		ellipse(this.x,this.y,this.settingMax,this.settingMax);
		fill(this.color,50);
		noStroke();
		ellipse(this.x,this.y,this.setting,this.setting);
		let value = Math.floor(map(this.setting,this.d,this.settingMax,0,100));
		textSize(20);
		fill(255);
		text(value+" %",this.x-11,this.y+150);
	}



	// showThresh function is just used to show the geometry controlling the behavior
	showThresh(){
		//draw line to show drag
		stroke("red");
		line(touchLoc.x,touchLoc.y,mouseX,mouseY);

		//draw horz threshold at touchX
		stroke(255,50);
		line(0,touchLoc.y,uiWidth,touchLoc.y);
		noStroke();
		push();
		translate(touchLoc.x,touchLoc.y);
		//let threshVec = new p5.Vector.fromAngle(radians(-this.angleThreshRight),1000);
		fill(255,255,0,50);
		if(this.num === 1){
			let threshVec = new p5.Vector.fromAngle(radians(-this.angleThreshRight),1000);
			//fill in subtraction area
			quad(0,0,threshVec.x,threshVec.y,-touchLoc.x,uiHeight-touchLoc.y,-touchLoc.x,0);
			// draw arc
			stroke(255,255,0);
			strokeWeight(1);
			noFill();
			arc(0, 0, 80, 80,0, threshVec.heading());
			//write angle measurement
			fill("yellow");
			noStroke();
			textSize(12);
			text(abs(this.angleThreshRight)+"°",40,30);
		}
		if(this.num === 3){
			let threshVec = new p5.Vector.fromAngle(radians(-this.angleThreshLeft),1000);
			quad(0,0,threshVec.x,threshVec.y,uiWidth-touchLoc.x,uiHeight-touchLoc.y,uiWidth,0);
			// draw arc
			stroke(255,255,0);
			strokeWeight(1);
			noFill();
			arc(0, 0, 80, 80, threshVec.heading(),PI);
			//write angle measurement
			fill("yellow");
			noStroke();
			textSize(12);
			text(180-abs(this.angleThreshLeft)+"°",-70,35);
		}
		if(this.num === 2){
			let threshVec = new p5.Vector.fromAngle(radians(-this.angleThreshLeft),1000);
			let threshVec2 = new p5.Vector.fromAngle(radians(-this.angleThreshRight),1000);
			triangle(0,0,threshVec.x,threshVec.y,threshVec2.x,threshVec2.y);
			// draw arc
			stroke(255,255,0);
			strokeWeight(1);
			noFill();
			arc(0, 0, 80, 80, threshVec.heading(),PI);
			//write angle measurement
			fill("yellow");
			noStroke();
			textSize(12);
			text(abs(this.angleThreshRight)+"°",-70,20);
			// draw arc
			stroke(255,255,0);
			strokeWeight(1);
			noFill();
			arc(0, 0, 80, 80,0, threshVec2.heading());
			//write angle measurement
			fill("yellow");
			noStroke();
			textSize(12);
			text(abs(this.angleThreshRight)+"°",50,20);
		}
		pop();

	}

	turnOn(){
		if(touchEnded == true && dist(touchLoc.x,touchLoc.y,this.x,this.y) < this.d){
			console.log(touchEnded);
		}
	}

}

function myCheckedEvent() {
  if (this.checked()) {
    console.log('Checking!');
  } else {
    console.log('Unchecking!');
  }
}

document.ontouchmove = function(event){
    event.preventDefault();
}
