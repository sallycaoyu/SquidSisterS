import * as THREE from 'three';

export class Ball {
    
    constructor(scene, ballname) {
        this.timeStep = 0.25;
        this.gravity = 9.8;
        this.restitution = 0.9;
        this.floorY = -5;
        
        this.velocity = 0;

        const geometry = new THREE.SphereGeometry(10, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.2, // Slight roughness for better light interaction
            metalness: 0.1
        });
        this.ball = new THREE.Mesh(geometry, material);
        this.ball.name = ballname;

        let position;
        let isPositionValid = false;
        while (!isPositionValid) {
            position = new THREE.Vector3(
                Math.random() * 100 - 50,
                Math.random() * 200 - 30,
                Math.random() * 80 - 40
            );
            isPositionValid = true;
            for (const obj of scene.children) {
                if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry) {
                    const distance = position.distanceTo(obj.position);
                    if (distance < 40) { // Ensure a minimum distance of 10 units
                        isPositionValid = false;
                        break;
                    }
                }
            }
        }
        this.ball.position.copy(position);

        this.ball.castShadow = true;
        this.ball.receiveShadow = true;

        scene.add(this.ball);
    }

    move() {
        this.velocity -= this.gravity * this.timeStep;
        let yPosition = this.ball.position.y;
        yPosition += this.velocity * this.timeStep;
        
        if (yPosition < this.floorY) {
            yPosition = this.floorY;
            this.velocity = -this.velocity * this.restitution;
            
            // if (Math.abs(this.velocity) < 0.1) {
            //     this.velocity = 0;
            //     yPosition = this.floorY;
            // }
        }
        
        this.ball.position.y = yPosition;
    }
}

export class Ground {
    constructor(scene) {
        // const geometry = new THREE.BoxGeometry(500, 1, 500);
        // const material = new THREE.MeshStandardMaterial({
        //     color: 0xDDDDDD,
        //     roughness: 0.5, // Added some roughness for more realistic appearance
        // });
        // this.ground = new THREE.Mesh(geometry, material);
        // this.ground.position.set(0, -10, 0);
        // this.ground.name = 'ground';
        // scene.add(this.ground);

        // ground from three.js example
        const groundGeometry = new THREE.PlaneGeometry( 250, 250, 10, 10 );
        const groundMaterial = new THREE.MeshBasicMaterial( { color: 0xFFC0CB } );
        const ground = new THREE.Mesh( groundGeometry, groundMaterial );
        ground.rotation.x = Math.PI * - 0.5;
        ground.position.set(0, -10, 0);
        scene.add( ground );

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load( 'src/textures/beach_1.png', function ( map ) {

            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 16;
            map.repeat.set( 1, 1 );
            map.colorSpace = THREE.SRGBColorSpace;
            groundMaterial.map = map;
            groundMaterial.needsUpdate = true;

        } );
    }
}