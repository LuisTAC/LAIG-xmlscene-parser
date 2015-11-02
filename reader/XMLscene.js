var degToRad = Math.PI/180.0;

function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.paused = false;
    this.updateSpeed=1;

    this.enableTextures(true);

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

XMLscene.prototype.dfs_init = function() {
    for(var i=0; i<this.graph.node_ret.length; i++) {
        this.graph.node_ret[i].visited = false;
    };

    // Creates Transformations matrix
    var matrix = mat4.create();
    mat4.identity(matrix);

    // Initials processing
    // Scalings
    mat4.scale(matrix, matrix, [this.graph.initials.scale["sx"], this.graph.initials.scale["sy"], this.graph.initials.scale["sz"]]);

    // Rotations
    for(var i=0; i<this.graph.initials.rotation.length; i++) {
        var axis = this.graph.initials.rotation[i]["axis"];

        switch(axis) {
            case "x":
                mat4.rotateX(matrix, matrix, this.graph.initials.rotation[i]["angle"]*degToRad);
                break;
            case "y":
                mat4.rotateY(matrix, matrix, this.graph.initials.rotation[i]["angle"]*degToRad);
                break;
            case "z":
                mat4.rotateZ(matrix, matrix, this.graph.initials.rotation[i]["angle"]*degToRad);
                break;
        }
    };

    // Translations
    mat4.translate(matrix, matrix, [this.graph.initials.translate["x"], this.graph.initials.translate["y"], this.graph.initials.translate["z"]]);

    // Applies matrix to scene
    this.multMatrix(matrix);

    this.pushMatrix();

    /* -------------------------------------------------- */
    // MATERIALS //
    // Declares and initializes Materials stack
    this.materialStack = [];
    // Default appearance
    var defaulApp = new CGFappearance(this);

    this.materialStack.push(defaulApp);
    /* -------------------------------------------------- */
    // TEXTURES //
    this.textureStack = [];
    /* -------------------------------------------------- */


    var root = this.graph.getNodeObjByID(this.graph.nodes["rootID"]);
    this.dfs(root);
};

XMLscene.prototype.dfs = function(elem) {

    if(elem.leaf)
    {
        var prim = this.graph.primitives[elem.id];
        if(this.textureStack.length>0) {
            if(this.textureStack[this.textureStack.length - 1]!=null) {
                prim.updateTex(this.textureStack[this.textureStack.length - 1].fact_s, this.textureStack[this.textureStack.length - 1].fact_t);
            }
            this.materialStack[this.materialStack.length - 1].setTexture(this.textureStack[this.textureStack.length - 1]);
        }
        this.materialStack[this.materialStack.length - 1].apply();
        prim.display();
    }
    else {
        // Materials application
        if(elem.material != null) {
            this.materialStack.push(elem.material);
        }

        if(elem.texture=="clear") {
            this.textureStack.push(null); //TODO IS THIS RIGHT???
        }
        else if(elem.texture!="null"){
            this.textureStack.push(elem.texture);
        }
        // Applies Nodes Geo Transf matrix to scene
        this.multMatrix(elem.matrix);

        for(var i=0; i<elem.descendants.length; i++) {
            this.pushMatrix();

            this.dfs(elem.descendants[i]);

            this.popMatrix();
        };

        if(elem.material != null) {
            this.materialStack.pop();
        }

        if(elem.texture != "null" && elem.texture != "clear") {
            this.textureStack.pop();
        }
    }
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
	this.gl.clearColor(this.graph.background["r"],this.graph.background["g"],this.graph.background["b"],this.graph.background["a"]);
	
    //Build new axis
    if(this.graph.initials.reference!=0) this.axis = new CGFaxis(this,this.graph.initials.reference);

    //ILLUMINATION -> ambient
    var amb_r = this.graph.ambient["r"];
    var amb_g = this.graph.ambient["g"];
    var amb_b = this.graph.ambient["b"];
    var amb_a = this.graph.ambient["a"];
    this.setGlobalAmbientLight(amb_r, amb_g, amb_b, amb_a);

    this.initLights();
    //this.lights[0].setVisible(true);
    //this.lights[0].enable();

    this.initCameras(this.graph.initials.frustum["near"], this.graph.initials.frustum["far"]);
    myInterface.setActiveCamera(this.camera);
    
    this.initMaterials();

    // Tests
    /*var floor = this.graph.node_ret[42];
    var light = this.graph.node_ret[43];
    var triangle = this.graph.node_ret[53];
    var sphere = this.graph.node_ret[54];

    this.rectangle = new MyRectangle(this, floor.args["x1"], floor.args["y1"], floor.args["x2"], floor.args["y2"]);
    this.cylinder = new MyCylinder(this, light.args["height"], light.args["bottom_r"], light.args["top_r"], light.args["sections_h"], light.args["parts_sec"]);
    this.triangle = new MyTriangle(this, triangle.args["xt_1"], triangle.args["yt_1"], triangle.args["zt_1"], triangle.args["xt_2"], triangle.args["yt_2"], triangle.args["zt_2"], triangle.args["xt_3"], triangle.args["yt_3"], triangle.args["zt_3"]);
    this.sphere = new MySphere(this, sphere.args["radius"], sphere.args["parts_r"], sphere.args["parts_sec"]);*/
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

        this.dfs_init();

	};	

    this.shader.unbind();
};

XMLscene.prototype.update = function(currTime) {

};