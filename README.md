# SquidSisterS
Team SquidSisterS CSCI 1230 Final Project

# Project Design & Progress Document
https://drive.google.com/drive/folders/1N3q63yTQTsdUUh-hGtnXRI39yUzNc9ni?usp=sharing

# How To Use This Project
This project uses Three.js and Vite. 

1. Make sure you installed node.js (preferably v23.3.0) or npm before proceeding. Then, in your terminal:
2. Do `npm install --save three` to download three.js
3. Do `npm install --save-dev vite` to install vite
4. Do `npm install` to install the rest of packages and dependencies
5. Do `npm run build` to build the project.
6. Do `npm run dev` to run the project.
7. Open `http://localhost:5173/` in your browser to view the scene.

# Project Structure Tree
- index.html: entry of this project
- src/
    - textures/
        - sky/: skybox images
        - beach_1.png: beach texture map
        - Water_2_M_Normal.jpg: water flow normal map
    - model/
        - cute_squid/
            - scene.gltf: the GLTF 3D object model for grown squid
    - main.js: combine all js files and render the scene
    - object.js: classes of objects such as Ball (baby squid), Squid (grown squid), and Ground (sand, water, etc.)
    - physics.js: collision detection between objects
    - scene.js: initialize scene, camera, renderer, camera control, etc.


# Known Bugs
1. In drag drop control, when hold for long time not dropping, object’s position glitches only if it is held for too long and do not let it go.
2. When scaling up the imported grown squid model, its mouth is hidden.



# References
Sand texture links:
https://3dtextures.me/2020/06/25/stylized-sand-001/ 
https://drive.google.com/drive/folders/14H_wbBXseHvqRyFtcbQYUCvz1pEZyuTw
https://drive.google.com/drive/folders/1jjRaGQkBrWlq1RPZdVBJUYKgC-odESFg

Threejs examples used:
Refraction: https://threejs.org/examples/?q=water#webgpu_refraction
Terrain: https://threejs.org/examples/?q=terrain#webgpu_tsl_procedural_terrain

Tutorials:
Texture map: https://www.youtube.com/watch?v=VqpU7Sw8HNo&list=PLLbXxwyLM7dxZsD4f4hp5Gn7wLZWTLIwC&index=3
Water flow direction: https://www.youtube.com/watch?v=FT1O2G55yS8
Sand terrain perlin noise: https://cs1230.graphics/labs/lab7 
Past project demos: https://www.youtube.com/watch?v=PNFYw0nihWI&list=PLkVBa6TfkGPtcR3PquOqDJ5AYNnbUcJtC&index=1 
Bouncing ball: https://medium.com/geekculture/learning-three-js-1-how-to-create-a-bouncing-ball-5f423a629e59

Skybox Photos: 
https://www.pngwing.com/en/free-png-dcabk

Cute Squid 3D Model: 
This work is based on "Cute Squid" (https://sketchfab.com/3d-models/cute-squid-b6d6fcb905134cf9a33b068e2ebe1b0e) by Felix Yadomi (https://sketchfab.com/felixyadomi) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)