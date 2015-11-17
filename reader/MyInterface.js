/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	/*
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	this.gui.add(this.scene, 'pause');	

	// add a group of controls (and open/expand by defult)
	
	var lights=this.gui.addFolder("Luzes");
	lights.open();

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	
	lights.add(this.scene, 'luz0');
	lights.add(this.scene, 'luz1');
	lights.add(this.scene, 'luz2');
	lights.add(this.scene, 'luz3');
	
	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters
	
	this.gui.add(this.scene, 'speed', -5, 5);
	*/

	return true;
};

/**
 * processKeyDown
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
	//CGFinterface.prototype.processKeyDown.call(this,event);

	var num = event.keyCode - 49;
	if(num<0 || num>7) num = event.keyCode - 97;
	if(num<0 || num>7) return;
	
	this.scene.lights[num].ena = !(this.scene.lights[num].ena);
	//this.scene.lights[num].setVisible(this.scene.lights[num].ena);
	console.log("LIGHT["+num+"] ("+this.scene.graph.lights[num].id+") toggled")

};

