/**
 * Animation
 * @constructor
 */

function Animation(scene, id, time, node) {

	this.id=id;
 	this.time=time;
 	this.node=node;
 	this.state=0;
 	this.scene=scene;
};

//Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;
