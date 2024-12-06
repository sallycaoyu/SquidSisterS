import { Scene } from './scene.js';
import { Ball, Ground } from './object.js';
import { DirectionalLight, SpotLight } from './light.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

console.log('Initializing scene...');
const { scene, camera, renderer, cameraControl } = new Scene();
const ground = new Ground(scene);
const directionalLight = new DirectionalLight(scene);
const spotLight = new SpotLight(scene);

// create balls
console.log('Creating balls...');
const ballList = [];
const ballDragList = [];
for (let i = 0; i < 10; i++) {
    const ballname = `ball-${i}`;
    const ballObject = new Ball(scene, ballname);
    const ball = scene.getObjectByName(ballname);
    if (ball) {
        ballList.push(ballObject);
        ballDragList.push(ballObject.ball); 
        console.log(`Created ball: ${ballname}`);
    } else {
        console.error(`Failed to create ball: ${ballname}`);
    }
}

// add drag drop control to all balls
// const controls = new DragControls( ballList, camera, renderer.domElement );
// // controls.deactivate(); // turn off drag

// // add event listerners for hovering over, expanding the object user is about to interact with
// controls.addEventListener( 'hoveron', function(event){
//     console.log(event.object);
//     event.object.scale.x *= 1.2; // expand it
//     event.object.scale.y *= 1.2;
//     event.object.scale.z *= 1.2;
// } );
// // return object to normal once drag is done 
// controls.addEventListener( 'dragend', function(event){
//     event.object.scale.x /= 1.2; // expand it
//     event.object.scale.y /= 1.2;
//     event.object.scale.z /= 1.2;
// } );
// // by this design, balls will expand when only hover and no drag, and shrink when only click on it\
// // later can change bouncy characteristics w difference sizes

// deactivate orbit control version
// camera.controls.deactivate();
const dragControls = new DragControls(ballDragList, camera, renderer.domElement);

// Disable OrbitControls while dragging
dragControls.addEventListener( 'hoveron', function(event) {
    event.object.scale.x *= 1.2; // expand it
    event.object.scale.y *= 1.2;
    // if (event.object.position.y - (event.object.scale.y / 2) < ground.position.y) {
    //     event.object.position.y = ground.position.y + (event.object.scale.y / 2);
    // }
    event.object.scale.z *= 1.2;
    cameraControl.enabled = false; // Disable OrbitControls
});

dragControls.addEventListener( 'hoveroff', function(event) {
    cameraControl.enabled = true; // Disable OrbitControls
});

dragControls.addEventListener( 'dragend', function(event){
    event.object.scale.x /= 1.2; // return the size
    event.object.scale.y /= 1.2;
    // if (event.object.position.y - (event.object.scale.y / 2) < ground.position.y) {
    //     event.object.position.y = ground.position.y + (event.object.scale.y / 2);
    // }
    event.object.scale.z /= 1.2;
    cameraControl.enabled = true; // Re-enable OrbitControls
});

// Animation loop
console.log('Starting animation loop...');
const animate = () => {
    requestAnimationFrame(animate);
    for (const ball of ballList) {
        ball.move(ball);
    }
    // Render scene
    renderer.render(scene, camera);
};

animate();
console.log('Animation loop started.');

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// // Scene setup same as before...
// const scene = new THREE.Scene();
// const canvas = document.querySelector("#canvas");
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 20, 30);
// camera.lookAt(0, 0, 0);

// const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;

// const controls = new OrbitControls(camera, canvas);

// // Lighting setup same as before...
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(10, 20, 10);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// // Floor setup same as before...
// const floorGeometry = new THREE.BoxGeometry(50, 2, 50);
// const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.position.y = -1;
// floor.receiveShadow = true;
// scene.add(floor);

// class Animal {
//     constructor(color, size, x, y, z) {
//         // Body and eyes setup same as before...
//         const bodyGeo = new THREE.SphereGeometry(size, 32, 32);
//         const bodyMat = new THREE.MeshPhongMaterial({ color });
//         this.body = new THREE.Mesh(bodyGeo, bodyMat);
//         this.body.position.set(x, y, z);
//         this.body.castShadow = true;
        
//         // Eyes setup
//         const eyeGeo = new THREE.SphereGeometry(size * 0.2, 16, 16);
//         const eyeMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
//         const pupilGeo = new THREE.SphereGeometry(size * 0.1, 16, 16);
//         const pupilMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
//         this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
//         this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
//         this.leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
//         this.rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
        
//         this.leftEye.position.set(-size * 0.4, size * 0.2, size * 0.8);
//         this.rightEye.position.set(size * 0.4, size * 0.2, size * 0.8);
//         this.leftPupil.position.set(-size * 0.4, size * 0.2, size * 0.9);
//         this.rightPupil.position.set(size * 0.4, size * 0.2, size * 0.9);
        
//         this.body.add(this.leftEye);
//         this.body.add(this.rightEye);
//         this.body.add(this.leftPupil);
//         this.body.add(this.rightPupil);
        
//         scene.add(this.body);
        
