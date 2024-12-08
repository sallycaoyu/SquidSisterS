import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water2.js';
import { Noise } from 'noisejs';

export class Ball {
    constructor(scene, ballname, ballDragList) {
        this.timeStep = 0.25;
        this.gravity = 9.8;
        this.bounciness = 0.8;
        this.floorY = -10;
        this.minRadius = 8;
        this.maxRadius = 20;
        this.radius = Math.max(this.minRadius, Math.random() * this.maxRadius);
        this.maxStretch = 2.0;
        this.minSquash = 0.5;
        this.maxVelocity = 1.5;


        // this.velocity = new THREE.Vector3(
        //     (this.radius - 0.5) * 2,  // Increased initial velocity
        //     this.radius * 5,          // More upward initial velocity
        //     (this.radius - 0.5) * 2
        // );

        const velocity = this.maxVelocity * (1 - (this.radius - this.minRadius) / (this.maxRadius - this.minRadius));
        this.velocity = new THREE.Vector3(
            velocity,
            1.2 * velocity,
            velocity
        );
        this.mass = this.radius * this.radius * this.radius;  // Mass proportional to volume

        const bodyGeometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.2, // Slight roughness for better light interaction
            metalness: 0.1
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.name = ballname;
        ballDragList.push(this.body);

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
        this.body.position.copy(position);

        this.body.castShadow = true;
        this.body.receiveShadow = true;


        // Eyes setup
        const eyeGeo = new THREE.SphereGeometry(this.radius * 0.2, 16, 16);
        const eyeMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const pupilGeo = new THREE.SphereGeometry(this.radius * 0.1, 16, 16);
        const pupilMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        this.leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
        this.rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
        
        this.leftEye.position.set(-this.radius * 0.4, this.radius * 0.2, this.radius * 0.8);
        this.rightEye.position.set(this.radius * 0.4, this.radius * 0.2, this.radius * 0.8);
        this.leftPupil.position.set(-this.radius * 0.4, this.radius * 0.2, this.radius * 0.9);
        this.rightPupil.position.set(this.radius * 0.4, this.radius * 0.2, this.radius * 0.9);
        
        this.body.add(this.leftEye);
        this.body.add(this.rightEye);
        this.body.add(this.leftPupil);
        this.body.add(this.rightPupil);

        scene.add(this.body);
    }


    update() {
        const minWaterX = -250;
        const maxWaterX = 50;

         // Apply gravity
        this.velocity.y -= this.gravity * this.timeStep;
        
        // Update position
        this.body.position.x += this.velocity.x * this.timeStep;
        this.body.position.y += this.velocity.y * this.timeStep;
        this.body.position.z += this.velocity.z * this.timeStep;
        
        // Enhanced floor bounce
        if (this.body.position.y - this.radius < this.floorY) {
            this.body.position.y = this.floorY + this.radius;
            this.velocity.y = -this.velocity.y * this.bounciness;
            
            // Add random spin on bounce
            this.body.rotation.x += (Math.random() - 0.5) * 0.2;
            this.body.rotation.z += (Math.random() - 0.5) * 0.2;
            
            // Add random horizontal movement
            this.velocity.x += (Math.random() - 0.5) * 2;
            this.velocity.z += (Math.random() - 0.5) * 2;
        }
        if (this.body.position.x > maxWaterX && this.body.position.x < 500) {
            this.velocity.x *= 0.8;
            this.velocity.y *= 0.8;
            this.velocity.z *= 0.8;
        }


        // Enhanced wall bounds
        const bounds = 200;
        if (Math.abs(this.body.position.x) > bounds) {
            this.velocity.x *= -this.bounciness;
            this.body.position.x = Math.sign(this.body.position.x) * bounds;
        }
        if (Math.abs(this.body.position.z) > bounds) {
            this.velocity.z *= -this.bounciness;
            this.body.position.z = Math.sign(this.body.position.z) * bounds;
        }
        
        // Enhanced squash and stretch
        const verticalStretch = Math.min(this.maxStretch, 1 + this.velocity.y * 0.001);
        const horizontalSquash = Math.max(this.minSquash, 1 / Math.sqrt(Math.abs(verticalStretch)));
        this.body.scale.set(horizontalSquash, verticalStretch, horizontalSquash);
    }
}


export class Ground {
    // p = new Array(512);
    
