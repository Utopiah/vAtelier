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

var edits = [
 281, 728, 580, 1553, 3014, 2176, 4252, 3573, 3226, 3726,
1938, 808, 529, 171, 138, 320, 331, 144, 212, 75,
 125, 399, 135, 303
];


var cameraPositionsV3 = new Array();
// TODO smoother movement

var speeds = new Array();

var i=0;
edits.forEach( function(item, index, array){
	var mygeometry = new THREE.CubeGeometry(2, 0.1*item/10, 1);
	var mymaterial = new THREE.MeshBasicMaterial({});
	var editsize = new THREE.Mesh(mygeometry, mymaterial);
	editsize.material.color.setRGB( Math.random(), Math.random(), Math.random() );
	editsize.position.set(Math.random(), 0, -i);
	/* TODO
		# resize blocks to better take into account the "size" of the viewer
		# resize skybox to better take into account the "size" of the whole experience
		# transform blocks to connected planes
		# transform planes to a curbe
		# add miningful landmarks
	*/
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
	scene.add(editsize);
	i++;
	var pos = new THREE.Vector3(0, (0.1*item/10)/2+1, -i);
	cameraPositionsV3.push(pos);
});

var mygeometry = new THREE.CubeGeometry(3, 3, 50);
var mymaterial = new THREE.MeshBasicMaterial({});
myfloor = new THREE.Mesh(mygeometry, mymaterial);
myfloor.position.set(0.5, -3, 0);
scene.add(myfloor);

var mygeometry = new THREE.CubeGeometry(1, 1, 0.1);
mytexture = THREE.ImageUtils.loadTexture('textures/motivation_poster.jpg');
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
myposter = new THREE.Mesh(mygeometry, mymaterial);
myposter.position.set(-19, 10, 19);
scene.add(myposter);

var loader=new THREE.STLLoader();
loader.addEventListener('load', function (event){
	var geometry=event.content;
	var material=new THREE.MeshBasicMaterial({ color: 0xfdd017, wireframe: true });
	var mesh=new THREE.Mesh(geometry, material);
	scene.add(mesh);});
// STL file to be loaded
loader.load('ouroborus_with_stepping_stones.stl');
    
// Also add a repeating grid as a skybox.
var boxWidth = 50;
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
        tweens[0].start();
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
	        tweens[0].start();
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
