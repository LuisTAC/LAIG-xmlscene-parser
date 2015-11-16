function MyTerrain(scene, num_divs, tex, h_map) {
	MyPlane.call(this, scene, num_divs);

	this.tex = tex;
	this.h_map = h_map;
};

MyTerrain.prototype = Object.create(MyPlane.prototype);
MyTerrain.prototype.constructor = MyTerrain;