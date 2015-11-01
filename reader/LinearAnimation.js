/**
 * LinearAnimation
 * @constructor
 */

function LinearAnimation(scene, id, time, checkpoints) {
 	Animation.call(this, scene, id, time);
	
 	this.type="linear";

	this.checkpoints=checkpoints;
	this.x=checkpoints[0][0];
	this.y=checkpoints[0][1];
	this.z=checkpoints[0][2];

	this.angle=0;

	var distance=0;
	for(var i=0;i<checkpoints.length-1;i++) {
		var x1=checkpoints[i][0];
		var y1=checkpoints[i][1];
		var z1=checkpoints[i][2];
		var x2=checkpoints[i+1][0];
		var y2=checkpoints[i+1][1];
		var z2=checkpoints[i+1][2];
		distance+= Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) + (z1-z2)*(z1-z2) );
	}
	this.speed=distance/time;
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	if(this.state==this.checkpoints.length-1) return;
	if(this.x==this.checkpoints[this.state+1][0] && this.y==this.checkpoints[this.state+1][1] && this.z==this.checkpoints[this.state+1][2]) { // REACHED A CHECKPOINT
		state++;
		this.angle=atan2(this.checkpoints[this.state+1][2], this.checkpoints[this.state+1][0]) - atan2(this.z, this.x);
	}
	//update this.x ; this.y ; this.z
};

LinearAnimation.prototype.apply = function() {
	//this.scene.rotate();
	//this.scene.translate();
};