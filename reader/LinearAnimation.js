/**
 * LinearAnimation
 * @constructor
 */

function LinearAnimation(scene, id, span, checkpoints) {
 	Animation.call(this, scene, id, span);
	
 	this.type="linear";

	this.checkpoints=checkpoints;

	this.dists=[];
	this.dists.push(0);
	for (var i = 1; i < checkpoints.length; i++) {
		checkpoints[i]
		this.dists[i]=dist(checkpoints[i-1],checkpoints[i])+this.dists[i-1];
	};

	this.speed=this.dists[this.dists.length-1]/span;

	this.times=[];
	this.times.push(0);
	for (var i = 1; i < this.dists.length; i++) {
		this.times[i]=this.dists[i]/this.speed;
	};

	//this.updateSpeeds();
	//this.updateAngle();

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	if(this.time_beg==null) this.time_beg=currTime;
	else
	{
		var time_dif=currTime-this.time_beg;
		if(time_dif>=this.span) return; //ANIMATION OVER

	}
	//this.apply();
};

LinearAnimation.prototype.apply = function() {
	mat4.rotateY(this.node.matrix, this.node.beg_matrix, this.angle*degToRad);
	mat4.translate(this.node.matrix, this.node.beg_matrix, [this.speedX, this.speedY, this.speedZ]);
};

/*
LinearAnimation.prototype.updateSpeeds = function() {
	if(this.state>=this.checkpoints.length-1) return;
	this.speedX = (this.checkpoints[this.state+1][0]-this.x)/(this.time_per_check);
	this.speedY = (this.checkpoints[this.state+1][1]-this.y)/(this.time_per_check);
	this.speedZ = (this.checkpoints[this.state+1][2]-this.z)/(this.time_per_check);
};

LinearAnimation.prototype.updateAngle = function() {
	this.angle = Math.atan2(this.checkpoints[this.state+1][2], this.checkpoints[this.state+1][0]) - Math.atan2(this.z, this.x);
};*/

function dist(point1,point2) {
	if(point1.constructor==Array && point1.length==3 && point2.constructor==Array && point2.length==3)
	{
		return Math.sqrt( (point1[0]-point2[0])*(point1[0]-point2[0]) + (point1[1]-point2[1])*(point1[1]-point2[1]) + (point1[2]-point2[2])*(point1[2]-point2[2]) );
	}
	return null;
}