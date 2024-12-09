import { Scene } from './scene.js';
import { Ball, Ground, Squid } from './object.js';
import { DirectionalLight, SpotLight } from './light.js';
import { Physics } from './physics.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

console.log('Initializing scene...');
const { scene, camera, renderer, cameraControl } = new Scene();
const ground = new Ground(scene);
const directionalLight = new DirectionalLight(scene);
const spotLight = new SpotLight(scene);
const physics = new Physics();

// create balls
console.log('Creating balls...');
const ballList = [];
const ballDragList = [];

async function createAnimals() {
    for (let i = 0; i < 9; i++) {
        const ballname = `ball-${i}`;
        const ballObject = new Ball(scene, ballname, ballDragList);
        const ball = scene.getObjectByName(ballname);
        if (ball) {
            ballList.push(ballObject);
            //ballDragList.push(ballObject.body); 
            console.log(`Created ball: ${ballname}`);
        } else {
            console.error(`Failed to create ball: ${ballname}`);
        }
    }

    const squidname = 'squid';
    const squidObject = await new Squid(scene, squidname, ballDragList);
    const squid = scene.getObjectByName(squidname);
    if (squid) {
        ballList.push(squidObject);
        //ballDragList.push(squidObject.body);
        console.log(`Created squid: ${squidname}`);
    } else {
        console.error(`Failed to create squid: ${squidname}`);
    }
}

createAnimals();


const dragControls = new DragControls(ballDragList, camera, renderer.domElement);

// Disable OrbitControls while dragging
dragControls.addEventListener( 'hoveron', function(event) {
    // event.object.scale.x *= 1.2; // expand it
    // event.object.scale.y *= 1.2;
    // event.object.scale.z *= 1.2;
    cameraControl.enabled = false; // Disable OrbitControls
});

dragControls.addEventListener( 'hoveroff', function(event) {
    cameraControl.enabled = true; // Enable OrbitControls
});

dragControls.addEventListener( 'drag', function(event){
    cameraControl.enabled = false; // Disable OrbitControls
});

dragControls.addEventListener( 'dragend', function(event){
    // event.object.scale.x /= 1.2; // return the size
    // event.object.scale.y /= 1.2;
    // event.object.scale.z /= 1.2;
    cameraControl.enabled = true; // Re-enable OrbitControls
});

// Animation loop
console.log('Starting animation loop...');
const animate = () => {
    requestAnimationFrame(animate);
    for (const ball of ballList) {
        ball.update(ball);
    }
    physics.handleCollisions(ballList);
    // Render scene
    renderer.render(scene, camera);
};

animate();
console.log('Animation loop started.');

