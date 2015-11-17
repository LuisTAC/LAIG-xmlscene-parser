/**
 * CompoundAnimation
 * @constructor
 */

function CompoundAnimation(scene, animations) {
 	this.scene = scene;
 	this.node = null;
 	this.animations = animations;
 	this.times = [0];
 	for (var i = 0; i < animations.length; i++) {
 		animations[i].compound=true;
 		this.times[i+1]=animations[i].span+this.times[i];
 	};
 	this.beg_time=null;
};

CompoundAnimation.prototype.constructor = CompoundAnimation;

CompoundAnimation.prototype.setNode = function(node) {
	this.node = node;
	for (var i = 0; i < this.animations.length; i++) {
		this.animations[i].setNode(node);
	};
};

CompoundAnimation.prototype.update = function(currTime) {
	if(this.animations[0].beg_time == null) {
		this.animations[0].update(currTime);
		this.beg_time=this.animations[0].beg_time;
	}
	else
	{
		var time_since_start=currTime-this.beg_time;

		if(time_since_start>this.times[this.times.length-1]) return;

		var i=0;
		for (; i < this.times.length; i++) {
			if(this.times[i]<time_since_start && this.times[i+1]>time_since_start) break;
		};
		this.animations[i].update(currTime);
	}
};