import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

export class Scene {
    constructor() {
        const scene = new THREE.Scene();
        const canvas = document.querySelector("#canvas");
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(50, 100, 200);
        camera.lookAt(0, 100, 0);
        const cameraControl = new OrbitControls(camera, canvas); // enable spin view w mouse
        cameraControl.maxPolarAngle = Math.PI / 2; // Limit to 90 degrees (horizontal)
        cameraControl.minPolarAngle = 0;           // Top view limit

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({canvas});
        // renderer.setSize(window.innerWidth, window.innerHeight);

        // renderer = new THREE.WebGLRenderer( { antialias: true } ); // creates new canvas object
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );
        // renderer.setAnimationLoop( animate );
        // document.body.appendChild( renderer.domElement ); // store the new canvas object 

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        return { scene, camera, renderer, cameraControl };
    }
}