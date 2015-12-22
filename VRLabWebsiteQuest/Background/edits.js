//Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
scene.add(camera);


var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var manager = new WebVRManager(renderer, effect, {hideButton: true});

var cameraPositionsV3 = new Array();
// TODO smoother movement

var speeds = new Array();

var loader=new THREE.STLLoader();
var mesh;
loader.addEventListener('load', function (event){
	var geometry=event.content;
	var material=new THREE.MeshBasicMaterial({ color: 0xfdd017, wireframe: true });
	mesh=new THREE.Mesh(geometry, material);
	mesh.scale.set(0.1,0.1,0.1);
	mesh.position.set(0,2,-2);
        var rotatetween = new TWEEN.Tween(mesh.rotation).to({y: 2*Math.PI}, 30*1000).start();
	rotatetween.repeat(Infinity);
	scene.add(mesh);
	});
// STL file to be loaded
loader.load('ouroboros.stl');
    
// Also add a repeating grid as a skybox.
var boxWidth = 10;
var texture = THREE.ImageUtils.loadTexture( '/MyDemo/textures/box.png');
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
    skybox.rotation.x += 0.01;
    skybox.rotation.y += 0.01;

    // Render the scene through the manager.
    manager.render(scene, camera);

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
	if (mydebug) console.log("stop animation");
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
