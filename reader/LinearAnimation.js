/**
 * LinearAnimation
 * @constructor
 */

function LinearAnimation(scene, id, span, checkpoints) {
 	Animation.call(this, scene, id, span);
	
 	this.type="linear";

	this.checkpoints=checkpoints;
	this.x=checkpoints[0][0];
	this.y=checkpoints[0][1];
	this.z=checkpoints[0][2];

	this.time_per_check = span/(checkpoints.length-1);

	this.updateSpeeds();

	this.updateAngle();

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	if(this.state>=this.checkpoints.length-1) return; //ANIMATION OVER
	if(this.x==this.checkpoints[this.state+1][0] && this.y==this.checkpoints[this.state+1][1] && this.z==this.checkpoints[this.state+1][2]) { // REACHED A CHECKPOINT
		state++;
		this.updateSpeeds();
		this.updateAngle();
	}
	else
	{
		this.x+=this.speedX;
		this.y+=this.speedY;
		this.z+=this.speedZ;
	}
};

LinearAnimation.prototype.apply = function() {
	this.scene.pushMatrix();
		this.scene.rotate(this.angle*degToRad);
		this.scene.translate(this.x,this.y,this.z);
	this.scene.popMatrix();
};

LinearAnimation.prototype.updateSpeeds = function() {
	if(this.state>=this.checkpoints.length-1) return;
	this.speedX = (this.checkpoints[this.state+1][0]-this.x)/this.time_per_check;
	this.speedY = (this.checkpoints[this.state+1][1]-this.y)/this.time_per_check;
	this.speedZ = (this.checkpoints[this.state+1][2]-this.z)/this.time_per_check;
};

LinearAnimation.prototype.updateAngle = function() {
	this.angle = Math.atan2(this.checkpoints[this.state+1][2], this.checkpoints[this.state+1][0]) - Math.atan2(this.z, this.x);
};