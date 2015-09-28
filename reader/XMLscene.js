var degToRad = Math.PI/180.0;

function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    //this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	//this.axis=new CGFaxis(this);

};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

    for (var i = 0; i < this.graph.lights.length && i < 8; i++) {
    	var pos_x = this.graph.lights[i]["position"]["x"];
    	var pos_y = this.graph.lights[i]["position"]["y"];
    	var pos_z = this.graph.lights[i]["position"]["z"];
    	var pos_w = this.graph.lights[i]["position"]["w"];
    	this.lights[i].setPosition(pos_x, pos_y, pos_z, pos_w);

    	var amb_r = this.graph.lights[i]["ambient"]["r"];
    	var amb_g = this.graph.lights[i]["ambient"]["g"];
    	var amb_b = this.graph.lights[i]["ambient"]["b"];
    	var amb_a = this.graph.lights[i]["ambient"]["a"];
    	this.lights[i].setAmbient(amb_r, amb_g, amb_b, amb_a);

    	var dif_r = this.graph.lights[i]["diffuse"]["r"];
    	var dif_g = this.graph.lights[i]["diffuse"]["g"];
    	var dif_b = this.graph.lights[i]["diffuse"]["b"];
    	var dif_a = this.graph.lights[i]["diffuse"]["a"];
    	this.lights[i].setDiffuse(dif_r, dif_g, dif_b, dif_a);

    	var spe_r = this.graph.lights[i]["specular"]["r"];
    	var spe_g = this.graph.lights[i]["specular"]["g"];
    	var spe_b = this.graph.lights[i]["specular"]["b"];
    	var spe_a = this.graph.lights[i]["specular"]["a"];
    	this.lights[i].setSpecular(spe_r, spe_g, spe_b, spe_a);

    	var ena = this.graph.lights[i]["enable"];
    	if(ena) this.lights[i].enable();

    	this.lights[i].update();
    };
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
        // Sets reference
        this.axis=new CGFaxis(this,this.graph.reference);

        // Draw axis
        this.axis.display();

        // Sets scale
        var x = this.graph.scale["sx"];
        var y = this.graph.scale["sy"];
        var z = this.graph.scale["sz"];
        this.scale(x, y, z);

        // Sets rotation
        for(var i=0; i<this.graph.rotation.length; i++) {
            var ang = this.graph.rotation[i]["angle"];
            console.log(ang);
            switch(this.graph.rotation[i]["axis"]) {
                case "x":
                    this.rotate(ang*degToRad, 1,0,0);
                    break;
                case "y":
                    this.rotate(ang*degToRad, 0,1,0);
                    break;
                case "z":
                    this.rotate(ang * degToRad, 0,0,1);
                    break;
                default:
                    console.log("Invalid rotation axis!");
                    break;
            }
        }

        // IS THIS THE RIGHT PLACE? SHOULD THE TRANSFORMATIONS AFFECT THE LIGHTS?
		this.initLights();

	};	

    this.shader.unbind();
};

