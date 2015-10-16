/**
* MyTriangle
* @Constructor
*/

function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this,scene);

	this.x1=x1;
	this.y1=y1;
	this.z1=z1;

	this.x2=x2;
	this.y2=y2;
	this.z2=z2;

	this.x3=x3;
	this.y3=y3;
	this.z3=z3;

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {
	this.vertices = [
	this.x1, this.y1, this.z1,
	this.x2, this.y2, this.z2,
	this.x3, this.y3, this.z2
	];

	this.indices = [
	0, 1, 2
	];

	this.primitiveType = this.scene.gl.TRIANGLES;

	this.normals = [];

	var u_vec = [];
	u_vec[0] = this.x2 - this.x1;
	u_vec[1] = this.y2 - this.y1;
	u_vec[2] = this.z2 - this.z1;

	var v_vec = [];
	v_vec[0] = this.x3 - this.x1;
	v_vec[1] = this.y3 - this.y1;
	v_vec[2] = this.z3 - this.z1;

	this.normals[0] = (u_vec[1]*v_vec[2]) - (u_vec[2]*v_vec[1]);
	this.normals[1] = (u_vec[2]*v_vec[0]) - (u_vec[0]*v_vec[2]);
	this.normals[2] = (u_vec[0]*v_vec[1]) - (u_vec[1]*v_vec[0]);

	this.normals[3] = (u_vec[1]*v_vec[2]) - (u_vec[2]*v_vec[1]);
	this.normals[4] = (u_vec[2]*v_vec[0]) - (u_vec[0]*v_vec[2]);
	this.normals[5] = (u_vec[0]*v_vec[1]) - (u_vec[1]*v_vec[0]);

	this.normals[6] = (u_vec[1]*v_vec[2]) - (u_vec[2]*v_vec[1]);
	this.normals[7] = (u_vec[2]*v_vec[0]) - (u_vec[0]*v_vec[2]);
	this.normals[8] = (u_vec[0]*v_vec[1]) - (u_vec[1]*v_vec[0]);

	this.initGLBuffers();
};