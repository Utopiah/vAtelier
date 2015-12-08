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
- personnalized welcome to vontjen (Zelda's style)
 - Many years ago an evil urbanist started plans to destory the beautiful forest of Rivierenhof. He gathered one of the triforce with power to bring the trees down. Princess Zelda had one of the triforce with wisdom. She divided it in into 8 units to hide it from the urbanist before she was captured. Go find the 8 units vontjen to save her.
  - can be displayed as texture on block, looking at a part of the block (long gaze at a red cross) would make it disappear
- explore forests and caves
 - look down to activate/deactivate slow walking
  - display instruction for that too, Zelda's style
 - first forest and cave can look just like the typical one
  - it is dangerous to go alone take this (pick beer or silly item)
- ideally stateful else reset position and items picked every time...
 - not particularly hard to do
  - saving/loading a JSON file done before for HourGlass
   - can be done with a timer at specific interval
- "end" of the world is wireframed (a la The Thirteenth Floor)
 - suggest workshop to go further since he knows programming (computer science student and saw SQL lines in post history)
 - true Zelda's spirit or make it your own little world

TECHNICAL
- define maps
 - terrain xxxxx,xxx x,xxx x, xx  x, xxxxx
  - should easilly convert from map to absolute xyz positions
 - items 000000, 00000, 00000, 00100, 00000 
- define movements
 - var walking = false;
 - position circle under player, child of camera (cf last code from PantinVR)
 - gazelong on circle switch state of walking, update circle color (red stop, green walk)
- animate()
 - if (walking) { if (player.position + walking_step in empty terrain) player.position += step; }

Technically consider using bower and http://www.threejsgames.com/extensions/
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

var myTerrainTiles = new Array();
myTerrainTiles.push(
        {color: 0xf0f0f0, x:1, y: -0.5, z:-4, blocking: true},
        {color: 0xf0f0f0, x:0, y: -0.5, z:-3, blocking: true},
        {color: 0xf0f0f0, x:2, y: -0.5, z:-3, blocking: true},
        {color: 0xf0f0f0, x:1, y: -0.5, z:1, blocking: true},
        {color: 0xf0f0f0, x:0, y: -0.5, z:1, blocking: true},
        {color: 0xf0f000, x:2, y: -0.5, z:-2, blocking: true},
        {color: 0xf0f0f0, x:2, y: -0.5, z:-1, blocking: true},
        {color: 0xf0f0f0, x:2, y: -0.5, z:0, blocking: true},
        {color: 0xf0f0f0, x:2, y: -0.5, z:1, blocking: true},
        {color: 0xf0f00f, x:-1, y: -0.5, z:-2, blocking: true},
        {color: 0xf0f0f0, x:-1, y: -0.5, z:-1, blocking: true},
        {color: 0xf0f0f0, x:-1, y: -0.5, z:0, blocking: true},
        {color: 0xf0f0f0, x:-1, y: -0.5, z:1, blocking: true},

        {color: 0x00ff00, x:1, y: -1, z:-3, goal: true},
        {color: 0x00ff00, x:1, y: -1, z:-2},
        {color: 0x00ff00, x:0, y: -1, z:-2},
        {color: 0x00ff00, x:0, y: -1, z:0},
        {color: 0x00ff00, x:1, y: -1, z:0},
        {color: 0x00ff00, x:0, y: -1, z:-1},
        {color: 0x00ff00, x:1, y: -1, z:-1}
        );
//myDemos.push({texture:'./Previews/sphere.png', url: 'sphere.html', startx:-2, starty:0, startz:-1});

var tileWidth = 1;
var tileLength = 1;
var myDisplayedTiles = new Array();
var myWallingTiles = new Array();
var myGoalTiles = new Array();
myTerrainTiles.forEach( function(item, index, array){
        var mygeometry = new THREE.CubeGeometry( tileWidth, 0.1, tileLength );
        //mytexture = THREE.ImageUtils.loadTexture(item.texture);
        var mymaterial = new THREE.MeshBasicMaterial({color: item.color});
        tile = new THREE.Mesh( mygeometry, mymaterial );
        tile.position.set(item.x, item.y, item.z);
        scene.add(tile);
	myDisplayedTiles.push(tile);
        if (item.hasOwnProperty('blocking')){
		myWallingTiles.push(tile);
	}
        if (item.hasOwnProperty('goal')){
		var geometry = new THREE.SphereGeometry(0.2, 12, 8);
		var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0000FF, transparent: true, opacity: 0.5}));
        	sphere.position.set(item.x, 0, item.z);
		myGoalTiles.push(sphere);
		scene.add(sphere);
	}
});

var walking = false;
var mygeometry = new THREE.CubeGeometry( 0.5, 0.1, 0.5 );
//mytexture = THREE.ImageUtils.loadTexture(item.texture);
var mymaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
walkerZone = new THREE.Mesh( mygeometry, mymaterial );
walkerZone.position.set(0,-0.9,0);
scene.add(walkerZone);
walkerZone.ongazelong = function() {
	walking = !walking;
	walkerZone.material.color.setHex(0xff0000);
	if (walking) walkerZone.material.color.setHex(0x00bb00);
}
walkerZone.ongazeover = function() {
}
walkerZone.ongazeout = function() {
}
reticle.add_collider(walkerZone);

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

    requestAnimationFrame(animate);
    reticle.reticle_loop();

    if (walking){
        var futurPosition = camera.position.clone();
        futurPosition.z += camera.getWorldDirection().z/100;
        futurPosition.x += camera.getWorldDirection().x/100;

	var tooClose = false;
	for (wall in myWallingTiles){
		if (futurPosition.distanceTo(myWallingTiles[wall].position) < tileWidth){
			tooClose=true;
		}
	}
	if (!tooClose){
		camera.position.z += camera.getWorldDirection().z/100;
		camera.position.x += camera.getWorldDirection().x/100;
		walkerZone.position.x = camera.position.x;
		walkerZone.position.z = camera.position.z;
		for (goal in myGoalTiles){
			if (camera.position.distanceTo(myGoalTiles[goal].position) < tileWidth + 0.2){
				console.log('Goal reached!');
				scene.remove(myGoalTiles[goal]);
				myGoalTiles.splice(goal,1);
			}
		}
	}
    }
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