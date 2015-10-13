/**
 * MyCylinder
 * @constructor
 */

function MyCylinder(scene, height, bottom_r, top_r, sections_height, parts_section) {
 	CGFobject.call(this,scene);
	
	this.height = height;
	this.bottom_r = bottom_r;
	this.top_r = top_r;
	this.sections_height = sections_height;
	this.parts_section = parts_section;

 	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

	var angle = (360/this.parts_section) * degToRad;

 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];

 	for (var j=0; j<this.sections_height; j++) {
	 	for (var i=0; i<this.parts_section; i++) {
	 		this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), (j/this.sections_height));
	 		this.normals.push(Math.cos(i*angle), Math.sin(i*angle), 0);

	 		this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), ((j+1)/this.sections_height));
	 		this.normals.push(Math.cos(i*angle), Math.sin(i*angle), 0);

	 	};

	 	var temp = j*2*this.parts_section;

	 	for(var i=0;i<this.parts_section-1; i++) {
	 		this.indices.push(temp+i*2,temp+i*2+2,temp+i*2+1);
	 		this.indices.push(temp+i*2+2,temp+i*2+3,temp+i*2+1);
	 	};
	 	this.indices.push(temp+(2*this.parts_section)-2,temp,temp+(2*this.parts_section)-1);
	 	this.indices.push(temp,temp+1,temp+(2*this.parts_section)-1);


 	};

 	var patchS=1/this.parts_section;
 	var patchT=1/this.sections_height;

 	this.texCoords = [];

 	for (var j=0; j<this.sections_height; j++) {
	 	for (var i=0; i<this.parts_section; i++) {
	 		this.texCoords.push(i*patchS,j*patchT);

	 		this.texCoords.push(i*patchS,(j+1)*patchT);
	 	};
 	};


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};
