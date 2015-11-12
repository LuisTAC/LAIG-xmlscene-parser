/**
 * Animation
 * @constructor
 */

function Animation(scene, id, span) {

	this.id=id;
 	this.span=span*1000;//convert secs to milsecs
 	this.scene=scene;
 	this.node=null;

 	this.type=null;
 	this.beg_time=null;
};

//Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;


Animation.prototype.setNode = function(node) {
	this.node = node;
};