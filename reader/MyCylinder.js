/**
 * MyCylinder
 * @constructor
 */

function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
 	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

	var angle = (360/this.slices) * degToRad;

 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];

 	for (var j=0; j<this.stacks; j++) {
	 	for (var i=0; i<this.slices; i++) {
	 		this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), (j/this.stacks));
	 		this.normals.push(Math.cos(i*angle), Math.sin(i*angle), 0);

	 		this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), ((j+1)/this.stacks));
	 		this.normals.push(Math.cos(i*angle), Math.sin(i*angle), 0);

	 	};

	 	var temp = j*2*this.slices;

	 	for(var i=0;i<this.slices-1; i++) {
	 		this.indices.push(temp+i*2,temp+i*2+2,temp+i*2+1);
	 		this.indices.push(temp+i*2+2,temp+i*2+3,temp+i*2+1);
	 	};
	 	this.indices.push(temp+(2*this.slices)-2,temp,temp+(2*this.slices)-1);
	 	this.indices.push(temp,temp+1,temp+(2*this.slices)-1);


 	};

 	var patchS=1/this.slices;
 	var patchT=1/this.stacks;

 	this.texCoords = [];

 	for (var j=0; j<this.stacks; j++) {
	 	for (var i=0; i<this.slices; i++) {
	 		this.texCoords.push(i*patchS,j*patchT);

	 		this.texCoords.push(i*patchS,(j+1)*patchT);
	 	};
 	};


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};
