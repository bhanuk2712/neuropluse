// 3D Brain Visualization with Three.js
let scene, camera, renderer, brain;
let brainGlowing = false;

function initBrain() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    
    camera = new THREE.PerspectiveCamera(
        75,
        document.getElementById('brainContainer').clientWidth / 
        document.getElementById('brainContainer').clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3;
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
        document.getElementById('brainContainer').clientWidth,
        document.getElementById('brainContainer').clientHeight
    );
    renderer.shadowMap.enabled = true;
    document.getElementById('brainContainer').appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00b4ff, 1.5);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.8);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Create simplified brain using geometry
    createBrainGeometry();
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (brain) {
            brain.rotation.y += 0.005;
            brain.rotation.x += 0.002;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createBrainGeometry() {
    // Create a stylized brain using multiple spheres and shapes
    const brainGroup = new THREE.Group();
    
    // Main brain hemisphere - left
    const leftGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a5f8f,
        emissive: 0x1a2f5f,
        shininess: 100,
        wireframe: false
    });
    const leftBrain = new THREE.Mesh(leftGeometry, brainMaterial.clone());
    leftBrain.scale.x = 0.9;
    leftBrain.position.x = -0.3;
    brainGroup.add(leftBrain);
    
    // Main brain hemisphere - right
    const rightBrain = new THREE.Mesh(leftGeometry, brainMaterial.clone());
    rightBrain.scale.x = 0.9;
    rightBrain.position.x = 0.3;
    brainGroup.add(rightBrain);
    
    // Frontal lobe highlights
    const frontalGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const highlightMaterial = new THREE.MeshPhongMaterial({
        color: 0x00b4ff,
        emissive: 0x0066ff,
        shininess: 100
    });
    const frontal = new THREE.Mesh(frontalGeometry, highlightMaterial.clone());
    frontal.position.z = 1.2;
    frontal.position.y = 0.5;
    frontal.scale.set(0.8, 0.7, 0.6);
    brainGroup.add(frontal);
    
    // Temporal lobes
    const temporal = new THREE.Mesh(frontalGeometry, highlightMaterial.clone());
    temporal.position.z = 0.5;
    temporal.position.y = -0.3;
    temporal.scale.set(0.5, 0.4, 0.5);
    brainGroup.add(temporal);
    
    // Occipital lobe
    const occipital = new THREE.Mesh(frontalGeometry, brainMaterial.clone());
    occipital.position.z = -1;
    occipital.position.y = -0.2;
    occipital.scale.set(0.7, 0.6, 0.6);
    brainGroup.add(occipital);
    
    scene.add(brainGroup);
    brain = brainGroup;
}

function updateBrainGlow(stressLevel) {
    if (!brain) return;
    
    // Update emissive properties based on stress level
    brain.traverse(function(node) {
        if (node.isMesh) {
            if (stressLevel < 0.4) {
                // Relaxed - blue glow
                node.material.emissive.setHex(0x1a2f5f);
                node.material.emissiveIntensity = 0.3;
            } else if (stressLevel < 0.65) {
                // Moderate - orange/yellow glow
                node.material.emissive.setHex(0xff6600);
                node.material.emissiveIntensity = 0.5;
            } else {
                // High stress - red glow
                node.material.emissive.setHex(0xff0000);
                node.material.emissiveIntensity = 0.8;
            }
        }
    });
}

function onWindowResize() {
    const container = document.getElementById('brainContainer');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize brain when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrain);
} else {
    initBrain();
}
