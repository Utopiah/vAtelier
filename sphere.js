var mydebug = true;

var params = {
    positionZpages: -2
}

var FizzyText = function() {
    this.message = 'Wiki pages as a graph';
    this.instructions = 'p key to pick/drop';
    this.vertices = MyWiki.Vertices.length;
    this.edges = MyWiki.Nodes.length;
    this.positionZpages = params.positionZpages;
};

var text = new FizzyText();
var gui = new dat.GUI();
gui.add(text, 'message');
gui.add(text, 'instructions');
gui.add(text, 'vertices');
gui.add(text, 'edges');
gui.add(params, 'positionZpages').min(-9).max(-1).step(0.5).onFinishChange(function(){
    //currentcube.position.z = params.positionZpages;
    for (var i=0; i<threedisplaypages.length;i++){
	threedisplaypages[i].threed.position.z = params.positionZpages;
	}
})

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

// object picking
var picked = false;
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
var radius = 3;

while (pagesdisplayed < maxpages && i < arr.Nodes.length) {
	if (mydebug) console.log("pages displayed:", pagesdisplayed+1);
	i++;
	if (mydebug) console.log("Current node ID:", arr.Nodes[i].Id);
	if (mydebug) console.log("Current node revisions:", arr.Nodes[i].Rev);
	//if (mydebug) console.log("Current node vertices:", arr.Vertices[i]);
	var linkedPages = new Array();
	for(var j= 0; j < arr.Vertices.length; j++)
	{
		if (arr.Vertices[j].FROM == arr.Nodes[i].Id)
			linkedPages = arr.Vertices[j].TO;
	}
	if (mydebug) console.log("Found linked pages: ",linkedPages);
	// RecentChanges page do not get generated, none of them, as they are not part of the normal pages
	if ((arr.Nodes[i].Id.indexOf("RecentChanges") == -1) && (arr.Nodes[i].Id.indexOf("PmWiki.") == -1)) {
		// depth based on number of revisions i.e. the more revision, the deeper the shape
		var mygeometry = new THREE.CubeGeometry(pagesize, pagesize, pagesize * arr.Nodes[i].Rev / 100)
		mytexture = THREE.ImageUtils.loadTexture("./MyRenderedPages/fabien.benetou.fr_" + arr.Nodes[i].Id.replace(".", "_") + ".png");
		// should manage onError texture loading, requires closures though
		mytexture.minFilter = THREE.LinearFilter;
		var mymaterial = new THREE.MeshBasicMaterial({ map: mytexture });
		currentcube = new THREE.Mesh(mygeometry, mymaterial);
		if (pagesdisplayed%pagesperline == 0){
			currentline++;
		}

		var x = Math.random() - 0.5;
		var y = Math.random() - 0.5;
		var z = Math.random() - 0.5;
		currentcube.position.set( x, y, z );
		currentcube.position.normalize();
		currentcube.position.multiplyScalar( radius );

		currentcube.lookAt(camera.position);
		scene.add(currentcube);
		pagesdisplayed++;
	}
	threedisplaypages.push({id:arr.Nodes[i].Id,links:linkedPages,threed:currentcube});
}

// cheating, random connections
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
// TODO horrible solution, must be moved in the Python preprocessed part hence getting arr=MyWiki directly useful
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

currentlygazedcube = false;
pickedcube = false;
threedisplaypages.forEach(function (item, index, array){
	item.threed.ongazelong = function() {
		currentlygazedcube = item.id;
		if (mydebug) console.log(currentlygazedcube);
	}
	item.threed.ongazeover = function() {
		if (!picked){
			pickedcube = item.threed;
			picked = true;
		}
	}
	item.threed.ongazeout = function() {
		pickedcube = false;
		picked = false;
		currentlygazedcube = false;
	}
	reticle.add_collider(item.threed);
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

    reticle.reticle_loop();

    requestAnimationFrame(animate);

    if (picked && gazed) {
        lookAtVector = new THREE.Vector3(0, 0, -2);
        lookAtVector.applyQuaternion(camera.quaternion);
        newPos.copy(lookAtVector);
        newPos.add(camera.position);
        pickedcube.position.copy(newPos);
    }
}

// Kick off animation loop
animate();

function onKey(event) {
    if (event.keyCode == 90) { // z to reset the sensors
        controls.resetSensor();
	if (mydebug) console.log("sensor resetted");
    }
    if (event.keyCode == 13) { // enter to enter a room
	// make it gaze specific
	if (currentlygazedcube) {
		if (mydebug) console.log("should window.open on this page: ", currentlygazedcube);
		window.open('PageAsRoom.html?PIMPage='+currentlygazedcube, '_self', false);
	}
    }
    if (event.keyCode == 80) { // p to pick then later release an object
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

//window.addEventListener('resize', onWindowResize, false);
