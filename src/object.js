import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

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
    p = new Array(512);
    
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

        // ground from three.js example
        const groundGeometry = new THREE.PlaneGeometry( 500, 500, 10, 10 );
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


        const worldWidth = 256, worldDepth = 256;

        const data = this.generateHeight( worldWidth, worldDepth );
        
        const geometry = new THREE.PlaneGeometry( 500, 500, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );

        const vertices = geometry.attributes.position.array;

        for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            vertices[ j + 1 ] = data[ i ] * 10;

        }

        //

        texture = new THREE.CanvasTexture( this.generateTexture( data, worldWidth, worldDepth ) );
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        scene.add( mesh );

        const geometryHelper = new THREE.ConeGeometry( 20, 100, 3 );
        geometryHelper.translate( 0, 50, 0 );
        geometryHelper.rotateX( Math.PI / 2 );
        helper = new THREE.Mesh( geometryHelper, new THREE.MeshNormalMaterial() );
        scene.add( helper );
    }

    generateHeight( width, height ) {

        const size = width * height, data = new Uint8Array( size ),
            perlin = new ImprovedNoise(), z = Math.random() * 100;

        let quality = 1;

        for ( let j = 0; j < 4; j ++ ) {

            for ( let i = 0; i < size; i ++ ) {

                const x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

            }

            quality *= 5;

        }

        return data;

    }

    generateTexture( data, width, height ) {

        // bake lighting into texture

        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3( 0, 0, 0 );

        const sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();

        const canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;

        for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

            vector3.x = data[ j - 2 ] - data[ j + 2 ];
            vector3.y = 2;
            vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
            vector3.normalize();

            shade = vector3.dot( sun );

            imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

        }

        context.putImageData( image, 0, 0 );

        // Scaled 4x

        const canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );

        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;

        for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

            const v = ~ ~ ( Math.random() * 5 );

            imageData[ i ] += v;
            imageData[ i + 1 ] += v;
            imageData[ i + 2 ] += v;

        }

        context.putImageData( image, 0, 0 );

        return canvasScaled;

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


// export class Beach {
//     constructor(scene) {
//         // Create ground geometry with high detail
//         const width = 500;
//         const height = 500;
//         const segments = 150;
//         const geometry = new THREE.PlaneGeometry(width, height, segments, segments);

//         // Get vertices for noise application
//         const vertices = geometry.attributes.position.array;

//         // Create sand dunes with Perlin noise
//         for (let i = 0; i < vertices.length; i += 3) {
//             const x = vertices[i];
//             const z = vertices[i + 2];

//             // Layer different frequencies of noise for natural look
//             let elevation = 
//                 this.noise(x * 0.002, z * 0.002) * 15 +    // Large dunes
//                 this.noise(x * 0.01, z * 0.01) * 2 +       // Medium details
//                 this.noise(x * 0.03, z * 0.03) * 0.5;      // Small ripples

//             // Create a slope towards the water
//             const distanceFromCenter = Math.sqrt(x * x + z * z);
//             const beachSlope = Math.max(0, distanceFromCenter * 0.01);
//             elevation = Math.max(elevation - beachSlope, -2);

//             // Set the vertex height
//             vertices[i + 1] = elevation;
//         }

//         // Update normals for correct lighting
//         geometry.computeVertexNormals();

//         // Create sand material
//         const sandTexture = this.createSandTexture();
//         const material = new THREE.MeshPhongMaterial({
//             map: sandTexture,
//             color: 0xE6D5AC,       // Sand color
//             shininess: 0,          // Matt finish
//             bumpMap: sandTexture,  // Use same texture for bump
//             bumpScale: 0.2,        // Subtle bumps
//         });

//         this.mesh = new THREE.Mesh(geometry, material);
//         this.mesh.rotation.x = -Math.PI / 2;  // Rotate to be horizontal
//         this.mesh.receiveShadow = true;

//         scene.add(this.mesh);

//         // Add water plane
//         const waterGeometry = new THREE.PlaneGeometry(width, height);
//         const waterMaterial = new THREE.MeshPhongMaterial({
//             color: 0x0077BE,
//             transparent: true,
//             opacity: 0.8,
//             shininess: 100
//         });

//         this.water = new THREE.Mesh(waterGeometry, waterMaterial);
//         this.water.rotation.x = -Math.PI / 2;
//         this.water.position.y = -1;  // Slightly below beach level
//         scene.add(this.water);
//     }

//     // Improved Perlin noise function
//     noise(x, z) {
//         const X = Math.floor(x) & 255;
//         const Z = Math.floor(z) & 255;
//         x -= Math.floor(x);
//         z -= Math.floor(z);

//         // Fade function for smoother interpolation
//         const fade = t => t * t * t * (t * (t * 6 - 15) + 10);

//         const u = fade(x);
//         const v = fade(z);

//         // Get random values from permutation table
//         const perm = this.buildPermutationTable();
//         const A = perm[X] + Z;
//         const B = perm[(X + 1) & 255] + Z;

//         // Interpolate between gradient values
//         return this.lerp(
//             v,
//             this.lerp(
//                 u,
//                 this.grad(perm[A], x, z),
//                 this.grad(perm[B], x - 1, z)
//             ),
//             this.lerp(
//                 u,
//                 this.grad(perm[A + 1], x, z - 1),
//                 this.grad(perm[B + 1], x - 1, z - 1)
//             )
//         );
//     }

//     buildPermutationTable() {
//         const p = new Array(512);
//         for (let i = 0; i < 256; i++) p[i] = i;
        
//         // Shuffle array
//         for (let i = 255; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [p[i], p[j]] = [p[j], p[i]];
//         }
        
//         // Duplicate to avoid buffer overflow
//         for (let i = 0; i < 256; i++) p[256 + i] = p[i];
        
//         return p;
//     }

//     grad(hash, x, z) {
//         const h = hash & 15;
//         const grad = 1 + (h & 7);
//         return ((h & 8) ? -grad : grad) * x + ((h & 4) ? -grad : grad) * z;
//     }

//     lerp(t, a, b) {
//         return a + t * (b - a);
//     }

//     createSandTexture() {
//         const canvas = document.createElement('canvas');
//         canvas.width = 512;
//         canvas.height = 512;
//         const ctx = canvas.getContext('2d');

//         // Create sand texture with noise
//         for (let x = 0; x < canvas.width; x++) {
//             for (let y = 0; y < canvas.height; y++) {
//                 const value = (this.noise(x * 0.1, y * 0.1) + 1) * 0.5;
//                 const r = Math.floor(230 + value * 25);
//                 const g = Math.floor(213 + value * 25);
//                 const b = Math.floor(172 + value * 25);
//                 ctx.fillStyle = `rgb(${r},${g},${b})`;
//                 ctx.fillRect(x, y, 1, 1);
//             }
//         }

//         const texture = new THREE.CanvasTexture(canvas);
//         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//         texture.repeat.set(4, 4);
//         return texture;
//     }

//     update(time) {
//         // Animate water
//         if (this.water) {
//             this.water.position.y = -1 + Math.sin(time * 0.5) * 0.1;
//         }
//     }
// }