var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = 'gits.mp3';
audio.appendChild(source);
audio.volume = 0.01;
audio.play();


var mydebug = true;

var params = {
    positionZpages: -2
}

var FizzyText = function() {
    this.message = 'Wiki edits as a roller coaster';
    this.instructions = 'Enter key or click to start';
};

var text = new FizzyText();
var gui = new dat.GUI();
gui.add(text, 'message');
gui.add(text, 'instructions');

//Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
//create gaze interaction manager
scene.add(camera);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {
    hideButton: false
});

var myRings = new Array();
var myTeens = new Array();
var myColors = new Array();
var radius = 15;
var thetaSegments = 16;
var phiSegments = 2;

// randomly pick from a selection
myColors.push(new THREE.Color( 0xffd700 )); // Gold
myColors.push(new THREE.Color( 0x0000ff )); // Blue
var myColor = myColors[Math.floor(Math.random() * myColors.length)];

// vertically moving circle
var circleStartPos = new THREE.Vector3(0,1,0);
var circleEndPos = new THREE.Vector3(0,-1,0);
var geometry = new THREE.RingGeometry(1, 1.1, thetaSegments, phiSegments, 0, Math.PI * 2);
var circle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: myColor, transparent: true, opacity: 0.3}));
circle.material.side = THREE.DoubleSide;
circle.rotateX(Math.PI/2);
circle.position.set(0,1,0);
var circletweenA = new TWEEN.Tween(circle.position).to(circleEndPos, 10000);
var circletweenB = new TWEEN.Tween(circle.position).to(circleStartPos, 10000);
circletweenA.chain(circletweenB);
circletweenB.chain(circletweenA);
circletweenA.start();
scene.add(circle);

// boundary sphere
var geometry = new THREE.SphereGeometry(24, 12, 8);
var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: myColor, transparent: true, opacity: 0.5, wireframe: true}));
scene.add(sphere);

for (var i=0;i<21;i++){
	// composite object forming a group
	compositering = new THREE.Group();
	var geometry = new THREE.RingGeometry(1.4, 2, thetaSegments, phiSegments, 0, Math.PI * 2);
	var ring = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: myColor, transparent: true, opacity: 0.7}));
	var geometry = new THREE.BoxGeometry(1, 1, 0.1);
	var material = new THREE.MeshBasicMaterial({ color: myColor, transparent: true, opacity:0.7});
	var ringtip = new THREE.Mesh(geometry, material);
	var geometry = new THREE.RingGeometry(2.3, 2.4, thetaSegments, phiSegments, 0, Math.PI * 2);
	var outerring = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: myColor, transparent: true, opacity: 0.3}));
	var geometry = new THREE.RingGeometry(2.5, 2.7, thetaSegments, phiSegments, 0, Math.PI * 2);
	var secondouterring = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: myColor, transparent: true, opacity: 0.5}));
	ringtip.position.set(0, 2.4, -0.8);
	compositering.add(secondouterring);
	compositering.add(outerring);
	compositering.add(ring);
	compositering.add(ringtip);
	myRings.push({ring: compositering, speed: Math.random() * (0.3 - 0.1) + 0.1});
	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;
	compositering.position.set( x, y, z );
	compositering.position.normalize();
	compositering.position.multiplyScalar( radius );
	compositering.lookAt(camera.position);
	// TODO prevent overlap with previously add objects
	scene.add(compositering);
}

// framebox for contextual information
var geometry = new THREE.Geometry();
var z = -3;
var x = -3;
var y = 0;
var width = 1;
var height = 2;
var cornersize = 2*width/10;
var A = new THREE.Vector3(x+cornersize,y,z);
var B = new THREE.Vector3(x+width,y,z);
var C = new THREE.Vector3(x+width,y+height-cornersize,z);
var D = new THREE.Vector3(x+width-cornersize,y+height,z);
var E = new THREE.Vector3(x,y+height,z);
var F = new THREE.Vector3(x,y+cornersize,z);
geometry.vertices.push(A, B);
geometry.vertices.push(B, C);
geometry.vertices.push(C, D);
geometry.vertices.push(D, E);
geometry.vertices.push(E, F);
geometry.vertices.push(F, A);
var material = new THREE.LineBasicMaterial({ color: myColor, linewidth: 1, wireframe: true});   
var frame = new THREE.Line(geometry, material);
var geometry = new THREE.BoxGeometry(width+2*width/10, height+height/10, 0.1);
var material = new THREE.MeshBasicMaterial({ color: myColor, transparent: true, opacity:0.5});
var framebox = new THREE.Mesh(geometry, material);
framebox.position.set(x+width/2,y+height/2,z); 
compositeframe = new THREE.Group();
compositeframe.add(frame);
compositeframe.add(framebox);
scene.add(compositeframe);
compositeframe.lookAt(camera.position);

/*
	TODO
		display number on each composite object using text
			japanese style font
		gaze
			short : object stop spnining bring lookAt object closer to the view
			long : bring lookAt object closer to the view or change color
				display HUD, top right corner display a transparent cube with frame as lines then text on it regarding
					current position, timestamp of creation, number, etc
			out : bring it back to its initial position or or color
		apply a shader as a general effect
		music loop background
*/

// Request animation frame loop function
function animate() {

	// Update VR headset position and apply to camera.
	controls.update();

	// Render the scene through the manager.
	manager.render(scene, camera);
	myRings.forEach( function(item, index, array){
		item.ring.rotateZ(item.speed);
	});
	TWEEN.update();
	requestAnimationFrame(animate);
}

// Kick off animation loop
animate();

function onKey(event) {
	if (event.keyCode == 90) { // z to reset the sensors
	controls.resetSensor();
	if (mydebug) console.log("sensor resetted");
	}
	if (event.keyCode == 13) { // enter to start
	}
};

function onDblClick(event) {
};
function onClick(event) {
};

window.addEventListener('touchstart', onClick, true);
window.addEventListener('dblclick', onDblClick, true);
window.addEventListener('onclick', onClick, true);
window.addEventListener('click', onClick, true);
// does not work on mobile

window.addEventListener('keydown', onKey, true);
// Handle window resizes
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
}
