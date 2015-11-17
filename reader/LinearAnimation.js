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
	this.state=0;
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	if(this.beg_time==null) this.beg_time=currTime;
	else
	{
		var time_since_start=currTime-this.beg_time;
		if(time_since_start>this.span && !this.done) //TIME'S UP
		{
			this.x=this.checkpoints[this.checkpoints.length-1][0];
			this.y=this.checkpoints[this.checkpoints.length-1][1];
			this.z=this.checkpoints[this.checkpoints.length-1][2];

			this.done=true;
			this.apply();
			return;
		}

		var i=0;
		for (; i < this.times.length-1; i++) {
			if(this.times[i]<time_since_start && this.times[i+1]>time_since_start) break;
		};
		var diffX=this.checkpoints[i+1][0]-this.checkpoints[i][0];
		var diffY=this.checkpoints[i+1][1]-this.checkpoints[i][1];
		var diffZ=this.checkpoints[i+1][2]-this.checkpoints[i][2];

		if(i>this.state)
		{
			this.state=i;
			var vec_diff1 = [this.checkpoints[i-1][0] - this.checkpoints[i][0], this.checkpoints[i-1][2] - this.checkpoints[i][2]];
			var vec_diff2 = [this.checkpoints[i+1][0] - this.checkpoints[i][0], this.checkpoints[i+1][2] - this.checkpoints[i][2]];
			var ang_inc = Math.atan2( vec_diff1[0]*vec_diff2[1] - vec_diff1[1]*vec_diff2[0], vec_diff1[0]*vec_diff2[0] + vec_diff1[1]*vec_diff2[1] );
			if(Math.abs(ang_inc)==Math.PI) {
				ang_inc=0;
			}
			else if(ang_inc==0) {
				ang_inc=Math.PI;
			}
			this.angle += ang_inc;
		}

		var time_from_last_check = time_since_start - this.times[i];
		var time_diff = this.times[i+1] - this.times[i];
		var time_perc = time_from_last_check / time_diff;

		this.x=this.checkpoints[i][0]+diffX*time_perc;
		this.y=this.checkpoints[i][1]+diffY*time_perc;
		this.z=this.checkpoints[i][2]+diffZ*time_perc;

		this.apply();
	}
};

LinearAnimation.prototype.apply = function() {
	mat4.translate(this.node.matrix, this.node.beg_matrix, [this.x, this.y, this.z]);
	mat4.rotateY(this.node.matrix, this.node.matrix, this.angle);
};

function dist(point1,point2) {
	if(point1.constructor==Array && point1.length==3 && point2.constructor==Array && point2.length==3)
	{
		return Math.sqrt( (point1[0]-point2[0])*(point1[0]-point2[0]) + (point1[1]-point2[1])*(point1[1]-point2[1]) + (point1[2]-point2[2])*(point1[2]-point2[2]) );
	}
	return null;
};
