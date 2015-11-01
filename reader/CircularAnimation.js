/**
 * CircularAnimation
 * @constructor
 */

function CircularAnimation(scene, id, time, center, angle_beg, angle_rot) {
 	Animation.call(this, scene, id, time);
	
 	this.type="circular";

	this.center=center;
	this.x=center[0];
	this.y=center[1];
	this.z=center[2];

	this.angle=angle_beg;
	this.angle_diff=angle_rot/time;
	
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(currTime) {
	
};

CircularAnimation.prototype.apply = function() {
	//this.scene.rotate();
	//this.scene.translate();
};