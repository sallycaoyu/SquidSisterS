import * as THREE from 'three';

// create a scene of 10 spheres w random size and color and location

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 ); // set to a light grey, later change w enviornment 

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 ); // 10000 ?

const objects = []; // to keep track of drag and drop
var startColor; 

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 100;

function init() {
    scene.add( new THREE.AmbientLight( 0x0f0f0f ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
    scene.add(light);

	const geometry = new THREE.SphereGeometry( 10, 10, 10 );

    for (var i = 0; i < 10; i++) {
        const material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
		const sphere = new THREE.Mesh( geometry, material );

		sphere.position.x = Math.random() * 100 - 50;
		sphere.position.y = Math.random() * 60 - 30;
		sphere.position.z = Math.random() * 80 - 40;

		sphere.castShadow = true;
		sphere.receiveShadow = true;

		scene.add( sphere );

		objects.push( sphere );
	}
}

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

init(); // call to create all spheres

function animate() {
    // add per object motion from objects list
    objects[0].rotation.x += 0.01;
    objects[0].rotation.y += 0.01;

    // render scene change in every frame 
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
