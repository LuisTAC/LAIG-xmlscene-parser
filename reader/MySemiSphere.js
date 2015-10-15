/**
 * MySemiSphere
 * @constructor
 */
function MySemiSphere(scene, parts_r, parts_sec) {
 	CGFobject.call(this,scene);
	
	this.parts_r=parseInt(parts_r);
	this.parts_sec=parseInt(parts_sec);
 	this.initBuffers();
};

MySemiSphere.prototype = Object.create(CGFobject.prototype);
MySemiSphere.prototype.constructor = MySemiSphere;

MySemiSphere.prototype.initBuffers = function() {

 	var angleXY = (360/this.parts_r) * degToRad;
 	var angleZ = (90/this.parts_sec) * degToRad;

 	this.vertices = [];
 	this.indices = [];

 	var j;
 	for (j=0; j<this.parts_sec; j++) {

 		var radius=Math.cos(angleZ*j);

	 	for (var i=0; i<this.parts_r; i++) {
	 		this.vertices.push(radius*Math.cos(i*angleXY), radius*Math.sin(i*angleXY), Math.sin(j*angleZ));
	 	};

	 	var temp = j*this.parts_r;
	 	
	 	for(var i=0;i<this.parts_r-1 && j!=this.parts_sec-1; i++) {
	 		this.indices.push(temp+i, temp+i+1, temp+i+this.parts_r+1);
	 		this.indices.push(temp+i, temp+i+this.parts_r+1, temp+i+this.parts_r);
	 	};

	 	if(j!=this.parts_sec-1)
	 	{
	 		this.indices.push(temp+this.parts_r-1, temp, temp+this.parts_r);
	 		this.indices.push(temp+this.parts_r-1, temp+this.parts_r, temp+this.parts_r*2-1);
	 	}
 	};

 	this.vertices.push(0,0,1);

 	var last=this.parts_r*this.parts_sec;
 	var first=last-this.parts_r;

 	for(var j=0;j<this.parts_r-1;j++) {
 		this.indices.push(first+j,first+j+1,last);
 	}
 	this.indices.push(last-1,first,last);
 	
 	this.normals=this.vertices;

 	this.primitiveType = this.scene.gl.TRIANGLES;

 	this.texCoords = [];

	for (j=0; j<this.parts_sec; j++) {

 		var radius=Math.cos(angleZ*j);

	 	for (var i=0; i<this.parts_r; i++) {
	 		this.texCoords.push(0.5+radius*Math.cos(i*angleXY)*0.5, 0.5+radius*Math.sin(i*angleXY)*0.5);
	 	};
 	};

 	this.texCoords.push(0.5,0.5);

 	this.initGLBuffers();
};
