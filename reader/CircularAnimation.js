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

			// Moves the node according to the given radius
			mat4.translate(this.node.matrix, this.node.beg_matrix, [this.radius*Math.cos(total_rot), 0, this.radius*Math.sin(total_rot)]);

			// Moves the node to the desired center
			mat4.translate(this.node.matrix, this.node.matrix, [this.x, this.y, this.z]);

			// Rotates node Matrix from the Matrix_Beg
			//mat4.rotateY(this.node.matrix, this.node.matrix, total_rot);		
		}
	}
};