var scene, camera, renderer;
var geometry, material, mesh, mesh2;
var mouse = false;
var loaded = false;
var prevSelected = false;
var prevColor = false;
var currentSelected = false;
var currentColor = false;
var selectColor = new THREE.Color(1,1,1);
function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x00000000);
	camera = new THREE.PerspectiveCamera(75,
										 window.innerWidth / window.innerHeight, 
										 1,
										 10000 );
	camera.position.z = 1000;
	 //Lighting
	var ambient = new THREE.AmbientLight(0x101030);
	scene.add(ambient);
	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0,0,1);
	scene.add(directionalLight);
	
	//Callback functions
	var onProgress = function (xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
		}
	};
	var onError = function (err) {
		console.error(err)
	};
	
	//Load computer model
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load("3D/Computer.mtl", function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load("3D/Computer.obj", function ( object ) {
			object.traverse(function(child){
				if(child instanceof THREE.Mesh) {
					//child.material.map = texture;
					child.material.side = THREE.DoubleSide;
					child.material.wireframe = true;
					child.material.reflectivity = 0;
				}
			});
			object.position.y = 0;
			object.position.z = 100;
			object.scale.x = 400;
			object.scale.y = 400;
			object.scale.z = 400;
			object.rotation.y = Math.PI/2;
			mesh2 = object; //Assign to global variable
			scene.add(object) ;
			loaded = true;
		},onProgress,onError) ;
	});
	
//			geometry = new THREE.BoxGeometry( 200, 200, 200 );
//			material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

//			mesh = new THREE.Mesh( geometry, material );
//			scene.add( mesh );
	
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setSize( window.innerWidth, window.innerHeight);

	document.getElementById("main").appendChild(renderer.domElement);
	
	if(threeD){
		window.addEventListener( 'mousemove', onMouseMove, false );
		window.addEventListener( 'touchmove', onMouseMove, false );
		window.addEventListener( 'mousedown', select, false );
		window.addEventListener( 'touchend', select, false );
	}
}

function animate() {

	requestAnimationFrame(animate);

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;
	//mesh2.rotation.x += 0.01;
	if(loaded){
	//	mesh2.rotation.y += 0.005;	
	}
	renderer.render( scene, camera );

}
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event) {
	var rect = renderer.domElement.getBoundingClientRect();
	mouse.x = ((event.clientX - rect.left)/(rect.width - rect.left))*2-1;
	mouse.y = -((event.clientY - rect.top)/(rect.bottom - rect.top))*2+1;
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse,camera);

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children, true);
	if(intersects.length > 0){ //If an object is picked;
		if(intersects[0].object !== prevSelected){
			if(prevSelected != false && prevSelected !== currentSelected){
				prevSelected.material.wireframe = true;	
				if(checkCase(prevSelected)){
					findObj("front").material.wireframe = true;
					findObj("case").material.wireframe = true;
				}
			}
			prevSelected = intersects[0].object;
		}
		intersects[0].object.material.wireframe = false;
		if(checkCase(intersects[0].object)){
			findObj("front").material.wireframe = false;
			findObj("case").material.wireframe = false;
		}
	}
	else{
		if(prevSelected !== currentSelected && prevSelected != false){
			prevSelected.material.wireframe = true;
			if(checkCase(prevSelected)){
				findObj("front").material.wireframe = true;
				findObj("case").material.wireframe = true;
			}
			prevSelected = false;
		}
	}

	renderer.render(scene, camera);

}
function select(event){
	if(currentSelected != false){
		currentSelected.material.wireframe = true;
		if(checkCase(currentSelected)){
			findObj("front").material.wireframe = true;
			findObj("case").wireframe = true;
		}
	}
	currentSelected = prevSelected;
	if(currentSelected != false){
		currentSelected.material.wireframe = false;
		if(checkCase(currentSelected)){
			findObj("front").material.wireframe = true;
			findObj("case").material.wireframe = true;
		}
		openContent(currentSelected.name);
	}
}
function center(mesh){
		var middle = new THREE.Vector3();
		var geometry = mesh.geometry;

		geometry.computeBoundingBox();

		middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
		middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
		middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

		mesh.localToWorld(middle);
}
function checkCase(obj){
	objName = obj.name;
	if(objName.search("case") != -1|| objName.search("front") != -1){
		return true;
	}
	else{
		return false;
	}
}
function findObj(findName){
	var newChild = false;
	scene.traverse(function(child){
		if(child.name.search(findName) != -1){
			newChild = child;
		}
	});
	return newChild;
}