    constructor(scene) {
        this.width = 10000;
        this.height = 1;
        this.depth = 10000;

        // attributes for terrain generation
        this.octaves = 4; // num of noise layers
        this.baseFreq = 0.02; // base frequency
        this.persistence = 0.5; // how much each octave contributes to overall shape
        this.lacunarity = 2; // how much the frequency increases with each octave
        this.baseAmp = 10; // base amplitude

        // ground (three.js example https://github.com/mrdoob/three.js/blob/master/examples/webgl_water.html) 
        const groundGeometry = new THREE.PlaneGeometry( 500, 500, 10, 10 );
        const groundMaterial = new THREE.MeshStandardMaterial( { roughness: 0.8, metalness: 0.4 } );
        const ground = new THREE.Mesh( groundGeometry, groundMaterial );

        // // Modify vertices to create the slope
        // const positions = groundGeometry.attributes.position;
        // for (let i = 0; i < positions.count; i++) {
        //     const x = positions.getX(i);
        //     const y = positions.getY(i);
            
        //     // Create a slope based on x position
        //     // Adjust these values to control the shelf angle
        //     const slope = 0.15; // Controls how steep the shelf is
        //     const offset = -5;  // Starting depth
            
        //     // Calculate z position (depth) based on x position
        //     let z = x * slope + offset;
            
        //     // Optional: Add some variation to make it more natural
        //     const variation = Math.sin(x * 0.05) * 2;
        //     z += variation;
            
        //     positions.setZ(i, z);
        // }

        // positions.needsUpdate = true;
        groundGeometry.computeVertexNormals();

        ground.rotation.x = Math.PI * - 0.5; // turn it to horizontal plane
        ground.position.set(0, -20, 0);
        scene.add( ground );


        //load beach texture onto ground
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load( 'src/textures/beach_1.png', function ( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 16;
            map.repeat.set( 1, 1 ); // one time full image
            map.colorSpace = THREE.SRGBColorSpace;
            groundMaterial.map = map;
            groundMaterial.needsUpdate = true;
        } );
        


        // add water refraction
        let water; 
        const waterGeometry = new THREE.PlaneGeometry( 300, 500 );
        const watertextureLoader = new THREE.TextureLoader();
        const waterNormalMap = watertextureLoader.load('src/textures/Water_2_M_Normal.jpg', function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        });
        water = new Water( waterGeometry, {
            color: '#ffffff',
            scale: 4,
            flowDirection: new THREE.Vector2( 1, 0 ), // green red flow direction, along x-axis
            textureWidth: 1024,
            textureHeight: 1024,
            normalMap0: waterNormalMap, // Add normal map for ripples
            normalMap1: waterNormalMap,
        } );
        // water.position.y = 1;
        water.rotation.x = Math.PI * - 0.5; // rotate to horizontal
        water.position.x = -100;
        scene.add( water );



        // Add skybox (environment map) for water to not reflect black
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( 'src/textures/sky/' ); // include src/ or else wont show
        const cubeTexture = cubeTextureLoader.load( [
            'negx.png', 'posx.png',
            'posy.png', 'negy.png',
            'posz.png', 'negz.png'
        ] );
        scene.background = cubeTexture;

        // light for box ?
        const ambientLightForBox = new THREE.AmbientLight( 0xe7e7e7, 1.2 );
        scene.add( ambientLightForBox );

        const directionalLightForBox = new THREE.DirectionalLight( 0xffffff, 2 );
        directionalLightForBox.position.set( - 1, 1, 1 );
        scene.add( directionalLightForBox );
        



        // sand terrain part starts here
        const sandGeometry = new THREE.PlaneGeometry( 250, 500, 256, 256 );
        const sandMaterial = new THREE.MeshStandardMaterial( { roughness: 0.8, metalness: 0.1, color: '#c2b280', side: THREE.DoubleSide} );
        const sand = new THREE.Mesh( sandGeometry, sandMaterial );

        this.generateTerrain(sandGeometry);

        sand.rotation.x = Math.PI * - 0.5; // turn the sand to horizontal plane
        sand.position.x = 150; // move it to the right of the water
        scene.add(sand);


        const directionalLightForSand = new THREE.DirectionalLight(0xffffff, 1);
        directionalLightForSand.position.set(1, 1, 1);
        scene.add(directionalLightForSand);

        // Add some ambient light to soften shadows
        const ambientLightForSand = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLightForSand);

        // Add box helper to visualize the sand plane
        const helper = new THREE.BoxHelper(sand, 0xff0000);
        scene.add(helper);

        const axesHelper = new THREE.AxesHelper(100); // Size 100
        scene.add(axesHelper);
    }

    generateTerrain(sandGeometry) {
        const positions = sandGeometry.attributes.position;

        let noise = new Noise();
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            
            let elevation = 0;
            let amp = this.baseAmp;
            let freq = this.baseFreq;
            
            // Accumulate noise from multiple octaves
            for (let o = 0; o < this.octaves; o++) {
                const noiseValue = noise.simplex2(x * freq, y * freq);
                elevation += noiseValue * amp;
                
                amp *= this.persistence;    // Amplitude decreases with each octave
                freq *= this.lacunarity;     // Frequency increases with each octave
            }

            // smooth the height for where the sand meets the water
            const distanceFromWater = 150 + x; // Adjust this value based on your water position
            const transitionZone = 100; // Width of the transition zone
            let heightMultiplier = 1;

            if (distanceFromWater < transitionZone) {
                // Smooth transition from 0 to 1
                heightMultiplier = Math.max(0, distanceFromWater / transitionZone);
                // Optional: use smoother transition with sine
                heightMultiplier = Math.sin((heightMultiplier * Math.PI) / 2);
            }
            
            // Apply the height multiplier
            elevation *= heightMultiplier;
            
            // horizontal plane rotated by 90 degrees, so z is the height
            positions.setZ(i, elevation);
        }
        
        positions.needsUpdate = true;
        sandGeometry.computeVertexNormals();
    }    
}