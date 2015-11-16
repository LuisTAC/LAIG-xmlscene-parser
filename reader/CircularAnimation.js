/**
 * CircularAnimation
 * @constructor
 */

function CircularAnimation(scene, id, span, center, angle_beg, angle_rot, radius) {
 	Animation.call(this, scene, id, span);
	
 	this.type="circular";

	this.center=center;
	this.x=center[0];
	this.y=center[1];
	this.z=center[2];

	this.radius = radius;

	this.angle_beg = angle_beg*degToRad;
	this.angle_rot = angle_rot*degToRad;
	
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(currTime) {
	if(this.beg_time == null) this.beg_time = currTime;
	else 
	{
		if((currTime-this.beg_time) >= this.span) return;
		else 
		{
			// Calculates angles to rotate
			var ang_inc = (this.angle_rot*(currTime-this.beg_time))/this.span;
			var total_rot = ang_inc+this.angle_beg;

			// Translates node to its center
			mat4.translate(this.node.matrix, this.node.beg_matrix, [this.x, this.y, this.z]);

			// Rotates the desired angle
			mat4.rotateY(this.node.matrix, this.node.matrix, total_rot);

			// Translates according to its radius
			mat4.translate(this.node.matrix, this.node.matrix, [this.radius, 0, 0]);
		}
	}
};