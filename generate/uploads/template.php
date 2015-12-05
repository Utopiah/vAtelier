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

<!--
Library to handle 3D in the browser using webGL.
-->
<script src="/MyDemo/js/three.js"></script>
<!--
VRControls.js acquires positional information from connected VR devices and applies the transformations to a three.js camera object.
-->
<script src="/MyDemo/js/VRControls.js"></script>
<!--
VREffect.js handles stereo camera setup and rendering.
-->
<script src="/MyDemo/js/VREffect.js"></script>
<!--
A polyfill for WebVR using the Device{Motion,Orientation}Event API.
-->
<script src="/MyDemo/js/webvr-polyfill.js"></script>
<!--
Helps enter and exit VR mode, provides best practices while in VR.
-->
<script src="/MyDemo/js/webvr-manager.js"></script>
<!--
Library to handle visual interaction with object using ray casting.
-->
<script src="/MyDemo/js/vreticle.js"></script>

<!--
Make sure that, in addition to being technically correct, the VR app is actually pleasant
following lessons from cognitive science.
-->
<script src="/MyDemo/js/VRGoodPractices.js"></script>

<script>
/* TODO

- object along curve or sphere (use Pi...)
 - can be of decreasing size, have to find solution after number > threshold
- symplify the script in order to provide a frontend with upload

*/

var mydebug = true;

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
var reticle = vreticle.Reticle(camera);
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

var myDemos = new Array();
myDemos.push(
        {texture:'./textures/slides-0.png', startx:0, starty:0, startz:-1.5},
        {texture:'./textures/slides-1.png', startx:1.5, starty:0, startz:-0.5},
        {texture:'./textures/slides-2.png', startx:0.7, starty:0, startz:1.2},
        {texture:'./textures/slides-3.png', startx:-1.0, starty:0, startz:1.2},
        {texture:'./textures/slides-4.png', startx:-1.5, starty:0, startz:-0.5},

        {texture:'./textures/slides-5.png', startx:0, starty:2, startz:0},
        {texture:'./textures/slides-5.png', startx:0, starty:-1, startz:0}
        );
//myDemos.push({texture:'./Previews/sphere.png', url: 'sphere.html', startx:-2, starty:0, startz:-1});

var mySlides = new Array();
myDemos.forEach( function(item, index, array){
        var mygeometry = new THREE.CubeGeometry( 2, 1, 0.1 );
        mytexture = THREE.ImageUtils.loadTexture(item.texture);
        var mymaterial = new THREE.MeshBasicMaterial({map: mytexture});
        tmpcube = new THREE.Mesh( mygeometry, mymaterial );
        tmpcube.position.set(item.startx, item.starty, item.startz);
        tmpcube.lookAt(camera.position);
        scene.add(tmpcube);
	mySlides.push(tmpcube);
	tmpcube.scale.set(1,1,1);
	tmpcube.material.opacity = 0.5;
	tmpcube.material.transparent = true;
});

mySlides.forEach( function(item, index, array){
        item.ongazelong = function() {
		item.scale.set(1,1,1);
		item.material.opacity = 1;
        }
        item.ongazeover = function() {
        }
        item.ongazeout = function() {
		item.scale.set(0.7,0.7,0.7);
		item.material.opacity = 0.5;
        }
        reticle.add_collider(item);
});

// boundary sphere
var geometry = new THREE.SphereGeometry(24, 12, 8);
var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.5, wireframe: true}));
scene.add(sphere);

// Request animation frame loop function
function animate() {
    // Apply rotation to cube mesh

    // Update VR headset position and apply to camera.
    controls.update();
    // Render the scene through the manager.
    manager.render(scene, camera);
    tmpcube.rotateZ(0.05);

    requestAnimationFrame(animate);
	reticle.reticle_loop();
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

function onClick(event) {
};

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

</script>
</html>
