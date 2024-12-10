import * as THREE from 'three';

export class Physics {
    handleCollisions(balls) {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const a1 = balls[i];
                const a2 = balls[j];
                
                const diff = new THREE.Vector3().subVectors(a2.body.position, a1.body.position);
                const dist = diff.length();
                const minDist = a1.radius + a2.radius;
                
                if (dist < minDist) {
                    // Normalize the difference vector
                    const normal = diff.normalize();
                    
                    // Move balls apart
                    const overlap = minDist - dist;
                    const totalMass = a1.mass + a2.mass;
                    const moveRatio1 = a2.mass / totalMass;
                    const moveRatio2 = a1.mass / totalMass;
                    
                    a1.body.position.sub(normal.clone().multiplyScalar(overlap * moveRatio1));
                    a2.body.position.add(normal.clone().multiplyScalar(overlap * moveRatio2));
                    
                    // Enhanced collision response
                    const relativeVel = new THREE.Vector3().subVectors(a2.velocity, a1.velocity);
                    const velAlongNormal = relativeVel.dot(normal);
                    
                    if (velAlongNormal > 0) continue;
                    
                    const bounciness = Math.min(a1.bounciness, a2.bounciness);
                    const j = -(1 + bounciness) * velAlongNormal;
                    const impulse = j / totalMass;
                    
                    // Add some random spin on collision
                    a1.body.rotation.y += (Math.random() - 0.5) * 0.3;
                    a2.body.rotation.y += (Math.random() - 0.5) * 0.3;
                    
                    // Apply impulse
                    const impulseVec = normal.multiplyScalar(impulse);
                    a1.velocity.sub(impulseVec.clone().multiplyScalar(a2.mass));
                    a2.velocity.add(impulseVec.clone().multiplyScalar(a1.mass));
                    
                    // Add some random horizontal movement on collision
                    const randomForce = new THREE.Vector3(
                        (Math.random() - 0.5) * 0.5,
                        0,
                        (Math.random() - 0.5) * 0.5
                    );
                    a1.velocity.add(randomForce);
                    a2.velocity.sub(randomForce);
                }
            }
        }
    }
}