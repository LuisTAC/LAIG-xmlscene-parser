/**
 * MyRectangle
 * @constructor
 */
 
function MyRectangle(scene, x1, y1, x2, y2, s, t) {

	CGFobject.call(this,scene);
 	this.x1=x1;
 	this.y1=y1;
 	this.x2=x2;
 	this.y2=y2;

 	//this.minS=minS;
 	//this.maxS=maxS;
 	//this.minT=minT;
 	//this.maxT=maxT;

 	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {
 	this.vertices = [
 	x1, y2, 0,
 	x2, y2, 0,
 	x1, y1, 0,
 	x2, y1, 0
 	];

 	this.indices = [
 	0, 1, 2, 
 	3, 2, 1
 	];

 	this.primitiveType = this.scene.gl.TRIANGLES;

	this.normals = [
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1
	];
	
	/*
	this.texCoords = [
	this.minS, this.maxT ,
	this.maxS, this.maxT ,
	this.minS, this.minT ,
	this.maxS, this.minT
	];
	*/

 	this.initGLBuffers();
};
