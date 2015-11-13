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
	this.state=0;

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

		if(i>this.state)
		{
			this.state=i;
			//this.angle+=angleVectors(this.checkpoints[i],this.checkpoints[i+1]);
			var vec_diff1 = [this.checkpoints[i-1][0] - this.checkpoints[i][0], this.checkpoints[i-1][2] - this.checkpoints[i][2]];
			var vec_diff2 = [this.checkpoints[i+1][0] - this.checkpoints[i][0], this.checkpoints[i+1][2] - this.checkpoints[i][2]];
			var ang_inc = angleVectors(vec_diff1,vec_diff2);
			this.angle -= ang_inc;
			if(true);
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

function angleVectors(vec1,vec2) {
	if(vec1.constructor==Array && vec2.constructor==Array && vec1.length==vec2.length)
	{
		var dProd = dotProduct(vec1,vec2);
		var norm1 = normVector(vec1);
		var norm2 = normVector(vec2);
		return Math.acos(dProd/(norm1*norm2));
	}
	return null;
};

function dotProduct(vec1,vec2) {
	if(vec1.constructor==Array && vec2.constructor==Array && vec1.length==vec2.length && vec1.length>0)
	{
		var product=0;
		for(var i=0; i<vec1.length; i++)
		{
			product+=vec1[i]*vec2[i];
		}
		return product;
	}
	return null;
};

function normVector(vec) {
	if(vec.constructor==Array && vec.length>0)
	{
		var sum=0;
		for (var i = 0; i < vec.length; i++) {
			sum += vec[i]*vec[i];
		}
		return Math.sqrt(sum);
	}
	return null;
};