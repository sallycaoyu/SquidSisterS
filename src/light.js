import * as THREE from 'three';

export class DirectionalLight {
    constructor(scene) {
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 10, 0);
        directionalLight.target.position.set(-5, -2, -5);
        scene.add(directionalLight);
        scene.add(directionalLight.target);
        
        // Ambient light for better overall visibility
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
    }
}

export class SpotLight {
    constructor(scene) {
        var light = new THREE.SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 500, 2000 );
        scene.add(light);
    }
}