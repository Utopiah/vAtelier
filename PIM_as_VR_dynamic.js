var FizzyText = function() {
    this.message = 'pick and move the central cube';
    this.keys = 'left key to de/activate';
    this.recul = 0;
};


window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();
    gui.add(text, 'message');
    gui.add(text, 'keys');
    gui.add(text, 'recul', -1, 1);
};

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


// PIM related data
var PIMurl = "http://fabien.benetou.fr/";
var PIMurlTrailing = "?action=print";
var TexturesURL = "ImagesFromPIM/";

// load a sub-graph of nodes with threshold of 10 nodes
// if no differential positioning set default value of 0

BASEURL = "http://fabien.benetou.fr/";
BASELOCALPATH = "/home/web/benetou.fr/fabien/wiki.d/";

// https://github.com/ariya/phantomjs/blob/master/examples/render_multi_url.js
// consider using phantomjs to pre-render the textures
// could be nightly batch job with an hourly run only for new pages since (iif fast enough)
// could also check for date difference, display a marker if new page since app loaded and propose a force fresh texture generation then reload
var Nodes = [{
    Id: "PmWiki.Links",
    Group: "PmWiki",
    Label: "Links",
    Size: 6064,
    Time: 1161032541,
    Rev: 5,
    Texture: "HomePage.png"
}, {
    Id: "PmWiki.WikiWikiWeb",
    Group: "PmWiki",
    Label: "WikiWikiWeb",
    Size: 6064,
    Time: 1161032541,
    Rev: 10,
    Texture: "JavaScript.png"
}, {
    Id: "PmWiki.WikiSandbox",
    Group: "PmWiki",
    Label: "WikiSandbox",
    Size: 6064,
    Time: 1161032541,
    Rev: 50,
    Texture: "3DVisualization.png"
}, ];
var Vertices = [{
    FROM: "PmWiki.Links",
    TO: "PmWiki.WikiWikiWeb"
}, {
    FROM: "PmWiki.Links",
    TO: "PmWiki.WikiSandbox"
}];

var texture = THREE.ImageUtils.loadTexture(
    'textures/patterns/checker.png'
);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat = new THREE.Vector2(50, 50);
texture.anisotropy = renderer.getMaxAnisotropy();
alert('wiki Vertices '+MyWiki.Vertices.length+' nodes '+MyWiki.Nodes.length);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
});

var geometry = new THREE.PlaneGeometry(10, 10);

var mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

var NodeCubes = [];
for (var i = 0; i < Nodes.length; i += 1) {
    var mysize = 1;
    // depth based on number of revisions i.e. the more revision, the deeper the shape
    var mygeometry = new THREE.CubeGeometry(mysize, mysize, mysize * Nodes[i].Rev / 100)
    var mycubecolor = (Math.random() * 0xffffff);
    for (var j = 0; j < mygeometry.faces.length; j++) {
        mygeometry.faces[j].color.setHex(mycubecolor);
    }
    mytexture = THREE.ImageUtils.loadTexture(TexturesURL + Nodes[i].Texture);
    var mymaterial = new THREE.MeshBasicMaterial({
        map: mytexture
    });
    tmpcube = new THREE.Mesh(mygeometry, mymaterial);
    tmpcube.position.set(-1, 0, -1.5);
    tmpcube.position.x += i;
    // position nodes with force layout on the plane with differential positioning
    console.log("https://vida.io/documents/HRt7haiqq8Sbfh4nn");
    // align all nodes on a line

    scene.add(tmpcube);
    NodeCubes.push(tmpcube);
}

// test for 2nd group of pages, showcasing a proper full 3D effect
for (var i = 0; i < Nodes.length; i += 1) {
    var mysize = 1;
    // depth based on number of revisions i.e. the more revision, the deeper the shape
    var mygeometry = new THREE.CubeGeometry(mysize, mysize, mysize * Nodes[i].Rev / 100)
    var mycubecolor = (Math.random() * 0xffffff);
    for (var j = 0; j < mygeometry.faces.length; j++) {
        mygeometry.faces[j].color.setHex(mycubecolor);
    }
    mytexture = THREE.ImageUtils.loadTexture(TexturesURL + Nodes[i].Texture);
    var mymaterial = new THREE.MeshBasicMaterial({
        map: mytexture
    });
    tmpcube = new THREE.Mesh(mygeometry, mymaterial);
    tmpcube.position.set(-1, 1, -1.2);
    tmpcube.position.x += i;
    tmpcube.rotateX(0.5);
    // align all nodes on a line

    scene.add(tmpcube);
}

