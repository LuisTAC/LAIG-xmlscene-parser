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

	this.axis = new CGFaxis(this);

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

    	this.lights[i].ena = this.graph.lights[i]["enable"];
    	if(this.lights[i].ena) this.lights[i].enable();

        //this.lights[i].setVisible(true);

    	this.lights[i].update();
    };
 
    this.shader.unbind();
};

XMLscene.prototype.updateLights = function() {
    
    for (var i = 0; i < this.graph.lights.length; i++) {
        if(this.lights[i].ena) this.lights[i].enable();
        else this.lights[i].disable();
    };

    for (i = 0; i < this.lights.length; i++)
        this.lights[i].update();
}

XMLscene.prototype.initCameras = function (near, far) {
    near = near || 0.1;
    far = far || 500;
    this.camera = new CGFcamera(0.4, near, far, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.initMaterials = function () {
    
    this.materials=[];
    for (var i = 0; i < this.graph.materials.length; i++) {
        var currAppearance = new CGFappearance(this);

        var id = this.graph.materials[i]["id"];
        var shin = this.graph.materials[i]["shininess"];
        var spec = this.graph.materials[i]["specular"];
        var diff = this.graph.materials[i]["diffuse"];
        var amb = this.graph.materials[i]["ambient"];
        var emi = this.graph.materials[i]["emission"];

        currAppearance.setShininess(shin);
        currAppearance.setSpecular(spec["r"], spec["g"], spec["b"], spec["a"]);
        currAppearance.setDiffuse(diff["r"], diff["g"], diff["b"], diff["a"]);
        currAppearance.setAmbient(amb["r"], amb["g"], amb["b"], amb["a"]);
        currAppearance.setEmission(emi["r"], emi["g"], emi["b"], emi["a"]);
        currAppearance.id=id;

        this.materials[i]=currAppearance;
    };
}

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
	this.gl.clearColor(this.graph.background["r"],this.graph.background["g"],this.graph.background["b"],this.graph.background["a"]);
	
    //Build new axis
    if(this.graph.reference!=0) this.axis = new CGFaxis(this,this.graph.reference);

    //ILLUMINATION -> ambient
    var amb_r = this.graph.ambient["r"];
    var amb_g = this.graph.ambient["g"];
    var amb_b = this.graph.ambient["b"];
    var amb_a = this.graph.ambient["a"];
    this.setGlobalAmbientLight(amb_r, amb_g, amb_b, amb_a);

    this.initLights();
    //this.lights[0].setVisible(true);
    //this.lights[0].enable();

    this.initCameras(this.graph.frustum["near"], this.graph.frustum["far"]);
    myInterface.setActiveCamera(this.camera);
    
    this.initMaterials();

    // Tests
    var floor = this.graph.node_ret[42];
    var light = this.graph.node_ret[43];
    var triangle = this.graph.node_ret[53];
    var sphere = this.graph.node_ret[54];

    this.rectangle = new MyRectangle(this, floor.args["x1"], floor.args["y1"], floor.args["x2"], floor.args["y2"]);
    this.cylinder = new MyCylinder(this, light.args["height"], light.args["bottom_r"], light.args["top_r"], light.args["sections_h"], light.args["parts_sec"]);
    this.triangle = new MyTriangle(this, triangle.args["xt_1"], triangle.args["yt_1"], triangle.args["zt_1"], triangle.args["xt_2"], triangle.args["yt_2"], triangle.args["zt_2"], triangle.args["xt_3"], triangle.args["yt_3"], triangle.args["zt_3"]);
    this.sphere = new MySphere(this, sphere.args["radius"], sphere.args["parts_r"], sphere.args["parts_sec"]);
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
        // Update all lights used
        this.updateLights();

        // Draw axis
        if(this.graph.reference != 0) {
            this.axis.display();
        }

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        };


        // Test drawing functions
       /* this.pushMatrix();
            this.translate(0, 0, 0.5);
            this.rectangle.display();
        this.popMatrix();
        this.cylinder.display();*/
        this.triangle.display();
        //this.sphere.display();

        
        // Sets scale
        /*var sx = this.graph.scale["sx"];
        var sy = this.graph.scale["sy"];
        var sz = this.graph.scale["sz"];
        this.scale(sx, sy, sz);

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
                    this.rotate(ang*degToRad, 0,0,1);
                    break;
                default:
                    console.log("Invalid rotation axis!");
                    break;
            }
        }

        // Sets translate
        var tx = this.graph.translate["x"];
        var ty = this.graph.translate["y"];
        var tz = this.graph.translate["z"];
        this.translate(tx, ty, tz);
        */

        // Sets frustum
        // How exactly are we supposed to do this?

	};	

    this.shader.unbind();
};

