
function Node(id) {
	this.id=id;
	this.material=null;
	this.matrix=null;
	this.texture=null;
	this.descendants=[];
};

Node.prototype.push = function(nodeID) {
	this.descendants.push(nodeID);
};

Node.prototype.setMaterial = function(materialID) {
	this.material=materialID;
};

Node.prototype.setTexture = function(textureID) {
	this.texture=textureID;
}

Node.prototype.setMatrix = function(matrix) {
	this.matrix=math.clone(m);
};
