// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);


// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var reticle = vreticle.Reticle(camera);
scene.add(camera);

// load Wiki graph
arr=MyWiki; //imported before as .js file
var dictionary = arr.Nodes;
var keys = [];
keys = Object.keys(dictionary);

// example of traversing the graph
var firstkey = keys[0];

// "PmWiki.Links" = {Id:"PmWiki.Links", Group:"PmWiki", Label:"Links", Size:6064, Time:1161032541, Rev:5, Texture: "HomePage.png", Targets: ["group1,page2", "group2.page1"]},

var pagesize = 1;

// functions assumed a scene nammed "scene"

// adding a page from the graph to the 3D scene
function PositionPage(dictionary, PIMPage, position){
	if (!position) {
		var boundary = -5;
		var position = new THREE.Vector3(Math.random() * 2 * (-boundary) + boundary,
				Math.random() * 2 * (-boundary) + boundary,
				Math.random() * 2 * (-boundary) + boundary);
	}
	var mygeometry = new THREE.CubeGeometry(pagesize, pagesize, pagesize * PIMPage.Rev / 100);
	var mytexture = THREE.ImageUtils.loadTexture("../MyRenderedPages/fabien.benetou.fr_" + PIMPage.Id.replace(".", "_") + ".png");
	// consider instead http://threejs.org/docs/#Reference/Loaders/TextureLoader
	var mymaterial = new THREE.MeshBasicMaterial({map: mytexture, transparent: false, opacity: 0.2, });
	newpage = new THREE.Mesh( mygeometry, mymaterial );
	newpage.position.copy(position);
	scene.add(newpage);
	PIMPage.ThreeD = newpage;
	return dictionary;
}

// add a button on the top right corner of a positionned page
function PositionPageJumpButton(dictionary, PIMPage) {
	var pageproportion = pagesize/5;
	var geometry = new THREE.CubeGeometry(pageproportion, pageproportion, pageproportion); 
	var material = new THREE.MeshBasicMaterial({color: 0x00FFFF, transparent: true, opacity: 0.5 });
	var jumpbutton = new THREE.Mesh(geometry, material);
	jumpbutton.position = PIMPage.ThreeD.position;
	jumpbutton.position.setX(pagesize/2 + pagesize/10);
	jumpbutton.position.setY(pagesize/2 - pagesize/10);
	PIMPage.ThreeD.add(jumpbutton);
	
        jumpbutton.ongazelong = function() {
		PositionPageTargets(dictionary, PIMPage);
        }
        jumpbutton.ongazeover = function() {
		jumpbutton.scale.set(2,2,2);
        }
        jumpbutton.ongazeout = function() {
		jumpbutton.scale.set(1,1,1);
        }
        reticle.add_collider(jumpbutton);
	return PIMPage;
}

// Display the targets of a page (linked item)
function PositionPageTargets(dictionary, PIMPage){
	var backgroundPosition = new THREE.Vector3();
	backgroundPosition.copy(PIMPage.ThreeD.position);
	backgroundPosition.z = -5;
	var maxDisplayedTargets = 5;
	var displayedTargets = 0;
	for (targetPage in PIMPage.Targets){
		var targetPageObj = dictionary[keys[targetPage]];
		// can display a lot, in fact enough to crash the browser
		if (displayedTargets < maxDisplayedTargets) {
			PositionPage(dictionary, targetPageObj, backgroundPosition);
			PositionPageJumpButton(dictionary, targetPageObj);
			backgroundPosition.y += pagesize + pagesize/10;	
			displayedTargets++;
		}
	}
	return dictionary;
}

function PositionPagesAsSphere(dictionary, startingkey, limit){
	// Display the first pages (no specific order)
	if (!limit){
		var limit = 5;
	}
	if (!startingkey){
		var startingkey = 0;
	}
	for (var i=startingkey;i<startingkey+limit;i++){
		var PIMPage = dictionary[keys[i]];
		var radius = 3;
		var x = Math.random() - 0.5;
		var y = Math.random() - 0.5;
		var z = Math.random() - 0.5;
		var pageposition = new THREE.Vector3(x,y,z);
		pageposition.normalize();
		pageposition.multiplyScalar( radius );
		PositionPage(dictionary, PIMPage, pageposition);
		PositionPageJumpButton(dictionary, PIMPage);
		PIMPage.ThreeD.lookAt(camera.position);
	}
}

//PositionPagesAsSphere(dictionary);
PositionPagesAsSphere(dictionary, 0, 5);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// boundary sphere
var geometry = new THREE.SphereGeometry(24, 12, 8);
var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.5, wireframe: true}));
scene.add(sphere);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {hideButton: false});


// Request animation frame loop function
function animate(timestamp) {

  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);

  reticle.reticle_loop();
  requestAnimationFrame(animate);
}

// Kick off animation loop
animate();

// Reset the position sensor when 'z' pressed.
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.resetSensor();
  }
}

window.addEventListener('keydown', onKey, true);