// test for 3rd group of pages, showcasing a proper full 3D effect
var mysize = 1;
// depth based on number of revisions i.e. the more revision, the deeper the shape
var mygeometry = new THREE.CubeGeometry(mysize, mysize, mysize * Nodes[2].Rev / 100)
var mycubecolor = (Math.random() * 0xffffff);
for (var j = 0; j < mygeometry.faces.length; j++) {
    mygeometry.faces[j].color.setHex(mycubecolor);
}
mytexture = THREE.ImageUtils.loadTexture(TexturesURL + Nodes[2].Texture);
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
tmpcube = new THREE.Mesh(mygeometry, mymaterial);
tmpcube.position.set(-2.0, 0, -1.5);
tmpcube.rotateY(0.5);
// align all nodes on a line

scene.add(tmpcube);


var xmlhttp = new XMLHttpRequest();
var url = "./Wiki.json";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        myFunction(myArr);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
    var pagesdisplayed = 0;
    var i = 0;
    console.log(pagesdisplayed);
    console.log(arr.length);
    while (pagesdisplayed < 4 && i < arr.Nodes.length) {
        i++;
        console.log(arr.Nodes[i].Id);
        console.log(arr.Nodes[i].Rev);
        if (arr.Nodes[i].Id.indexOf("RecentChanges") == -1) {
            var mysize = 1;
            // depth based on number of revisions i.e. the more revision, the deeper the shape
            var mygeometry = new THREE.CubeGeometry(mysize, mysize, mysize * arr.Nodes[i].Rev / 100)
            var mycubecolor = (Math.random() * 0xffffff);
            for (var j = 0; j < mygeometry.faces.length; j++) {
                mygeometry.faces[j].color.setHex(mycubecolor);
            }
            mytexture = THREE.ImageUtils.loadTexture("./MyRenderedPages/fabien.benetou.fr_" + arr.Nodes[i].Id.replace(".", "_") + "?action=print.png");
            // should render pages in Print mode ( ?action=print )
            // seems the web server does not want to offer it
            mytexture = THREE.ImageUtils.loadTexture("./MyRenderedPages/fabien.benetou.fr_" + arr.Nodes[i].Id.replace(".", "_") + ".png");
            // RecentChanges page do not get generated, none of them, as they are not part of the normal pages
            var mymaterial = new THREE.MeshBasicMaterial({
                map: mytexture
            });
            tmpcube = new THREE.Mesh(mygeometry, mymaterial);
            tmpcube.position.set(-1, -1, -1.5);
            tmpcube.position.x += pagesdisplayed;
            scene.add(tmpcube);
            pagesdisplayed++;
        }
    }
}

// TODO clarify why using cube from the function does not work
MovableCube = NodeCubes[1];
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
tmpcube = new THREE.Mesh(mygeometry, mymaterial);
tmpcube.position.set(0, 0, 2);
scene.add(tmpcube);

// Position cube mesh

// TODO flatten then link on click to https://github.com/Utopiah/CC2015Goal3Month1 2 and 3 as own rooms
var mygeometry = new THREE.CubeGeometry(1, 1.5, 0.1);
mytexture = THREE.ImageUtils.loadTexture('textures/CC2015Goal3Month1.png');
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
tmpcube = new THREE.Mesh(mygeometry, mymaterial);
tmpcube.position.set(-3, -2, -1);
tmpcube.rotateY(1);
scene.add(tmpcube);

// TODO flatten then link on click to https://github.com/Utopiah/CC2015Goal3Month1 2 and 3 as own rooms
var mygeometry = new THREE.CubeGeometry(1, 1.5, 0.1);
mytexture = THREE.ImageUtils.loadTexture('textures/CC2015Goal3Month2.png');
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
tmpcube = new THREE.Mesh(mygeometry, mymaterial);
tmpcube.position.set(-3, 0, -1);
tmpcube.rotateY(1);
scene.add(tmpcube);

// TODO flatten then link on click to https://github.com/Utopiah/CC2015Goal3Month1 2 and 3 as own rooms
var mygeometry = new THREE.CubeGeometry(1, 1.5, 0.1);
mytexture = THREE.ImageUtils.loadTexture('textures/CC2015Goal3Month3.png');
var mymaterial = new THREE.MeshBasicMaterial({
    map: mytexture
});
tmpcube = new THREE.Mesh(mygeometry, mymaterial);
tmpcube.position.set(-3, 2, -1);
tmpcube.rotateY(1);
scene.add(tmpcube);

cube.position.y = -1;
cube.position.z = -1;

// Add cube mesh to your three.js scene
scene.add(cube);

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
    // Apply rotation to cube mesh
    cube.rotation.y += 0.01;

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