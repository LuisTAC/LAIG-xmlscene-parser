function MyPlane(scene, parts){

	var controlpoints = [	// U = 0
						[ // V = 0..1;
							 [-1.0, 0.0, -1.0, 1],
							 [1.0,  0.0, -1.0, 1]
							
						],
						// U = 1
						[ // V = 0..1
							 [-1.0, 0.0, 1.0, 1],
							 [1.0, 0.0, 1.0, 1]							 
						]
	];

    MyPatch.call(this, scene, 1, parts, parts, controlpoints);
};


MyPlane.prototype = Object.create(MyPatch.prototype);
MyPlane.prototype.constructor = MyPlane;