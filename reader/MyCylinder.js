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

 	var radius_diff = this.top_r - this.bottom_r;
 	var patch_height = radius_diff/this.sections_height;

 	var radius = parseFloat(this.bottom_r);

 	for (var j=0; j<=this.sections_height; j++) { //stacks
	 	for (var i=0; i<this.parts_section; i++) { //slices
	 		this.vertices.push(radius*Math.cos(i*angle), radius*Math.sin(i*angle), (this.height*j/this.sections_height));
	 		this.normals.push(radius*Math.cos(i*angle), radius*Math.sin(i*angle), 0);
	 	};
	 	radius+=patch_height;
 	};

 	for (var j=0; j<this.sections_height; j++) { //stacks
	 	for (var i=0; i<this.parts_section; i++) { //slices
	 		if(i==this.parts_section-1)
	 		{
	 			this.indices.push(j*this.parts_section+i, j*this.parts_section, (j+1)*this.parts_section+i);
	 			this.indices.push(j*this.parts_section, (j+1)*this.parts_section, (j+1)*this.parts_section+i);
	 		}
	 		else
	 		{
	 			this.indices.push(j*this.parts_section+i, j*this.parts_section+i+1, (j+1)*this.parts_section+i);
	 			this.indices.push(j*this.parts_section+i+1, (j+1)*this.parts_section+i+1, (j+1)*this.parts_section+i);
	 		}
	 	};
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
