import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Pink Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32); // Radius: 1, Segments: 32
const material = new THREE.MeshStandardMaterial({ color: 0xff69b4 }); // Pink color
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

