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

// Create 3D objects.
var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);

var picked = false;
var previous_dist = camera.position.distanceTo(cube);
var gazed = false;

var lookAtVector = new THREE.Vector3(0, 0, -1);

var newPos = new THREE.Vector3();


arr=MyWiki; //imported before as .js file
var pagesdisplayed = 0;
var i = 100;
var maxpages = 16;
var pagesperline = 8;
var pagesize = 1;
var threedisplaypages = new Array();
var currentline =  0;
while (pagesdisplayed < maxpages && i < arr.Nodes.length) {
	console.log("pages displayed:", pagesdisplayed+1);
	i++;
	console.log("Current node ID:", arr.Nodes[i].Id);
	console.log("Current node revisions:", arr.Nodes[i].Rev);
	//console.log("Current node vertices:", arr.Vertices[i]);
	var linkedPages = new Array();
	for(var j= 0; j < arr.Vertices.length; j++)
	{
		if (arr.Vertices[j].FROM == arr.Nodes[i].Id)
			linkedPages = arr.Vertices[j].TO;
	}
	console.log("Found linked pages: ",linkedPages);
	if (arr.Nodes[i].Id.indexOf("RecentChanges") == -1) {
		// depth based on number of revisions i.e. the more revision, the deeper the shape
		var mygeometry = new THREE.CubeGeometry(pagesize, pagesize, pagesize * arr.Nodes[i].Rev / 100)
		mytexture = THREE.ImageUtils.loadTexture("./MyRenderedPages/fabien.benetou.fr_" + arr.Nodes[i].Id.replace(".", "_") + ".png");
		// RecentChanges page do not get generated, none of them, as they are not part of the normal pages
		mytexture.minFilter = THREE.LinearFilter;
		var mymaterial = new THREE.MeshBasicMaterial({ map: mytexture });
		currentcube = new THREE.Mesh(mygeometry, mymaterial);
		if (pagesdisplayed%pagesperline == 0){
			currentline++;
		}
		currentcube.position.set(-4.5, 4.5, -2.5);
		currentcube.position.x += 1.2*Math.round(pagesdisplayed%pagesperline);
		currentcube.position.y -= pagesize + 1.2*Math.round(pagesdisplayed/pagesperline);
		currentcube.position.z -= 3+4*arr.Nodes[i].ChangeTime/1004552460;
		console.log("CT:",arr.Nodes[i].ChangeTime);
		currentcube.rotateX(Math.PI/8/currentline);
		scene.add(currentcube);
		pagesdisplayed++;
	}
	threedisplaypages.push({id:arr.Nodes[i].Id,links:linkedPages,threed:currentcube});
}

for (var i=0;i<10;i++){
	var geometry= new THREE.Geometry();
	geometry.vertices.push(
			threedisplaypages[Math.floor(Math.random()*threedisplaypages.length)].threed.position,
			threedisplaypages[Math.floor(Math.random()*threedisplaypages.length)].threed.position
			);
	var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	var line = new THREE.Line(geometry);
	scene.add(line);
}

/*
//go through all the pages displayed
for (var i=0; i<threedisplaypages.length;i++){
	//go through all the links of the current page
	currentpage = threedisplaypages[i];
	for (var j=0; currentpage.links.length;j++){
		currentlinkedpage = currentpage.links[j];
		//current linked page
		for (var k=0; k<threedisplaypages.length;k++){
			if (currentlinkedpage == threedisplaypages[k]){
				for (var l=0; l<threedisplaypages.length;l++){
					if (currentlinkedpage.Id == threedisplaypages[l].Id){
						var geometry= new THREE.Geometry();
						geometry.vertices.push( threedisplaypages[i].threed.position, threedisplaypages[l].threed.position);
						var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
						var line = new THREE.Line(geometry);
						scene.add(line);
					}
				}
			}
		}
	}
}
*/

// TODO clarify why using cube from the function does not work
MovableCube = currentcube;
MovableCube.ongazelong = function() {

}

MovableCube.ongazeover = function() {
    gazed = true;
}

MovableCube.ongazeout = function() {
    gazed = false;
}

reticle.add_collider(MovableCube);

var mygeometry = new THREE.CubeGeometry(1, 1, 0.1);
mytexture = THREE.ImageUtils.loadTexture('textures/motivation_poster.jpg');
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
myposter = new THREE.Mesh(mygeometry, mymaterial);
myposter.position.set(0, 0, 2);
scene.add(myposter);


var FizzyText = function() {
    this.message = 'Wiki pages as a graph';
    this.vertices = MyWiki.Vertices.length;
    this.edges = MyWiki.Nodes.length;
    this.instructions = 'p key to pick/drop';
    this.boxwireframe = false;
};


window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();
    gui.add(text, 'message');
    gui.add(text, 'vertices');
    gui.add(text, 'edges');
    gui.add(text, 'instructions');
    gui.add(text, 'boxwireframe');
};

// Position cube mesh

// Add cube mesh to your three.js scene

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
 transparent: true, opacity: 0.7
	//wireframe: FizzyText.wireframe
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

    reticle.reticle_loop();

    requestAnimationFrame(animate);

    if (picked && gazed) {
        lookAtVector = new THREE.Vector3(0, 0, -2);
        lookAtVector.applyQuaternion(camera.quaternion);
        newPos.copy(lookAtVector);
        newPos.add(camera.position);

        MovableCube.position.copy(newPos);
    }
}

// Kick off animation loop
animate();

// Reset the position sensor when 'z' pressed.
function onKey(event) {
    if (event.keyCode == 90) { // z
        controls.resetSensor();
    }
    if (event.keyCode == 13) { // enter
        window.open('ExamplePageAsRoom.html', '_self', false);
    }
    if (event.keyCode == 80) { // p
        picked = !picked;
    }
};

function onClick(event) {
    window.open('ExamplePageAsRoom.html', '_self', false);
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

window.addEventListener('resize', onWindowResize, false);
