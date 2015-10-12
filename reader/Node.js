
function Node(id) {
	this.id=id;
	this.material=null;
	this.matrix=null;
	this.texture=null;
	this.descendants=[];
	this.leaf=false;
};

Node.prototype.push = function(node) {
	this.descendants.push(node);
};

Node.prototype.setMaterial = function(material) {
	this.material=material;
};

Node.prototype.setTexture = function(texture) {
	this.texture=texture;
}

Node.prototype.setMatrix = function(matrix) {
	this.matrix=math.clone(m);
};
