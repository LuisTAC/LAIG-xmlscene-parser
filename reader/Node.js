
function Node(id) {
	this.id=id;
	this.args = [];
	this.material=null;
	this.matrix=null;
	this.texture=null;
	this.descendants=[];
	this.leaf=false;
	this.visited=false;
	this.type=null;
};

Node.prototype.push = function(node) {
	this.descendants.push(node);
};

Node.prototype.setArgs = function(args) {
	this.args=args;
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

Node.prototype.setVisited = function(visited) {
	this.visited=visited;
};

Node.prototype.setType = function(type) {
	this.type=type;
};