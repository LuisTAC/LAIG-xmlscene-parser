/**
 * Animation
 * @constructor
 */

function Animation(scene, id, span) {

	this.id=id;
 	this.span=span;
 	this.state=0;
 	this.scene=scene;

 	this.type=null;
};

//Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;
