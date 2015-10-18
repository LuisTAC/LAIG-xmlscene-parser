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
 	this.x1, this.y2, 0,
 	this.x2, this.y2, 0,
 	this.x1, this.y1, 0,
 	this.x2, this.y1, 0
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
	
	this.texCoords = [
		0, 0,
		1, 0,
		1, 1,
		0, 1
	];

 	this.initGLBuffers();
};

MyRectangle.prototype.updateTex = function(s, t) {

    this.ampS = s;
    this.ampT = t;

    this.texCoords = [
        0, (this.ltY - this.rbY) / this.ampT,(this.rbX - this.ltX) / this.ampS, 
        (this.ltY - this.rbY) / this.ampT, 0, 0,
        (this.rbX - this.ltX) / this.ampS, 0
    ];

    //this.setTex = true;

    this.updateTexCoordsGLBuffers();
};