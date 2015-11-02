/**
 * MySphere
 * @constructor
 */
function MySphere(scene, radius, parts_r, parts_sec) {
 	CGFobject.call(this,scene);
	
	this.radius = parseFloat(radius);
	this.parts_r = parseInt(parts_r);
	this.parts_sec = parseInt(parts_sec);
	this.scene = scene;

	this.semi_sphere = new MySemiSphere(scene, parts_r, parts_sec);
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.display = function() {

 	this.scene.pushMatrix();
 		this.scene.scale(this.radius, this.radius, this.radius);
 		this.semi_sphere.display();
 		this.scene.pushMatrix();
 			this.scene.rotate(180*degToRad, 0, 1, 0);
 			this.semi_sphere.display();
 		this.scene.popMatrix();
 	this.scene.popMatrix();

};

MySphere.prototype.updateTex=function(S,T)
{};