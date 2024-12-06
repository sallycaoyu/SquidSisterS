import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { Water } from 'three/addons/objects/Water2.js';
import Stats from 'three/addons/libs/stats.module.js';

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



        // sand terrain part starts here
        const worldWidth = 500, worldDepth = 500;
        const data = this.generateHeight( worldWidth, worldDepth );

        const geometry = new THREE.PlaneGeometry( 200, 500, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );

        const vertices = geometry.attributes.position.array;

        for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            vertices[ j + 1 ] = data[ i ] * 2;

        }

        this.texture = new THREE.CanvasTexture( this.generateTexture( data, worldWidth, worldDepth ) );
        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
        this.texture.colorSpace = THREE.SRGBColorSpace;

        this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: this.texture } ) );
        this.mesh.position.set(150, 0, 0);
        scene.add( this.mesh );
    }


    generateHeight( width, height ) {
        const size = width * height, data = new Uint8Array( size ),
            perlin = new ImprovedNoise(), z = Math.random() * 1;

        let quality = 1;

        for ( let j = 0; j < 4; j ++ ) {

            for ( let i = 0; i < size; i ++ ) {

                const x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 0.5 );

            }

            quality *= 2;

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

        // // Scaled 4x

        // const canvasScaled = document.createElement( 'canvas' );
        // canvasScaled.width = width * 4;
        // canvasScaled.height = height * 4;

        // context = canvasScaled.getContext( '2d' );
        // context.scale( 4, 4 );
        // context.drawImage( canvas, 0, 0 );

        // image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        // imageData = image.data;

        // for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

        //     const v = ~ ~ ( Math.random() * 5 );

        //     imageData[ i ] += v;
        //     imageData[ i + 1 ] += v;
        //     imageData[ i + 2 ] += v;

        // }

        // context.putImageData( image, 0, 0 );

        return canvas;

    }
    
}