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

var cameraPositionsV3 = new Array();
// TODO smoother movement

var i=0;
edits.forEach( function(item, index, array){
	var mygeometry = new THREE.CubeGeometry(0.1, 0.1*item/100, 0.1);
	var mymaterial = new THREE.MeshBasicMaterial({});
	var editsize = new THREE.Mesh(mygeometry, mymaterial);
	editsize.material.color.setRGB( Math.random(), Math.random(), Math.random() );
	editsize.position.set(Math.random()/10, 0, -i/10);
	scene.add(editsize);
	i++;
	var pos = new THREE.Vector3(0, (0.1*item/100)/2+1, -i/10);
	cameraPositionsV3.push(pos);
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

// Request animation frame loop function
function animate() {
    // Apply rotation to cube mesh

    // Update VR headset position and apply to camera.
    controls.update();

    // Render the scene through the manager.
    manager.render(scene, camera);

    TWEEN.update();
    requestAnimationFrame(animate);
}

var tweens = Array();
cameraPositionsV3.forEach( function(item, index, array){
	var speed = 1000;

	console.log("height :",array[index].y);

	var newtween = new TWEEN.Tween(camera.position).to(item, speed);
	tweens.push(newtween);
	if ( tweens.length>1 ) {
		//console.log('chaining ', tweens.length-1, ' with ', tweens.length);
		tweens[tweens.length-2].chain(tweens[tweens.length-1]);
	}
});
tweens[tweens.length-1].chain(tweens[0]);

console.log(tweens);

// Kick off animation loop
animate();

function onKey(event) {
    if (event.keyCode == 90) { // z to reset the sensors
        controls.resetSensor();
	if (mydebug) console.log("sensor resetted");
    }
    if (event.keyCode == 13) { // enter to start
        tweens[0].start();
    }
};

function onDblClick(event) {
	if (mydebug) console.log("stop animation");
        tweens[0].start();
};
function onClick(event) {
	if (mydebug) console.log("start animation");
        tweens[0].start();
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
