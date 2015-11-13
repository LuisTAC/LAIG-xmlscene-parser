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
			var begMatrix = this.node.begMatrix;

			// Moves the node to the desired center
			this.node.matrix = mat4.translate(this.node.matrix, this.node.beg_matrix, [-this.x, -this.y, -this.z]);

			// Rotates the node angle_beg+angle_rot
			var ang_inc = (this.angle_rot*(currTime-this.beg_time))/this.span;
			var total_rot = ang_inc+this.angle_beg;

			// Rotates node Matrix from the Matrix_Beg
			this.node.matrix = mat4.rotateY(this.node.matrix, this.node.matrix, total_rot);

			// Moves the node to the initial center
			this.node.matrix = mat4.translate(this.node.matrix, this.node.matrix, [this.x, this.y, this.z]);
		}
	}
	
};

/*CircularAnimation.prototype.apply = function() {
	//this.scene.rotate();
	//this.scene.translate();
};*/