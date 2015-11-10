<!DOCTYPE html>
<html lang="en">
<head>
<title>PIM in VR</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<style>
body {
  background-color: #000;
  color: #fff;
  margin: 0px;
  padding: 0;
  overflow: hidden;
}
</style>
</head>

<body>

</body>

<script>
// Set this to true to enable the polyfill and split screen rendering
// even if the device is incompatible with Cardboard (eg. desktop).
// NOTE: This should never be checked in as true.
CARDBOARD_DEBUG = false;
</script>

<script src="./js/three.js"></script>
<!--
VRControls.js acquires positional information from connected VR devices and applies the transformations to a three.js camera object.
-->
<script src="./js/VRControls.js"></script>
<!--
VREffect.js handles stereo camera setup and rendering.
-->
<script src="./js/VREffect.js"></script>
<!--
A polyfill for WebVR using the Device{Motion,Orientation}Event API.
-->
<script src="./js/webvr-polyfill.js"></script>
<!--
Helps enter and exit VR mode, provides best practices while in VR.
-->
<script src="./js/webvr-manager.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.min.js"></script>

<script>
var foundDemos = new Array();
<?php
$dir    = './Previews';
$files = scandir($dir);

foreach ($files as $key => $value)
{ 
	if (strpos($value,'.png') !== false) {
		print("foundDemos.push('".substr($value,0,strpos($value,'.png'))."');");
	}
}
?>
console.log(foundDemos);

var FizzyText = function() {
    this.message = 'Root gallery of demos';
    this.navigation = 'i key to rotate demos';
    this.action = 'Enter to reach the one in front';
};

var text = new FizzyText();
var gui = new dat.GUI();
gui.add(text, 'message');
gui.add(text, 'navigation');
gui.add(text, 'action');

//Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);

scene.add(camera);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {hideButton: false});

var mygeometry = new THREE.CubeGeometry( 1, 1, 0.1 );
mytexture = THREE.ImageUtils.loadTexture('textures/motivation_poster.jpg');
var mymaterial = new THREE.MeshBasicMaterial({map: mytexture});
myPoster = new THREE.Mesh( mygeometry, mymaterial );
myPoster.position.set(0, 0, 2);
scene.add(myPoster);

// TODO automatize the gallery using foundDemos
// should be around a semi circle facing the opposite of the viewer
var myDemos = new Array();
myDemos.push(
	{texture:'./Previews/edits.png', url: 'edits.html', startx:0, starty:0, startz:-1.3},
	{texture:'./Previews/graph.png', url: 'graph.html', startx:2, starty:0, startz:-1},
	{texture:'./Previews/futurui.png', url: 'futurui.html', startx:-2, starty:0, startz:-1}
	);
//myDemos.push({texture:'./Previews/sphere.png', url: 'sphere.html', startx:-2, starty:0, startz:-1});

myDemos.forEach( function(item, index, array){
	var mygeometry = new THREE.CubeGeometry( 2, 1, 0.1 );
	mytexture = THREE.ImageUtils.loadTexture(item.texture);
	var mymaterial = new THREE.MeshBasicMaterial({map: mytexture});
	tmpcube = new THREE.Mesh( mygeometry, mymaterial );
	tmpcube.position.set(item.startx, item.starty, item.startz);
	tmpcube.lookAt(camera.position);
	scene.add(tmpcube);
	item["object3D"] = tmpcube;
});

// Also add a repeating grid as a skybox.
var boxWidth = 10;
var texture = THREE.ImageUtils.loadTexture(
        'textures/box.png'
);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(boxWidth, boxWidth);

var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
var material = new THREE.MeshBasicMaterial({
  map: texture,
  color: 0x333333,
  side: THREE.BackSide
});

var skybox = new THREE.Mesh(geometry, material);
scene.add(skybox);

// Request animation frame loop function
function animate() {

  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera);

  requestAnimationFrame(animate);
  
}

function ShiftDemos(){
	// TODO move on to N demo
	tmp = myDemos[0];
	myDemos[0]=myDemos[1];
	myDemos[1]=myDemos[2];
	myDemos[2]=tmp;
	// really dirty...
	myDemos[1].object3D.position.set(0, 0, -1.3);
	myDemos[1].object3D.lookAt(camera.position);
	myDemos[2].object3D.position.set(2, 0, -1);
	myDemos[2].object3D.lookAt(camera.position);
	myDemos[0].object3D.position.set(-2, 0, -1);
	myDemos[0].object3D.lookAt(camera.position);
}

var myTimer = setInterval(ShiftDemos, 4000);

// Kick off animation loop
animate();

// Reset the position sensor when 'z' pressed.
function onKey(event) {
  if (event.keyCode == 13) { // enter
	window.open(myDemos[1].url, '_self', false);
	// assuming the demo in the center is the 2nd in the array
  }
  if (event.keyCode == 73) { // 'i'
	ShiftDemos();
	clearInterval(myTimer);
	myTimer = setInterval(ShiftDemos, 4000);
  }
};

window.addEventListener('keydown', onKey, true);

// Handle window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize, false);

</script>
<!--
Make sure that, in addition to being technically correct, the VR app is actually pleasant
following lessons from cognitive science.
-->
<script src="./VRGoodPractices.js"></script>

</html>
