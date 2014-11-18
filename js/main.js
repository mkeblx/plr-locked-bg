'use strict';

var clock = new THREE.Clock();

var camera, scene, renderer;

var fullScreenButton;

var controls;

var vrEffect;
var vrControls;

var objects = [];

var grid, scene2, camera2;

var has = {
	WebVR: !!navigator.getVRDevices
};


window.addEventListener('load', load);

function load() {
	init();
	animate();
}


function init() {


	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
	camera2 = camera.clone();

	fullScreenButton = document.querySelector('#vr-button');

	setupScene();
	setupLights();

	setupBackground();

	setupRendering();
	setupControls();
	setupEvents();
}


function setupScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 0, 1500);

	// floor
	var geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	var texture = THREE.ImageUtils.loadTexture('textures/checker.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.repeat = new THREE.Vector2(20, 20);

	var material = new THREE.MeshBasicMaterial( { color: 0xcccccc, map: texture } );

	var mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;

	scene.add(mesh);


	// cubes
	geometry = new THREE.BoxGeometry(30, 30, 30);

	for (var i = 0; i < 500; i ++) {

		var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

		object.material.ambient = object.material.color;

		object.position.x = Math.random() * 2000 - 1000;
		object.position.y = Math.random() * 1000 - 500;
		object.position.z = Math.random() * 2000 - 1000;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		object.scale.x = Math.random() * 2 + 1;
		object.scale.y = Math.random() * 2 + 1;
		object.scale.z = Math.random() * 2 + 1;

		object.castShadow = true;
		object.receiveShadow = true;

		scene.add(object);

		objects.push(object);
	}
}

function setupBackground() {
	scene2 = new THREE.Scene();

	var s = 1000;
	var n = 10;

	var geo = new THREE.BoxGeometry(s,s,s, n,n,n);
	var mat = new THREE.MeshBasicMaterial({
		color: 0xffff00, wireframe: true,
		transparent: true, opacity: 0.3 });
	grid = new THREE.Mesh(geo, mat);
	//grid.position.fromArray([0,0,-100]);

	scene2.add(grid);
}

function setupLights() {
	var light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff, 0.75);
	light.position.set(-1, -0.5, -1);
	scene.add(light);

	light = new THREE.AmbientLight(0x666666);
	scene.add(light);
}

function setupRendering() {
	renderer = new THREE.WebGLRenderer({
		antialias: false
	});
	renderer.autoClear = false;
	renderer.setClearColor(0x000000, 1);

	function VREffectLoaded(error) {
		if (error) {
			fullScreenButton.innerHTML = error;
			fullScreenButton.classList.add('error');
		}
	}

	renderer.setSize(window.innerWidth, window.innerHeight);
	vrEffect = new THREE.VREffect(renderer, VREffectLoaded);

	document.body.appendChild(renderer.domElement);
}

function setupControls() {
	vrControls = new THREE.VRControls();

	controls = new THREE.FPControls( camera );
	controls.isOnObject(true);

	controls.enabled = true;

	var obj = controls.getObject();

	scene.add( obj );
	//obj.add(cursor);
}

function setupEvents() {
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('keydown', keyPressed, false);

	fullScreenButton.addEventListener('click', function(){
		vrEffect.setFullScreen(true);
	}, true);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	//renderer.setSize(window.innerWidth, window.innerHeight);
}

function keyPressed (e) {

	console.log(e.keyCode);
	switch (e.keyCode) {
		case 82: // R
			vrControls.zeroSensor();
			break;
		case 70: // F
			vrEffect.setFullScreen(true);
			break;
		case 219: // [
			vrEffect.setRenderScale(vrEffect.getRenderScale()*1/1.1);
			break;
		case 221: // ]
			vrEffect.setRenderScale(vrEffect.getRenderScale()*1.1);
			break;
	}

}

function animate(t) {
	requestAnimationFrame(animate);

	var dt = clock.getDelta();

	var vrState = vrControls.getState();

	var s = 5;

	if (vrState) {
		var vrPos = vrState.position;
		var pos = new THREE.Vector3().copy(vrPos).multiplyScalar(s);

		camera.position.copy(pos);
	}

	controls.update(dt);

	vrControls.update(camera);

	render(dt);
}

function render(dt) {
	renderer.clear();
	vrEffect.render(scene, camera);
	renderer.clearDepth();
	vrEffect.render(scene2, camera2);
}


