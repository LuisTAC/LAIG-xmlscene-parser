/**
 * Animation
 * @constructor
 */

function Animation(scene, id, time) {

	this.id=id;
 	this.time=time;
 	this.state=0;
 	this.scene=scene;

 	this.type=null;
};

//Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;
