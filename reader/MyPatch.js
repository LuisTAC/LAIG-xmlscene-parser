function MyPatch(scene, order, knotsU, knotsV, controlpoints, partsU, partsV) {
	this.scene = scene;
	this.order = order;
	this.controlpoints = controlpoints;

    var partsU = partsU || 20;
    var partsV = partsU || 20;

	this.knots_a = [];

    for(var i = 0; i <= order; i++){
    	this.knots_a.push(0);
    }

    for(var i = 0; i <= order; i++){
    	this.knots_a.push(1);
    }

    this.knots_b = [];

    for(var i = 0; i <= order; i++){
    	this.knots_b.push(0);
    }

    for(var i = 0; i <= order; i++){
    	this.knots_b.push(1);
    }

    var surf = new CGFnurbsSurface(order, order, this.knots_a, this.knots_b, controlpoints);

    getSurfacePoint = function(u, v) {
		return surf.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(scene, getSurfacePoint, partsU, partsV);
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function () {
	
   	this.obj.display();
};

MyPatch.prototype.updateTex = function () {};