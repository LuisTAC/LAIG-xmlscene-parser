
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

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
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

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


