export function addLighting(scene) {
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, -2, -5);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    
    // Ambient light for better overall visibility
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}


export function addFloor(scene) {
    const geometry = new THREE.BoxGeometry(50, 1, 50);
    const material = new THREE.MeshStandardMaterial({
        color: 0xDDDDDD,
        roughness: 0.5, // Added some roughness for more realistic appearance
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.position.set(0, -10, 0);
    floor.name = 'my-floor';
    scene.add(floor);
}


export function addSphere(scene) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        roughness: 0.2, // Slight roughness for better light interaction
        metalness: 0.1
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 5, 0); // Starting position
    sphere.name = 'my-sphere';
    scene.add(sphere);
}