//         // Enhanced physics properties
//         this.velocity = new THREE.Vector3(
//             (Math.random() - 0.5) * 2,  // Increased initial velocity
//             Math.random() * 5,          // More upward initial velocity
//             (Math.random() - 0.5) * 2
//         );
//         this.radius = size;
//         this.mass = size * size * size;  // Mass proportional to volume
//         this.restitution = 0.8;         // Bounciness factor
//     }
    
//     update(gravity, deltaTime) {
//         // Apply gravity
//         this.velocity.y -= gravity * deltaTime;
        
//         // Update position
//         this.body.position.x += this.velocity.x * deltaTime;
//         this.body.position.y += this.velocity.y * deltaTime;
//         this.body.position.z += this.velocity.z * deltaTime;
        
//         // Enhanced floor bounce
//         if (this.body.position.y - this.radius < 0) {
//             this.body.position.y = this.radius;
//             this.velocity.y = -this.velocity.y * this.restitution;
            
//             // Add random spin on bounce
//             this.body.rotation.x += (Math.random() - 0.5) * 0.2;
//             this.body.rotation.z += (Math.random() - 0.5) * 0.2;
            
//             // Add random horizontal movement
//             this.velocity.x += (Math.random() - 0.5) * 2;
//             this.velocity.z += (Math.random() - 0.5) * 2;
//         }
        
//         // Enhanced wall bounds
//         const bounds = 20;
//         if (Math.abs(this.body.position.x) > bounds) {
//             this.velocity.x *= -this.restitution;
//             this.body.position.x = Math.sign(this.body.position.x) * bounds;
//         }
//         if (Math.abs(this.body.position.z) > bounds) {
//             this.velocity.z *= -this.restitution;
//             this.body.position.z = Math.sign(this.body.position.z) * bounds;
//         }
        
//         // Enhanced squash and stretch
//         const verticalStretch = 1 + this.velocity.y * 0.05;
//         const horizontalSquash = 1 / Math.sqrt(Math.abs(verticalStretch));
//         this.body.scale.set(horizontalSquash, verticalStretch, horizontalSquash);
//     }
// }

// // Create more animals with varying sizes
// const animals = [];
// const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFBAED2];
// for (let i = 0; i < 15; i++) {  // Increased number of animals
//     const size = 0.8 + Math.random() * 1.2;  // More size variation
//     const animal = new Animal(
//         colors[i % colors.length],
//         size,
//         (Math.random() - 0.5) * 15,
//         5 + i * 2,
//         (Math.random() - 0.5) * 15
//     );
//     animals.push(animal);
// }

// // Enhanced collision handling
// function handleCollisions() {
//     for (let i = 0; i < animals.length; i++) {
//         for (let j = i + 1; j < animals.length; j++) {
//             const a1 = animals[i];
//             const a2 = animals[j];
            
//             const diff = new THREE.Vector3().subVectors(a2.body.position, a1.body.position);
//             const dist = diff.length();
//             const minDist = a1.radius + a2.radius;
            
//             if (dist < minDist) {
//                 // Normalize the difference vector
//                 const normal = diff.normalize();
                
//                 // Move animals apart
//                 const overlap = minDist - dist;
//                 const totalMass = a1.mass + a2.mass;
//                 const moveRatio1 = a2.mass / totalMass;
//                 const moveRatio2 = a1.mass / totalMass;
                
//                 a1.body.position.sub(normal.clone().multiplyScalar(overlap * moveRatio1));
//                 a2.body.position.add(normal.clone().multiplyScalar(overlap * moveRatio2));
                
//                 // Enhanced collision response
//                 const relativeVel = new THREE.Vector3().subVectors(a2.velocity, a1.velocity);
//                 const velAlongNormal = relativeVel.dot(normal);
                
//                 if (velAlongNormal > 0) continue;
                
//                 const restitution = Math.min(a1.restitution, a2.restitution);
//                 const j = -(1 + restitution) * velAlongNormal;
//                 const impulse = j / totalMass;
                
//                 // Add some random spin on collision
//                 a1.body.rotation.y += (Math.random() - 0.5) * 0.3;
//                 a2.body.rotation.y += (Math.random() - 0.5) * 0.3;
                
//                 // Apply impulse
//                 const impulseVec = normal.multiplyScalar(impulse);
//                 a1.velocity.sub(impulseVec.clone().multiplyScalar(a2.mass));
//                 a2.velocity.add(impulseVec.clone().multiplyScalar(a1.mass));
                
//                 // Add some random horizontal movement on collision
//                 const randomForce = new THREE.Vector3(
//                     (Math.random() - 0.5) * 0.5,
//                     0,
//                     (Math.random() - 0.5) * 0.5
//                 );
//                 a1.velocity.add(randomForce);
//                 a2.velocity.sub(randomForce);
//             }
//         }
//     }
// }

// // Animation loop
// const clock = new THREE.Clock();

// function animate() {
//     requestAnimationFrame(animate);
    
//     const deltaTime = Math.min(clock.getDelta(), 0.1);  // Cap deltaTime to prevent large jumps
//     const gravity = 15;  // Increased gravity for more dynamic movement
    
//     animals.forEach(animal => animal.update(gravity, deltaTime));
//     handleCollisions();
    
//     renderer.render(scene, camera);
// }

// // Handle window resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// animate();