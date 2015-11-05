var mydebug = true;

var params = {
    positionZpages: -2
}

var FizzyText = function() {
    this.message = 'Wiki edits as a roller coaster';
    this.instructions = 'Enter key to start';
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

var edits = [
 281, 728, 580, 1553, 3014, 2176, 4252, 3573, 3226, 3726,
1938, 808, 529, 171, 138, 320, 331, 144, 212, 75,
 125, 399, 135, 303
];

var cameraPositions = new Array();
// TODO smoother movement

var lastedit = new THREE.Vector3;
var i=0;
edits.forEach( function(item, index, array){
	var mygeometry = new THREE.CubeGeometry(0.1, 0.1*item/100, 0.1);
	var mymaterial = new THREE.MeshBasicMaterial({});
	var editsize = new THREE.Mesh(mygeometry, mymaterial);
	editsize.material.color.setRGB( Math.random(), Math.random(), Math.random() );
	editsize.position.set(0, 0, -i/10);
	scene.add(editsize);
	i++;
	cameraPositions.push([0, (0.1*item/100)/2+1, -i/10]);
	lastedit = editsize.position;
});

var mygeometry = new THREE.CubeGeometry(1, 1, 0.1);
mytexture = THREE.ImageUtils.loadTexture('textures/motivation_poster.jpg');
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
myposter = new THREE.Mesh(mygeometry, mymaterial);
myposter.position.set(0, 0, 2);
scene.add(myposter);

// Also add a repeating grid as a skybox.
var boxWidth = 10;
var texture = THREE.ImageUtils.loadTexture( 'textures/box.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(boxWidth, boxWidth);

var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x333333,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.7
});

var skybox = new THREE.Mesh(geometry, material);
scene.add(skybox);

var cameraCurrentPosition = 0;
camera.position.x=cameraPositions[cameraCurrentPosition][0];
camera.position.y=cameraPositions[cameraCurrentPosition][1];
camera.position.z=cameraPositions[cameraCurrentPosition][2];

console.log(lastedit);
camera.lookAt(lastedit);
// Request animation frame loop function
function animate() {
    // Apply rotation to cube mesh

    // Update VR headset position and apply to camera.
    controls.update();

    // Render the scene through the manager.
    manager.render(scene, camera);

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
	if (mydebug) console.log("moving camera to ", cameraPositions[cameraCurrentPosition]);
	//camera.position.set(cameraPositions[cameraCurrentPosition]);
	// no idea why I can't directly set all values...
	// even with Vector3 it failed...
	camera.position.x=cameraPositions[cameraCurrentPosition][0];
	camera.position.y=cameraPositions[cameraCurrentPosition][1];
	camera.position.z=cameraPositions[cameraCurrentPosition][2];
	cameraCurrentPosition++;
	if (cameraCurrentPosition >= cameraPositions.length) {
		cameraCurrentPosition = 0;	
	}		
    }
};

function onClick(event) {
	if (mydebug) console.log("start animation");
};

window.addEventListener('dblclick', onClick, true);
// does not work on mobile

window.addEventListener('keydown', onKey, true);
// Handle window resizes
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
}
