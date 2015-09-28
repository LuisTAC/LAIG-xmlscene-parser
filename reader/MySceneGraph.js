
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
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseIlumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseInitials= function(rootElement) {
	
	console.log("INITIALS:");

	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) return "INITIALS element is missing.";
	if (elems.length != 1) return "invalid number of 'INITIALS' elements found. (expected=1; found="+elems.length+")";
	var initials = elems[0];

	//FRUSTUM
	var elems = initials.getElementsByTagName('frustum');
	if (elems == null)  return "frustum element is missing.";
	if (elems.length != 1) return "invalid number of 'frustum' elements found. (expected=1; found="+elems.length+")";

	var frustum = elems[0];

	this.frustum=[];
	this.frustum['near']=this.reader.getFloat(frustum,'near',true);
	this.frustum['far']=this.reader.getFloat(frustum,'far',true);
	console.log("\tFRUSTUM - near:"+this.frustum['near']);
	console.log("\tFRUSTUM - far:"+this.frustum['far']);

	//TRANSLATE
	var elems = initials.getElementsByTagName('translate');
	if (elems == null)  return "translate element is missing.";
	if (elems.length != 1) return "invalid number of 'translate' elements found. (expected=1; found="+elems.length+")";

	var translate = elems[0];

	this.translate=[];
	this.translate['x']=this.reader.getFloat(translate,'x',true);
	this.translate['y']=this.reader.getFloat(translate,'y',true);
	this.translate['z']=this.reader.getFloat(translate,'z',true);
	console.log("\tTRANSLATE - x:"+this.translate['x']);
	console.log("\tTRANSLATE - y:"+this.translate['y']);
	console.log("\tTRANSLATE - z:"+this.translate['z']);

	//ROTATIONS
	var elems = initials.getElementsByTagName('rotation');
	if (elems == null)  return "rotation element is missing.";
	if (elems.length != 3) return "invalid number of 'rotation' elements found. (expected=3; found="+elems.length+")";

	this.rotation=[[],[],[]];
	for (var i=0; i<3; i++)
	{

		var rotation = elems[i];

		this.rotation[i]['axis']=this.reader.getString(rotation,'axis',true);
		//check axis is one of 'x','y','z'
		this.rotation[i]['angle']=this.reader.getFloat(rotation,'angle',true);
		console.log("\tROTATION["+i+"] - axis:"+this.rotation[i]['axis']);
		console.log("\tROTATION["+i+"] - angle:"+this.rotation[i]['angle']);
	}
	
	//SCALE
	var elems = initials.getElementsByTagName('scale');
	if (elems == null)  return "scale element is missing.";
	if (elems.length != 1) return "invalid number of 'scale' elements found. (expected=1; found="+elems.length+")";

	var scale = elems[0];

	this.scale=[];
	this.scale['sx']=this.reader.getFloat(scale,'sx',true);
	this.scale['sy']=this.reader.getFloat(scale,'sy',true);
	this.scale['sz']=this.reader.getFloat(scale,'sz',true);
	console.log("\tSCALE - sx:"+this.scale['sx']);
	console.log("\tSCALE - sy:"+this.scale['sy']);
	console.log("\tSCALE - sz:"+this.scale['sz']);

	//REFERENCE

	var elems = initials.getElementsByTagName('reference');
	if (elems == null)  return "reference element is missing.";
	if (elems.length != 1) return "invalid number of 'reference' elements found. (expected=1; found="+elems.length+")";

	var reference = elems[0];

	this.reference=this.reader.getFloat(reference,'length',true);

	console.log("\tREFERENCE:"+this.reference);
};
	
MySceneGraph.prototype.parseIlumination = function(rootElement) {
	var iluminations = rootElement.getElementsByTagName("ILUMINATION");
	if(iluminations == null) return "ilumination values missing";

	if(iluminations.length != 1) return "0 or more iluminations were found!";


	//gets each ilumination element*/
	var iluminationElems = iluminations[0];

	//ambient
	var ambients = iluminationElems.getElementsByTagName("ambient");
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
	var doublesides = iluminationElems.getElementsByTagName("doubleside");
	if(doublesides == null) return "doubleside values missing";
	if(doublesides.length != 1) return "0 or more doubleside	 elements were found!";

	var doubleside = doublesides[0];
	this.doubleside = [];
	this.doubleside["value"] = this.reader.getBoolean(doubleside, "value", true);

	console.log("DOUBLESIDE: TEST VALUE(0) "+this.doubleside["value"]);

	//background
	var backgrounds = iluminationElems.getElementsByTagName("background");
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
}

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
	
/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
/*
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);
	
	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");
	var tempList=rootElement.getElementsByTagName('list');
	
	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
		
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];
	
		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};
*/

/*
 * Callback to be executed on any read error
 */ 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


