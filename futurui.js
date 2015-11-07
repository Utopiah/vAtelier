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

var startpos = new THREE.Vector3(-5, 10, 20);
var endpos = new THREE.Vector3(-20, 10, 20);
// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
camera.position.set(-5,10,20);
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

compositering1 = new THREE.Group();
var thetaSegments = 16;
var phiSegments = 2;
var geometry = new THREE.RingGeometry(10, 20, thetaSegments, phiSegments, 0, Math.PI * 2);
var ring1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.7}));
ring1.position.set(2, 2, -8);
var geometry = new THREE.BoxGeometry(10, 10, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity:0.7});
var ring1tip = new THREE.Mesh(geometry, material);
ring1tip.position.set(2, 26, -8);
compositering1.add (ring1);
compositering1.add (ring1tip);
scene.add(compositering1);

compositering2 = new THREE.Group();
var geometry = new THREE.RingGeometry(10, 20, thetaSegments, phiSegments, 0, Math.PI * 2);
var ring2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.7}));
ring2.position.set(-2, -2, -5);
var geometry = new THREE.BoxGeometry(10, 10, 1);
var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity:0.7});
var ring2tip = new THREE.Mesh(geometry, material);
ring2tip.position.set(-2, 22, -5);
compositering2.add (ring2);
compositering2.add (ring2tip);
scene.add(compositering2);


var edits = [
 281, 728, 580, 1553, 3014, 2176, 4252, 3573, 3226, 3726,
1938, 808, 529, 171, 138, 320, 331, 144, 212, 75,
 125, 399, 135, 303
];

var cameraPositionsV3 = new Array();
var speeds = new Array();

var i=0;
edits.forEach( function(item, index, array){
	if (index<array.length-1){
	// change tweening speed based on difference Height(t) - Height(t+1)
		difference = item - array[index+1];
		if (difference>0){ // we are going down, go faster
			//console.log('faster by ', difference);
		} else { // we are going up, go slower
			//console.log('slower by ', difference);
		}
		speeds.push(difference);
	}
	i++;
	var pos = new THREE.Vector3(0, (0.1*item/10)/2+1, -i);
	cameraPositionsV3.push(pos);
});


// Request animation frame loop function
function animate() {
    // Apply rotation to cube mesh

    // Update VR headset position and apply to camera.
    controls.update();

    // Render the scene through the manager.
    manager.render(scene, camera);
    compositering1.rotateZ(0.1);
    compositering2.rotateZ(0.3);
    TWEEN.update();
    requestAnimationFrame(animate);
}

var tweens = Array();
var speed = 1000;
var newtween = new TWEEN.Tween(camera.position).to(startpos, speed);
tweens.push(newtween);
cameraPositionsV3.forEach( function(item, index, array){
	if (index>0){
		//console.log('modify speed by ', speeds[index-1]);
		speed -= speeds[index-1]/10;
		// be cautious, negative speed brings you... nowhere
		// also the name isn't appropriate since it is the duration of the tween, hence the bigger the slower
	}

	//console.log("height :",array[index].y);

	var newtween = new TWEEN.Tween(camera.position).to(item, speed);
	tweens.push(newtween);
	if ( tweens.length>1 ) {
		//console.log('chaining ', tweens.length-1, ' with ', tweens.length);
		tweens[tweens.length-2].chain(tweens[tweens.length-1]);
	}
});
var newtween = new TWEEN.Tween(camera.position).to(endpos, 10000);
// very slowly out
tweens.push(newtween);
tweens[tweens.length-2].chain(tweens[tweens.length-1]);
tweens[tweens.length-1].chain(tweens[0]);

//console.log(tweens);

// Kick off animation loop
animate();

function onKey(event) {
    if (event.keyCode == 90) { // z to reset the sensors
        controls.resetSensor();
	if (mydebug) console.log("sensor resetted");
    }
    if (event.keyCode == 13) { // enter to start
        //tweens[0].start();
    }
};

function onDblClick(event) {
	if (mydebug) console.log("stop animation");
        tweens[0].stop();
};
function onClick(event) {
	if (camera.position.equals(startpos)){
	// prevents from restarting the animation if moving the camera on a computer
		if (mydebug) console.log("start animation");
	        //tweens[0].start();
	}
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
