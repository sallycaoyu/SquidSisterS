import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water2.js';

export class Ball {
    constructor(scene, ballname) {
        this.timeStep = 0.25;
        this.gravity = 9.8;
        this.bounciness = 0.8;
        this.floorY = -10;
        this.radius = 20;
        this.maxStretch = 2.0;
        this.minSquash = 0.5;
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,  // Increased initial velocity
            Math.random() * 5,          // More upward initial velocity
            (Math.random() - 0.5) * 2
        );
        this.mass = this.radius * this.radius * this.radius;  // Mass proportional to volume

        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.2, // Slight roughness for better light interaction
            metalness: 0.1
        });
        this.body = new THREE.Mesh(geometry, material);
        this.body.name = ballname;

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

        scene.add(this.body);
    }


    update() {
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
        const verticalStretch = Math.min(this.maxStretch, 1 + this.velocity.y * 0.005);
        const horizontalSquash = Math.max(this.minSquash, 1 / Math.sqrt(Math.abs(verticalStretch)));
        this.body.scale.set(horizontalSquash, verticalStretch, horizontalSquash);
    }
}

// export class Ground {
//     constructor(scene) {
//         this.width = 500;
//         this.height = 1;
//         this.depth = 500;
//         const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
//         const material = new THREE.MeshStandardMaterial({
//             color: 0xDDDDDD,
//             roughness: 0.5, // Added some roughness for more realistic appearance
//         });
//         this.ground = new THREE.Mesh(geometry, material);
//         this.ground.position.set(0, -10, 0);
//         this.ground.name = 'ground';
//         scene.add(this.ground);
//     }
// }

export class Ground {
    // p = new Array(512);
    
    constructor(scene) {
        this.width = 500;
        this.height = 1;
        this.depth = 500;
        // const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        // const material = new THREE.MeshStandardMaterial({
        //     color: 0xDDDDDD,
        //     roughness: 0.5, // Added some roughness for more realistic appearance
        // });
        // this.ground = new THREE.Mesh(geometry, material);
        // this.ground.position.set(0, -10, 0);
        // this.ground.name = 'ground';
        // scene.add(this.ground);

        // ground (three.js example https://github.com/mrdoob/three.js/blob/master/examples/webgl_water.html) 
        const groundGeometry = new THREE.PlaneGeometry( 500, 500, 10, 10 );
        const groundMaterial = new THREE.MeshStandardMaterial( { roughness: 0.8, metalness: 0.4 } );
        const ground = new THREE.Mesh( groundGeometry, groundMaterial );
        ground.rotation.x = Math.PI * - 0.5; // turn it to horizontal plane
        ground.position.set(0, -5, 0);
        scene.add( ground );
        // load beach texture onto ground
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

        // Add environment map for water to not reflect black
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( 'src/textures/bridge/' ); // include src/ or else wont show
        const cubeTexture = cubeTextureLoader.load( [
            'posx.jpg', 'negx.jpg',
            'posy.jpg', 'negy.jpg',
            'posz.jpg', 'negz.jpg'
        ] );
        scene.background = cubeTexture;

        // light for box ?
        const ambientLight = new THREE.AmbientLight( 0xe7e7e7, 1.2 );
        scene.add( ambientLight );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
        directionalLight.position.set( - 1, 1, 1 );
        scene.add( directionalLight );
    }
    
    // Perlin noise implementation
    perlinNoise(x, z) {
        // Simple 2D Perlin noise approximation
        const X = Math.floor(x) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        z -= Math.floor(z);
        
        const u = this.fade(x);
        const v = this.fade(z);
        
        const A = this.p[X] + Z;
        const B = this.p[X + 1] + Z;
        
        return this.lerp(v,
            this.lerp(u, 
                this.grad(this.p[A], x, z),
                this.grad(this.p[B], x - 1, z)
            ),
            this.lerp(u,
                this.grad(this.p[A + 1], x, z - 1),
                this.grad(this.p[B + 1], x - 1, z - 1)
            )
        );
    }
    
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    grad(hash, x, z) {
        const h = hash & 15;
        const grad = 1 + (h & 7);
        return ((h & 8) ? -grad : grad) * x + ((h & 4) ? -grad : grad) * z;
    }
    
    
    createSandTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // Create sand-like texture
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                const value = (this.perlinNoise(x * 0.05, y * 0.05) + 1) * 0.5;
                const rgb = this.getSandColor(value);
                context.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                context.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }
    
    getSandColor(value) {
        // Sand color palette
        const baseColor = {
            r: 238,
            g: 214,
            b: 175
        };
        
        const darkColor = {
            r: 205,
            g: 183,
            b: 158
        };
        
        return {
            r: Math.floor(this.lerp(value, darkColor.r, baseColor.r)),
            g: Math.floor(this.lerp(value, darkColor.g, baseColor.g)),
            b: Math.floor(this.lerp(value, darkColor.b, baseColor.b))
        };
    }
}