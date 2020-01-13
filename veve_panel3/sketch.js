let uiWidth = 812;
let uiHeight = 417;

let touchLoc = new p5.Vector(0,0);
let currentLoc = new p5.Vector(0,0);
let prevLoc = new p5.Vector(0,0);
let difference = 0;
let prevDist = 0;
let dragDist = 0;
let isDown = false;
let dragAngle = 0;
let blobColor = "#FFFFFF"


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
	createCanvas(uiWidth, 417);
	midPlane = uiHeight/2;
	colBound1 = uiWidth*.35;
	colBound2 = uiWidth*.65;
	colBound3 = uiWidth;

	blob1 = new Blob(1,uiWidth*.2,midPlane,uiWidth*.2);
	blob2 = new Blob(2,uiWidth*.5,midPlane,uiWidth*.2);
	blob3 = new Blob(3,uiWidth*.8,midPlane,uiWidth*.2);
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



	if(touchLoc.x <= colBound1){
		touchZone = 1;
	}

	if(touchLoc.x > colBound1 && touchLoc.x < colBound2){
		touchZone = 2;
	}

	if(touchLoc.x >= colBound2){
		touchZone = 3;
	}

}

function touchEnded(event) {
	isDown = false;
	bgColor = "#33334A";
  //console.log(event);
	touchZone = 0;
}



function  trackDrag(){

	if(isDown == true){
		//draw line to show drag
		stroke("red");
	//	line(touchLoc.x,touchLoc.y,mouseX,mouseY);
		//draw text next to mouse showing dist
		noStroke();
		textSize(24);
		//text(dragDist,mouseX,mouseY);
		//draw horz threshold at touchX
		stroke(255,50);
		//line(0,touchLoc.y,uiWidth,touchLoc.y);
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
		if(touchZone === 0){
		this.display();
		}
		else if (touchZone === this.num) {
			this.showSetting();
			this.adjustSize();
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

}

function mouseDragged(event) {
  console.log(event);
		return true;
}

document.ontouchmove = function(event){
    event.preventDefault();
}
