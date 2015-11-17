
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	//this.reader.open('scenes/'+filename, this);  
	this.path = "scenes/" + filename;
	this.dir = filename.substr(0,filename.lastIndexOf("/"));

	this.finalDir = "scenes/" + this.dir + "/";

	this.reader.open(this.path, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	// Parse illumination
	var error = this.parseIllumination(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// Parse Lights
	var error = this.parseLights(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	// Parse Textures
	var error = this.parseTextures(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// Parse Materials
	var error = this.parseMaterials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parseAnimations(rootElement);
	if(error != null) {
		this.onXMLError(error);
		return;
	}

	// Parse Leaves
	var error = this.parseLeaves(rootElement);
	if(error != null) {
		this.onXMLError(error);
		return;
	}

	this.buildPrimitives();

	// Parse Nodes
	var error = this.parseNodes(rootElement);
	if(error != null) {
		this.onXMLError(error);
		return;
	}

	// Build Graph
	var error = this.buildGraph();
	if(error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseInitials = function(rootElement) {
	
	console.log("INITIALS:");

	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) return "INITIALS element is missing.";
	if (elems.length != 1) return "invalid number of 'INITIALS' elements found. (expected=1; found="+elems.length+")";
	var initials = elems[0];

	//FRUSTUM
	var elems = initials.getElementsByTagName('frustum');
	if (elems == null)  return "frustum element is missing.";
	if (elems.length != 1) return "invalid number of 'frustum' elements found. (expected=1; found="+elems.length+")";

	this.initials=[];

	var frustum = elems[0];

	this.initials.frustum=[];
	this.initials.frustum['near']=this.reader.getFloat(frustum,'near',true);
	this.initials.frustum['far']=this.reader.getFloat(frustum,'far',true);
	console.log("\tFRUSTUM - near:"+this.initials.frustum['near']);
	console.log("\tFRUSTUM - far:"+this.initials.frustum['far']);

	//TRANSLATE
	var elems = initials.getElementsByTagName('translation');
	if (elems == null)  return "translate element is missing.";
	if (elems.length != 1) return "invalid number of 'translate' elements found. (expected=1; found="+elems.length+")";

	var translate = elems[0];

	this.initials.translate=[];
	this.initials.translate['x']=this.reader.getFloat(translate,'x',true);
	this.initials.translate['y']=this.reader.getFloat(translate,'y',true);
	this.initials.translate['z']=this.reader.getFloat(translate,'z',true);
	console.log("\tTRANSLATE - x:"+this.initials.translate['x']);
	console.log("\tTRANSLATE - y:"+this.initials.translate['y']);
	console.log("\tTRANSLATE - z:"+this.initials.translate['z']);

	//ROTATIONS
	var elems = initials.getElementsByTagName('rotation');
	if (elems == null)  return "rotation element is missing.";
	if (elems.length != 3) return "invalid number of 'rotation' elements found. (expected=3; found="+elems.length+")";

	this.initials.rotation=[[],[],[]];
	for (var i=0; i<3; i++)
	{

		var rotation = elems[i];

		this.initials.rotation[i]['axis']=this.reader.getString(rotation,'axis',true);
		if(this.initials.rotation[i]['axis']!='x' &&
			this.initials.rotation[i]['axis']!='y' &&
			this.initials.rotation[i]['axis']!='z')
			return "invalid "+(i+1)+" 'axis' value found. (expected=[x,y,z]; found="+this.initials.rotation[i]['axis']+")";
		
		this.initials.rotation[i]['angle']=this.reader.getFloat(rotation,'angle',true);
		console.log("\tROTATION["+i+"] - axis:"+this.initials.rotation[i]['axis']);
		console.log("\tROTATION["+i+"] - angle:"+this.initials.rotation[i]['angle']);
	}
	
	//SCALE
	var elems = initials.getElementsByTagName("scale");
	if (elems == null)  return "scale element is missing.";
	if (elems.length != 1) return "invalid number of 'scale' elements found. (expected=1; found="+elems.length+")";

	var scale = elems[0];

	this.initials.scale=[];
	this.initials.scale["sx"]=this.reader.getFloat(scale,"sx",true);
	this.initials.scale["sy"]=this.reader.getFloat(scale,"sy",true);
	this.initials.scale["sz"]=this.reader.getFloat(scale,"sz",true);
	console.log("\tSCALE - sx:"+this.initials.scale["sx"]);
	console.log("\tSCALE - sy:"+this.initials.scale["sy"]);
	console.log("\tSCALE - sz:"+this.initials.scale["sz"]);

	//REFERENCE

	var elems = initials.getElementsByTagName('reference');
	if (elems == null)  return "reference element is missing.";
	if (elems.length != 1) return "invalid number of 'reference' elements found. (expected=1; found="+elems.length+")";

	var reference = elems[0];

	this.initials.reference=this.reader.getFloat(reference,'length',true);

	console.log("\tREFERENCE:"+this.initials.reference);
};
	
MySceneGraph.prototype.parseIllumination = function(rootElement) {
	var illuminations = rootElement.getElementsByTagName("ILLUMINATION");
	if(illuminations == null) return "illumination values missing";

	if(illuminations.length != 1) return "0 or more illuminations were found!";


	//gets each illumination element*/
	var illuminationElems = illuminations[0];

	//ambient
	var ambients = illuminationElems.getElementsByTagName("ambient");
	if(ambients == null) return "ambient values missing";
	if(ambients.length != 1) return "0 or more ambient elements were found!";

	var ambient = ambients[0];
	this.ambient = [];
	this.ambient["r"] = this.reader.getFloat(ambient, "r", true);
	this.ambient["g"] = this.reader.getFloat(ambient, "g", true);
	this.ambient["b"] = this.reader.getFloat(ambient, "b", true);
	this.ambient["a"] = this.reader.getFloat(ambient, "a", true);

	console.log("AMBIENT: TEST R(20.0) = "+this.ambient["r"]);
	console.log("AMBIENT: TEST G(56.0) = "+this.ambient["g"]);
	console.log("AMBIENT: TEST B(80.0) = "+this.ambient["b"]);
	console.log("AMBIENT: TEST A(0.25) = "+this.ambient["a"]);

	//doubleside
	var doublesides = illuminationElems.getElementsByTagName("doubleside");
	if(doublesides == null) return "doubleside values missing";
	if(doublesides.length != 1) return "0 or more doubleside	 elements were found!";

	var doubleside = doublesides[0];
	this.doubleside = [];
	this.doubleside["value"] = this.reader.getBoolean(doubleside, "value", true);

	console.log("DOUBLESIDE: TEST VALUE(0) "+this.doubleside["value"]);

	//background
	var backgrounds = illuminationElems.getElementsByTagName("background");
	if(backgrounds == null) return "backgrounds values missing";
	if(backgrounds.length != 1) return "0 or more backgrounds were found!";

	var background = backgrounds[0];
	this.background = [];
	this.background["r"] = this.reader.getFloat(background, "r", true);
	this.background["g"] = this.reader.getFloat(background, "g", true);
	this.background["b"] = this.reader.getFloat(background, "b", true);
	this.background["a"] = this.reader.getFloat(background, "a", true);

	console.log("BACKGROUND: TEST R(20.0) = "+this.background["r"]);
	console.log("BACKGROUND: TEST G(19.0) = "+this.background["g"]);
	console.log("BACKGROUND: TEST B(21.0) = "+this.background["b"]);
	console.log("BACKGROUND: TEST A(1) = "+this.background["a"]);
};

MySceneGraph.prototype.parseLights = function(rootElement) {
	var lights = rootElement.getElementsByTagName("LIGHTS");
	if(lights == null) return "light values missing";
	if(lights.length != 1) return "0 or more lights were found";

	var first_lights = lights[0];

	var ids = [];

	//LIGHT
	var light = first_lights.getElementsByTagName("LIGHT");
	if(light == null) return "light values missing";
	if(light.length < 1) return "0 light elements were found";

	this.lights=[];
	for(var i=0; i<light.length; i++) {
		var currLight = [];
		var iterLight = light[i];

		//stores ids
		currLight["id"] = this.reader.getString(iterLight,"id",true);

		//enable/disable
		var enables = iterLight.getElementsByTagName("enable");
		var enable = enables[0];
		currLight["enable"] = this.reader.getBoolean(enable, "value", true);


		//light position
		var positions = iterLight.getElementsByTagName("position");
		var position = positions[0];
		currLight["position"] = [];
		currLight["position"]["x"] = this.reader.getFloat(position, "x", true);
		currLight["position"]["y"] = this.reader.getFloat(position, "y", true);
		currLight["position"]["z"] = this.reader.getFloat(position, "z", true);
		currLight["position"]["w"] = this.reader.getFloat(position, "w", true);

		//ambient component
		var ambients = iterLight.getElementsByTagName("ambient");
		var ambient = ambients[0];
		currLight["ambient"] = [];
		currLight["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
		currLight["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
		currLight["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
		currLight["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);

		//diffuse component
		var diffuses = iterLight.getElementsByTagName("diffuse");
		var diffuse = diffuses[0];
		currLight["diffuse"] = [];
		currLight["diffuse"]["r"] = this.reader.getFloat(diffuse, "r", true);
		currLight["diffuse"]["g"] = this.reader.getFloat(diffuse, "g", true);
		currLight["diffuse"]["b"] = this.reader.getFloat(diffuse, "b", true);
		currLight["diffuse"]["a"] = this.reader.getFloat(diffuse, "a", true);

		//specular component
		var speculars = iterLight.getElementsByTagName("specular");
		var specular = speculars[0];
		currLight["specular"] = [];
		currLight["specular"]["r"] = this.reader.getFloat(specular, "r", true);
		currLight["specular"]["g"] = this.reader.getFloat(specular, "g", true);
		currLight["specular"]["b"] = this.reader.getFloat(specular, "b", true);
		currLight["specular"]["a"] = this.reader.getFloat(specular, "a", true);

		this.lights[i]=currLight;
	}

	for(var i=0; i<this.lights.length; i++) {
		console.log("LIGHT["+i+"]: "+this.lights[i]["id"]);
		console.log("\tENABLE/DISABLE : TEST = "+this.lights[i]["enable"]);
		console.log("\tPOSITION : TEST(X, Y, Z, W) = ("+this.lights[i]["position"]["x"]+", "+this.lights[i]["position"]["y"]+", "+this.lights[i]["position"]["z"]+", "+this.lights[i]["position"]["w"]+")");
		console.log("\tLIGHT AMBIENT COMPONENT : TEST(R, G, B, A) = ("+this.lights[i]["ambient"]["r"]+", "+this.lights[i]["ambient"]["g"]+", "+this.lights[i]["ambient"]["b"]+", "+this.lights[i]["ambient"]["a"]+")");
		console.log("\tLIGHT DIFFUSE COMPONENT : TEST(R, G, B, A) = ("+this.lights[i]["diffuse"]["r"]+", "+this.lights[i]["diffuse"]["g"]+", "+this.lights[i]["diffuse"]["b"]+", "+this.lights[i]["diffuse"]["a"]+")");
		console.log("\tLIGHT SPECULAR COMPONENT : TEST(R, G, B, A) = ("+this.lights[i]["specular"]["r"]+", "+this.lights[i]["specular"]["g"]+", "+this.lights[i]["specular"]["b"]+", "+this.lights[i]["specular"]["a"]+")");	
	}
};

MySceneGraph.prototype.parseTextures = function(rootElement) {
	var textures = rootElement.getElementsByTagName("TEXTURES");
	if(textures == null) return "textures values missing";
	if(textures.length != 1) return "0 or more textures were found";

	var first_textures = textures[0];

	var texture = first_textures.getElementsByTagName("TEXTURE");
	if(texture == null) return "texture values missing";
	if(texture.length < 1) return "0 or more 'texture' were found";

	this.textures = [];
	for(var i=0; i<texture.length; i++) {
		var currTexture = [];
		var iterTexture = texture[i];

		currTexture["id"] = this.reader.getString(iterTexture, "id", true);

		var files = iterTexture.getElementsByTagName("file");
		var file = files[0];
		currTexture["file"] = this.finalDir + this.reader.getString(file, "path", true);

		var amplif_factors = iterTexture.getElementsByTagName("amplif_factor");
		var amplif_factor = amplif_factors[0];
		currTexture["amplif_factor"] = [];
		currTexture["amplif_factor"]["s"] = this.reader.getFloat(amplif_factor, "s", true);
		currTexture["amplif_factor"]["t"] = this.reader.getFloat(amplif_factor, "t", true);

		this.textures[i] = currTexture;
	}

	for(var i=0; i<this.textures.length; i++) {
		console.log("TEXTURE #"+i+" ID : "+this.textures[i]["id"]);
		console.log("\tAMPLIF_FACTOR S : "+this.textures[i]["amplif_factor"]["s"]);
		console.log("\tAMPLIF_FACTOR T : "+this.textures[i]["amplif_factor"]["t"]);
	}
};

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	var materials = rootElement.getElementsByTagName("MATERIALS");
	if(materials == null) return "materials values missing";
	if(materials.length != 1) return "0 or more materials were found";

	var first_materials = materials[0];

	var material = first_materials.getElementsByTagName("MATERIAL");
	if(material == null) return "material values missing";
	if(material.length < 1) return "0 or more 'material' were found";

	this.materials=[];
	for (var i = 0; i < material.length; i++) {
		var currMaterial = [];
		var iterMaterial = material[i];

		//stores ids
		currMaterial["id"] = this.reader.getString(iterMaterial,"id",true);

		//enable/disable
		var shininesses = iterMaterial.getElementsByTagName("shininess");
		var shininess = shininesses[0];
		currMaterial["shininess"] = this.reader.getFloat(shininess, "value", true);

		//specular component
		var speculars = iterMaterial.getElementsByTagName("specular");
		var specular = speculars[0];
		currMaterial["specular"] = [];
		currMaterial["specular"]["r"] = this.reader.getFloat(specular, "r", true);
		currMaterial["specular"]["g"] = this.reader.getFloat(specular, "g", true);
		currMaterial["specular"]["b"] = this.reader.getFloat(specular, "b", true);
		currMaterial["specular"]["a"] = this.reader.getFloat(specular, "a", true);


		//diffuse component
		var diffuses = iterMaterial.getElementsByTagName("diffuse");
		var diffuse = diffuses[0];
		currMaterial["diffuse"] = [];
		currMaterial["diffuse"]["r"] = this.reader.getFloat(diffuse, "r", true);
		currMaterial["diffuse"]["g"] = this.reader.getFloat(diffuse, "g", true);
		currMaterial["diffuse"]["b"] = this.reader.getFloat(diffuse, "b", true);
		currMaterial["diffuse"]["a"] = this.reader.getFloat(diffuse, "a", true);

		//ambient component
		var ambients = iterMaterial.getElementsByTagName("ambient");
		var ambient = ambients[0];
		currMaterial["ambient"] = [];
		currMaterial["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
		currMaterial["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
		currMaterial["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
		currMaterial["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);

		//emission component
		var emissions = iterMaterial.getElementsByTagName("emission");
		var emission = emissions[0];
		currMaterial["emission"] = [];
		currMaterial["emission"]["r"] = this.reader.getFloat(emission, "r", true);
		currMaterial["emission"]["g"] = this.reader.getFloat(emission, "g", true);
		currMaterial["emission"]["b"] = this.reader.getFloat(emission, "b", true);
		currMaterial["emission"]["a"] = this.reader.getFloat(emission, "a", true);

		this.materials[i]=currMaterial;
	};

	for(var i=0; i<this.materials.length; i++) {
		console.log("MATERIAL["+i+"]: "+this.materials[i]["id"]);
		console.log("\tSHININESS : TEST = "+this.materials[i]["shininess"]);
		console.log("\tLIGHT SPECULAR COMPONENT : TEST(R, G, B, A) = ("+this.materials[i]["specular"]["r"]+", "+this.materials[i]["specular"]["g"]+", "+this.materials[i]["specular"]["b"]+", "+this.materials[i]["specular"]["a"]+")");
		console.log("\tLIGHT DIFFUSE COMPONENT : TEST(R, G, B, A) = ("+this.materials[i]["diffuse"]["r"]+", "+this.materials[i]["diffuse"]["g"]+", "+this.materials[i]["diffuse"]["b"]+", "+this.materials[i]["diffuse"]["a"]+")");
		console.log("\tLIGHT AMBIENT COMPONENT : TEST(R, G, B, A) = ("+this.materials[i]["ambient"]["r"]+", "+this.materials[i]["ambient"]["g"]+", "+this.materials[i]["ambient"]["b"]+", "+this.materials[i]["ambient"]["a"]+")");
		console.log("\tLIGHT EMISSION COMPONENT : TEST(R, G, B, A) = ("+this.materials[i]["emission"]["r"]+", "+this.materials[i]["emission"]["g"]+", "+this.materials[i]["emission"]["b"]+", "+this.materials[i]["emission"]["a"]+")");
	}
};

MySceneGraph.prototype.parseAnimations = function(rootElement) {
	var animations = rootElement.getElementsByTagName("ANIMATIONS");
	if(animations == null) return "animations elements missing";
	if(animations.length != 1) return "0 or more animations were found";

	var first_animations = animations[0];

	var animation_array = first_animations.getElementsByTagName("ANIMATION");
	
	this.animations = [];
	for(var i=0; i<animation_array.length; i++) {
		var currAnimation = [];
		var iterAnimation = animation_array[i];

		// Stores id in the first place
		var id = this.reader.getString(iterAnimation, "id", true);
		var span = this.reader.getInteger(iterAnimation, "span", true);
		var type = this.reader.getString(iterAnimation, "type", true);

		if(type=="linear")
		{
			var controlpoint_array = first_animations.getElementsByTagName("CONTROLPOINT");

			var checkpoints =[[],[]];
			for(var j=0; j<controlpoint_array.length; j++) {
				var iterCheck = controlpoint_array[j];
				var x = this.reader.getFloat(iterCheck, "xx", true);
				var y = this.reader.getFloat(iterCheck, "yy", true);
				var z = this.reader.getFloat(iterCheck, "zz", true);
				checkpoints[j]=[x,y,z];
			}
			currAnimation = new LinearAnimation(this.scene, id, span, checkpoints);
		}
		else if(type=="circular")
		{
			var center = this.reader.getVector3(iterAnimation, "center", true);
			var radius = this.reader.getFloat(iterAnimation, "radius", true);
			var startang = this.reader.getFloat(iterAnimation, "startang", true);
			var rotang = this.reader.getFloat(iterAnimation, "rotang", true);
			currAnimation = new CircularAnimation(this.scene, id, span, center, startang, rotang, radius);
		}
		else return "wrong animation type on animation["+id+"]";
		this.animations[id]=currAnimation;
	}
};

MySceneGraph.prototype.parseLeaves = function(rootElement) {
	var leaves = rootElement.getElementsByTagName("LEAVES");
	if(leaves == null) return "leaves elements missing";
	if(leaves.length != 1) return "0 or more leaves were found";

	var first_leaves = leaves[0];

	var leaf_array = first_leaves.getElementsByTagName("LEAF");
	if(leaf_array == null) return "leaf values missing";
	if(leaf_array.length < 1) return "0 leaf elements found";

	this.leaves = [];
	for(var i=0; i<leaf_array.length; i++) {
		var currLeaf = [];
		var iterLeaf = leaf_array[i];

		// Stores id in the first place
		currLeaf["id"] = this.reader.getString(iterLeaf, "id", true);

		// Stores "args" according to "type"
		var leaf_type = this.reader.getString(iterLeaf, "type", true);
		currLeaf["type"] = leaf_type;

		if(leaf_type != "patch" && leaf_type != "plane" && leaf_type != "terrain") {
			// Stores each argument into currLeaf[]
			var args = this.reader.getString(iterLeaf, "args", true);
			var split_args = args.split(" ");
			for(var j=0; j<split_args.length; j++)
			{
				if(isNaN(split_args[j])) return "invalid leaf args (@LEAF["+i+"]="+currLeaf["id"]+" args["+j+"]="+split_args[j]+")!";
			}
	
			currLeaf["args"] = [];
			switch(leaf_type) {
				// CAN CONVERT HERE TO INT OR FLOAT IF NEEDED!
				case "rectangle":
					// Get each argument into the array
					currLeaf["args"]["x1"] = split_args[0];
					currLeaf["args"]["y1"] = split_args[1];
					currLeaf["args"]["x2"] = split_args[2];
					currLeaf["args"]["y2"] = split_args[3];
					break;
				case "cylinder":
					// Get each argument into the array
					currLeaf["args"]["height"] = split_args[0];
					currLeaf["args"]["bottom_r"] = split_args[1];
					currLeaf["args"]["top_r"] = split_args[2];
					currLeaf["args"]["sections_h"] = split_args[3];
					currLeaf["args"]["parts_sec"] = split_args[4];
					break;
				case "sphere":
					// Get each argument into the array
					currLeaf["args"]["radius"] = split_args[0];
					currLeaf["args"]["parts_r"] = split_args[1];
					currLeaf["args"]["parts_sec"] = split_args[2];
					break;
				case "triangle":
					// Get each argument into the array
					currLeaf["args"]["xt_1"] = split_args[0];
					currLeaf["args"]["yt_1"] = split_args[1];
					currLeaf["args"]["zt_1"] = split_args[2];
	
					currLeaf["args"]["xt_2"] = split_args[3];
					currLeaf["args"]["yt_2"] = split_args[4];
					currLeaf["args"]["zt_2"] = split_args[5];
	
					currLeaf["args"]["xt_3"] = split_args[6];
					currLeaf["args"]["yt_3"] = split_args[7];
					currLeaf["args"]["zt_3"] = split_args[8];
					break;
				default:
					return "Not valid leaf type";
				}
			}
			else if(leaf_type == "patch") { // Processes a patch type leaf

				currLeaf["order"] = this.reader.getInteger(iterLeaf, "order", true);

				currLeaf["partsU"] = this.reader.getInteger(iterLeaf, "partsU", true);
				currLeaf["partsV"] = this.reader.getInteger(iterLeaf, "partsV", true);

				var controlpointsets_array = iterLeaf.getElementsByTagName("CONTROLPOINTSET");
				if(controlpointsets_array== null || controlpointsets_array.length==0) return "no controlpointsets were found";

				var cp_number = 0;
				for(var j=0; j<controlpointsets_array.length; j++) {
					cp_number += controlpointsets_array[j].children.length;
				}

				if(cp_number != ((currLeaf["order"]+1)*(currLeaf["order"]+1))) return "invalid controlpoints number "+cp_number+" found!";

				var controlpoints = [];
				for (var j = 0; j < controlpointsets_array.length; j++) {

					var controlpoints_array = controlpointsets_array[j].getElementsByTagName('CONTROLPOINT');
					if(controlpoints_array == null || controlpoints_array.length==0) return "no controlpoints were found";

					var set=[];
					for(var u=0; u<controlpoints_array.length; u++) {
						var iterContr = controlpoints_array[u];
						var x = this.reader.getFloat(iterContr, "x", true);
						var y = this.reader.getFloat(iterContr, "y", true);
						var z = this.reader.getFloat(iterContr, "z", true);
						// ISN'T ALWAYS ONE?
						set.push([x, y, z, 1]);
					}
					controlpoints.push(set);
				};
				currLeaf["controlpoints"] = controlpoints;
			}
			else if(leaf_type == "plane"){ // Processes a plane type leaf
				currLeaf["parts"] = this.reader.getInteger(iterLeaf, "parts", true);
			}
			else if(leaf_type == "terrain") { // Processes a Terrain primitve
				currLeaf["texture"] = this.reader.getString(iterLeaf, "texture", true);
				currLeaf["height"] = this.reader.getString(iterLeaf, "heightmap", true);
			}
			else return "invalid primitive type";
			this.leaves[i] = currLeaf;
		}

	for(var i=0; i<this.leaves.length; i++) {
		console.log(this.leaves[i]);
	}
};

MySceneGraph.prototype.buildPrimitives = function() {
	this.primitives=[];
	for(var i=0; i<this.leaves.length; i++)
	{
		var id=this.leaves[i]["id"];
		var type=this.leaves[i]["type"];
		if((type != "patch") && (type != "plane")) {
			var args=this.leaves[i]["args"];
		}
		switch(type)
		{
			case "rectangle":
				this.primitives[id] = new MyRectangle(this.scene, args["x1"], args["y1"], args["x2"], args["y2"]);
				break;
			case "cylinder":
				this.primitives[id] = new MyCylinder(this.scene, args["height"], args["bottom_r"], args["top_r"], args["sections_h"], args["parts_sec"]);
				break;
			case "sphere":
				this.primitives[id] = new MySphere(this.scene, args["radius"], args["parts_r"], args["parts_sec"]);
				break;
			case "triangle":
				this.primitives[id] = new MyTriangle(this.scene, args["xt_1"], args["yt_1"], args["zt_1"], args["xt_2"], args["yt_2"], args["zt_2"], args["xt_3"], args["yt_3"], args["zt_3"]);
				break;
			case "patch":
				this.primitives[id] = new MyPatch(this.scene, this.leaves[i]["order"], this.leaves[i]["partsU"], this.leaves[i]["partsV"], this.leaves[i]["controlpoints"]);
				break;
			case "plane":
				this.primitives[id] = new MyPlane(this.scene, this.leaves[i]["parts"]);
				break;
			case "terrain":
				var texture_arr = this.getTextureByID(this.leaves[i]["texture"]);
				var height_arr = this.getTextureByID(this.leaves[i]["height"]);
				var texture = new CGFtexture(this.scene,texture_arr["file"]);
				var heightmap = new CGFtexture(this.scene,height_arr["file"]);;
				this.primitives[id] = new MyTerrain(this.scene, 50, texture, heightmap);
				break;
		}
	}
};

MySceneGraph.prototype.parseNodes = function(rootElement) {
	var nodes = rootElement.getElementsByTagName("NODES");
	if(nodes.length == null) return "nodes elements missing";
	if(nodes.length != 1) return "0 or more nodes were found";

	var first_nodes = nodes[0];

	this.nodes = [];

	// Stores ROOT node first
	var root = first_nodes.getElementsByTagName("ROOT");
	if(root.length == null) return "no root node found";
	if(root.length != 1) return "0 or more root nodes found";
	this.nodes["rootID"] = this.reader.getString(root[0], "id", true);

	// Stores all NODE elements after rootID
	var node_array = first_nodes.getElementsByTagName("NODE");
	if(node_array == null) return "no node elems found";
	if(node_array < 1) return "0 node elems found";

	for(var i=0; i<node_array.length; i++) {
		var currNode = [];
		var iterNode = node_array[i];

		// Stores NODE id
		currNode["id"] = this.reader.getString(iterNode, "id", true);

		// Stores MATERIAL from currNode
		var nodeMaterials = iterNode.getElementsByTagName("MATERIAL");
		if(nodeMaterials == null) return "no MATERIAL elems found";
		if(nodeMaterials < 1) return "0 MATERIAL elems found";

		var nodeMaterial = nodeMaterials[0];
		var nodeMaterialID = this.reader.getString(nodeMaterial, "id", true);

		// Checks if material exists
		if(nodeMaterialID == "null") currNode["materialID"] = nodeMaterialID;
		else {
			var mat = this.getMaterialByID(nodeMaterialID);
			if(!mat)
			{
				return "no valid material provided ("+currNode["materialID"]+")";
			}
			currNode["materialID"] = nodeMaterialID;
		}
		

		// Stores TEXTURE from currNode
		var nodeTextures = iterNode.getElementsByTagName("TEXTURE");
		var nodeTexture = nodeTextures[0];
		var nodeTextureID = this.reader.getString(nodeTexture, "id", true);

		// Checks if texture exists
		if(nodeTextureID == "null") currNode["textureID"] = nodeTextureID;
		else if(nodeTextureID == "clear") currNode["textureID"] = nodeTextureID;
		else {
			var text = this.getTextureByID(nodeTextureID);
			if(!text)
			{
				return "no valid texture provided ("+currNode["textureID"]+")";
			}
			currNode["textureID"] = nodeTextureID;
		}
		
		// Stores ANIMATIONREF from currNode
		var nodeAnimationRefs = iterNode.getElementsByTagName("ANIMATIONREF");
		currNode["animations"]=[];
		if(nodeAnimationRefs.length>0)
		{
			if(nodeAnimationRefs.length>1)
			{
				var animations = [];
				for (var j = 0; j < nodeAnimationRefs.length; j++) {
					var nodeAnimationRef = nodeAnimationRefs[j];
					var nodeAnimationRefID = this.reader.getString(nodeAnimationRef, "id", true);

					if(nodeAnimationRefID != null)
					{
						if(!(nodeAnimationRefID in this.animations))
						{
							return "no valid animation found ("+nodeAnimationRefID+")";
						}
						else animations.push(this.animations[nodeAnimationRefID]);
					}
				};
				var cmpAnimation = new CompoundAnimation(this.scene,animations);
				currNode["animation"]= cmpAnimation;
				this.animations["cmp_"+currNode["id"]] = cmpAnimation;
			}
			else
			{
				var nodeAnimationRef = nodeAnimationRefs[0];
				var nodeAnimationRefID = this.reader.getString(nodeAnimationRef, "id", true);
				
				if(nodeAnimationRefID != null)
				{
					if(!(nodeAnimationRefID in this.animations))
					{
						return "no valid animation found";
					}
					else currNode["animation"]=this.animations[nodeAnimationRefID];
				}
			}

		}

		currNode["geo_transf"]=[];
		for (var j = 2; j < iterNode.children.length; j++) {
			var transfElm = iterNode.children[j];
			var transf = [];
			if(transfElm.nodeName=="TRANSLATION")
			{
				var transl_x = this.reader.getFloat(transfElm,'x',true);
				var transl_y = this.reader.getFloat(transfElm,'y',true);
				var transl_z = this.reader.getFloat(transfElm,'z',true);
				transf = ["translation",transl_x, transl_y, transl_z];
				currNode["geo_transf"][j-2]=transf;
			}
			else if(transfElm.nodeName=="ROTATION")
			{
				var rot_axis = this.reader.getString(transfElm,"axis",true);
				if(rot_axis!='x' &&
					rot_axis!='y' &&
					rot_axis!='z')
					return "invalid "+(i+1)+" 'axis' value found. (expected=[x,y,z]; found="+rot_axis+")";

				var rot_angle = this.reader.getFloat(transfElm,"angle",true);
				transf=["rotation",rot_axis, rot_angle];
				currNode["geo_transf"][j-2]=transf;
			}
			else if(transfElm.nodeName=="SCALE")
			{
				var scal_x = this.reader.getFloat(transfElm,'sx',true);
				var scal_y = this.reader.getFloat(transfElm,'sy',true);
				var scal_z = this.reader.getFloat(transfElm,'sz',true);
				transf = ["scale",scal_x, scal_y, scal_z];
				currNode["geo_transf"][j-2]=transf;
			}
			
		}

		// Stores Descendants IDs
		var descendants = iterNode.getElementsByTagName("DESCENDANTS");
		var first_descendants = descendants[0];

		var descendant_array = first_descendants.getElementsByTagName("DESCENDANT");
		this.descendants = [];
		for(var z=0; z<descendant_array.length; z++) {
			var descendantID = this.reader.getString(descendant_array[z], "id", true);
			this.descendants[z] = descendantID;
		}
		currNode["descendants"] = this.descendants;
		
		this.nodes[i] = currNode;

		delete this.descendants;
	}

	// TESTING VALUES READ FROM NODES
	console.log("ROOT: "+this.nodes["rootID"]);
	for(var i=0; i<this.nodes.length; i++) {
		console.log("NODE["+i+"]: "+this.nodes[i]["id"]);
		console.log("\tMATERIAL: "+this.nodes[i]["materialID"]);
		console.log("\tTEXTURE: "+this.nodes[i]["textureID"]);
		console.log("\tANIMATIONS: ");
		for(var j=0; j<this.nodes[i]["animations"].length; j++) {
			console.log("\t\t ID:"+this.nodes[i]["animations"][j].id);
			console.log("\t\t TYPE:"+this.nodes[i]["animations"][j].type);
		}
		console.log("\tTRANSF: "+this.nodes[i]["geo_transf"]);
		console.log("\tDESCENDANTS: "+this.nodes[i]["descendants"]);
	}
};

MySceneGraph.prototype.getNodeByID = function(nodeID) {
	for(var i=0; i<this.nodes.length; i++) {
		if(nodeID == this.nodes[i]["id"]) {
			return this.nodes[i];
		}
	}
	return null;
};

MySceneGraph.prototype.getMaterialByID = function(matID) {
	for(var i=0; i<this.materials.length; i++) {
		if(matID == this.materials[i]["id"]) {
			return this.materials[i];
		}
	}
	return null;
};

MySceneGraph.prototype.getTextureByID = function(textID) {
	for(var i=0; i<this.textures.length; i++) {
		if(textID == this.textures[i]["id"]) {
			return this.textures[i];
		}
	}
	return null;
};

MySceneGraph.prototype.getNodeObjByID = function(nodeID) {
	for(var i=0; i<this.node_ret.length; i++) {
		if(nodeID == this.node_ret[i].id) {
			return this.node_ret[i];
		}
	}
	return null;
};

MySceneGraph.prototype.createSceneNodeArray = function() {
	// Iterates over all the nodes and creates a new Node object
	this.node_ret = [];
	for(var i=0; i<this.nodes.length; i++) {
		var id = this.nodes[i]["id"];
		var materialID = this.nodes[i]["materialID"];
		var textureID = this.nodes[i]["textureID"];

		var newNode = new Node(id);

		var material_arr = this.getMaterialByID(materialID);
		if(material_arr!=null) {
			var newApp = new CGFappearance(this.scene);
        	newApp.setShininess(material_arr["shininess"]);
        	newApp.setAmbient(material_arr["ambient"]["r"], material_arr["ambient"]["g"], material_arr["ambient"]["b"], material_arr["ambient"]["a"]);
        	newApp.setDiffuse(material_arr["diffuse"]["r"], material_arr["diffuse"]["g"], material_arr["diffuse"]["b"], material_arr["diffuse"]["a"]);
        	newApp.setSpecular(material_arr["specular"]["r"], material_arr["specular"]["g"], material_arr["specular"]["b"], material_arr["specular"]["a"]);
			newNode.setMaterial(newApp);
		}


		var texture;
		if(textureID=="clear") texture = "clear";
		else if(textureID=="null") texture = "null";
		else {
			var texture_arr = this.getTextureByID(textureID);
			if(texture_arr!=null) {
				var texture = new CGFtexture(this.scene,texture_arr["file"]);
				texture.fact_s=texture_arr["amplif_factor"]["s"];
				texture.fact_t=texture_arr["amplif_factor"]["t"];
				newNode.setTexture(texture);
			}
		}
		newNode.setTexture(texture);

		for (var j = 0; j < this.nodes[i]["geo_transf"].length; j++) {
			var type = this.nodes[i]["geo_transf"][j][0];
			if(type=="translation") {
				mat4.translate(newNode.matrix, newNode.matrix, [this.nodes[i]["geo_transf"][j][1], this.nodes[i]["geo_transf"][j][2], this.nodes[i]["geo_transf"][j][3]]);
			}
			else if(type=="rotation") {
				var axis = this.nodes[i]["geo_transf"][j][1];
				var angle = this.nodes[i]["geo_transf"][j][2];
				switch(axis) {
					case "x":
						mat4.rotateX(newNode.matrix, newNode.matrix, angle*degToRad);
						break;
					case "y":
						mat4.rotateY(newNode.matrix, newNode.matrix, angle*degToRad);
						break;
					case "z":
						mat4.rotateZ(newNode.matrix, newNode.matrix, angle*degToRad);
						break;
				}
			}
			else if(type=="scale") {
				mat4.scale(newNode.matrix, newNode.matrix, [this.nodes[i]["geo_transf"][j][1], this.nodes[i]["geo_transf"][j][2], this.nodes[i]["geo_transf"][j][3]]);
			}
		};

		// Sets Animation node referencer
		var animation = this.nodes[i]["animation"];

		if(animation != null) {
			animation.setNode(newNode);
			
			newNode.beg_matrix=mat4.create();
			mat4.copy(newNode.beg_matrix,newNode.matrix);
		}

		
		this.node_ret.push(newNode);
	}
	for(var i=0; i<this.leaves.length; i++) {
		var id = this.leaves[i]["id"];
		var type = this.leaves[i]["type"];

		var newNode = new Node(id);
		newNode.leaf = true;

		if(type == "terrain") {
			var texture_arr = this.getTextureByID(this.leaves[i]["texture"]);

			var texture = new CGFtexture(this.scene,texture_arr["file"]);
			texture.fact_s=texture_arr["amplif_factor"]["s"];
			texture.fact_t=texture_arr["amplif_factor"]["t"];
			newNode.setTexture(texture);

		}
		var args = this.leaves[i]["args"];
		newNode.setArgs(args);
		newNode.setType(type);

		this.node_ret.push(newNode);
	}
};

MySceneGraph.prototype.linkSceneNodes = function() {
	for(var i=0; i<this.nodes.length; i++) {
		var descendants = this.nodes[i]["descendants"];
		var parObj = this.getNodeObjByID(this.nodes[i]["id"]);
		for(var j=0; j<descendants.length; j++) {
			var descID = descendants[j];

			var descObj = this.getNodeObjByID(descID);

			parObj.push(descObj);
		}
	}
};

MySceneGraph.prototype.buildGraph = function() {
	this.createSceneNodeArray();
	this.linkSceneNodes();
};

/*
 * Callback to be executed on any read error
 */ 
MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


