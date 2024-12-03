import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

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

// // add cube ex.
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// put lights and balls into scene to render
function init() {
    scene.add( new THREE.AmbientLight( 0x0f0f0f ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
    scene.add(light);

    // add 10 balls of same size, but random color and location to scene
    // randomness reference: https://github.com/learnthreejs/three-js-boilerplate/blob/example-dragcontrols-finish/public/examples/draggable-objects-dragcontrols/scripts.js 
	const geometry = new THREE.SphereGeometry( 10, 10, 10 ); // move into loop later for random size as well
    for (var i = 0; i < 10; i++) {
        const material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
		const sphere = new THREE.Mesh( geometry, material );

		sphere.position.x = Math.random() * 100 - 50;
		sphere.position.y = Math.random() * 60 - 30;
		sphere.position.z = Math.random() * 80 - 40;

		sphere.castShadow = true;
		sphere.receiveShadow = true;

		scene.add( sphere ); // add to scene to render
		objects.push( sphere ); // store for drag n drop
	}

    // add drag controls for all balls
    const controls = new DragControls( objects, camera, renderer.domElement );
    // controls.deactivate(); // turn off drag

    // add event listerners for hovering over, expanding the object user is about to interact with
    controls.addEventListener( 'hoveron', function(event){
        console.log(event.object);
        event.object.scale.x *= 1.2; // expand it
        event.object.scale.y *= 1.2;
        event.object.scale.z *= 1.2;
    } );
    // return object to normal once drag is done 
    controls.addEventListener( 'dragend', function(event){
        event.object.scale.x /= 1.2; // expand it
        event.object.scale.y /= 1.2;
        event.object.scale.z /= 1.2;
    } );
    // by this design, balls will expand when only hover and no drag, and shrink when only click on it\
    // later can change bouncy characteristics w difference sizes
}

init(); // call to create all spheres

function animate() {
    // add per object motion from objects list
    objects[0].rotation.x += 0.01;
    objects[0].rotation.y += 0.01;

    // render scene change in every frame 
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
