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

	this.speed=this.dists[this.dists.length-1]/this.span;

	this.times=[];
	this.times.push(0);
	for (var i = 1; i < this.dists.length; i++) {
		this.times[i]=this.dists[i]/this.speed;
	};

	this.x=checkpoints[1][0];
	this.y=checkpoints[1][1];
	this.z=checkpoints[1][2];

	this.angle=0;

	//this.updateSpeeds();
	//this.updateAngle();

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	if(this.beg_time==null) this.beg_time=currTime;
	else
	{
		var time_since_start=currTime-this.beg_time;
		if(time_since_start>=this.span) return; //ANIMATION OVER

		var i=0;
		for (; i < this.times.length-1; i++) {
			if(this.times[i]<time_since_start && this.times[i+1]>time_since_start) break;
		};
		var diffX=this.checkpoints[i+1][0]-this.checkpoints[i][0];
		var diffY=this.checkpoints[i+1][1]-this.checkpoints[i][1];
		var diffZ=this.checkpoints[i+1][2]-this.checkpoints[i][2];

		var time_from_last_check = time_since_start - this.times[i];
		var time_diff = this.times[i+1] - this.times[i];
		var time_perc = time_from_last_check / time_diff;
		/*            time_diff -- 1
		 * time_from_last_check -- time_perc */

		 this.x=this.checkpoints[i][0]+diffX*time_perc;
		 this.y=this.checkpoints[i][1]+diffY*time_perc;
		 this.z=this.checkpoints[i][2]+diffZ*time_perc;

		this.apply();
	}
};

LinearAnimation.prototype.apply = function() {
	mat4.rotateY(this.node.matrix, this.node.beg_matrix, this.angle);
	mat4.translate(this.node.matrix, this.node.beg_matrix, [this.x, this.y, this.z]);
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

function angleVectors(vec1,vec2) {
	if(point1.constructor==Array && point1.length==3 && point2.constructor==Array && point2.length==3)
	{
		return Math.atan2(vec2[2], vec2[0]) - Math.atan2(vec1[2], vec1[0]);
	}
	return null;
}