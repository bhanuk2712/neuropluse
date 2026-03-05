// Three.js 3D Brain Visualization with Heat Map Stress Detection
let scene, camera, renderer, brain, controls;
let brainMeshes = [];
let stressLevel = 0;
let targetStress = 0;
let animationId;

function initBrain() {
    const container = document.getElementById('brainContainer');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 3);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff88, 0.5);
    pointLight.position.set(-5, 3, 3);
    scene.add(pointLight);

    // Create detailed brain
    createDetailedBrain();

    // Mouse controls
    addMouseControls();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createDetailedBrain() {
    brain = new THREE.Group();

    // Create main cerebral hemispheres with higher geometry
    const hemisphereGeometry = new THREE.IcosahedronGeometry(1, 6);

    // Left hemisphere
    const leftMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a5f8f,
        emissive: 0x1a3f5f,
        shininess: 100,
        wireframe: false
    });
    const leftHemisphere = new THREE.Mesh(hemisphereGeometry, leftMaterial);
    leftHemisphere.position.x = -0.1;
    leftHemisphere.castShadow = true;
    leftHemisphere.receiveShadow = true;
    brain.add(leftHemisphere);
    brainMeshes.push(leftHemisphere);

    // Right hemisphere
    const rightMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a5f8f,
        emissive: 0x1a3f5f,
        shininess: 100,
        wireframe: false
    });
    const rightHemisphere = new THREE.Mesh(hemisphereGeometry, rightMaterial);
    rightHemisphere.position.x = 0.1;
    rightHemisphere.castShadow = true;
    rightHemisphere.receiveShadow = true;
    brain.add(rightHemisphere);
    brainMeshes.push(rightHemisphere);

    // Cerebellum (back lower region)
    const cerebellumGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const cerebellumMaterial = new THREE.MeshPhongMaterial({
        color: 0x5a7f9f,
        emissive: 0x2a4f6f,
        shininess: 80
    });
    const cerebellum = new THREE.Mesh(cerebellumGeometry, cerebellumMaterial);
    cerebellum.position.set(0, -0.7, -0.8);
    cerebellum.scale.set(1, 0.7, 1);
    cerebellum.castShadow = true;
    cerebellum.receiveShadow = true;
    brain.add(cerebellum);
    brainMeshes.push(cerebellum);

    // Brain stem
    const stemGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.7, 16);
    const stemMaterial = new THREE.MeshPhongMaterial({
        color: 0x6a8faf,
        emissive: 0x3a5f7f,
        shininess: 90
    });
    const brainStem = new THREE.Mesh(stemGeometry, stemMaterial);
    brainStem.position.set(0, -1.1, -0.2);
    brainStem.castShadow = true;
    brainStem.receiveShadow = true;
    brain.add(brainStem);
    brainMeshes.push(brainStem);

    // Add surface detail nodes (sulci/gyri effect)
    const detailCount = 60;
    for (let i = 0; i < detailCount; i++) {
        const detailGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const detailMaterial = new THREE.MeshPhongMaterial({
            color: 0x3a4f7f,
            emissive: 0x1a2f5f,
            shininess: 70
        });
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);

        // Random position on surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.08;

        detail.position.x = radius * Math.sin(phi) * Math.cos(theta);
        detail.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
        detail.position.z = radius * Math.cos(phi);

        detail.castShadow = true;
        detail.receiveShadow = true;
        brain.add(detail);
        brainMeshes.push(detail);
    }

    // Initial rotation
    brain.rotation.x = 0.2;
    brain.rotation.z = 0.1;

    scene.add(brain);
}

function addMouseControls() {
    const container = renderer.domElement;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging && brain) {
            const deltaX = e.offsetX - previousMousePosition.x;
            const deltaY = e.offsetY - previousMousePosition.y;

            brain.rotation.y += deltaX * 0.01;
            brain.rotation.x += deltaY * 0.01;
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.005;
        camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
    });
}

function updateStressVisualization(stress) {
    targetStress = stress / 100; // Normalize to 0-1
    
    // Smooth interpolation
    stressLevel += (targetStress - stressLevel) * 0.05;

    // Update brain mesh colors based on stress
    brainMeshes.forEach((mesh, index) => {
        if (mesh.material) {
            let stressColor = new THREE.Color();
            
            // Color gradient: Blue (low stress) -> Green -> Yellow -> Orange -> Red (high stress)
            if (stressLevel < 0.25) {
                // Blue to Green
                stressColor.setHSL(0.55 - stressLevel * 0.8, 0.8, 0.4);
            } else if (stressLevel < 0.5) {
                // Green to Yellow
                stressColor.setHSL(0.35 - (stressLevel - 0.25) * 0.8, 0.8, 0.45);
            } else if (stressLevel < 0.75) {
                // Yellow to Orange
                stressColor.setHSL(0.1 - (stressLevel - 0.5) * 0.4, 0.9, 0.5);
            } else {
                // Orange to Red
                stressColor.setHSL(0 - (stressLevel - 0.75) * 0.2, 1.0, 0.5);
            }

            // Apply color with intensity variation by index
            const intensity = 0.5 + (index % brainMeshes.length) / (brainMeshes.length * 2);
            mesh.material.color.copy(stressColor);
            mesh.material.emissive.copy(stressColor).multiplyScalar(stressLevel * 0.7);
            mesh.material.emissiveIntensity = stressLevel * 0.5;
        }
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (brain) {
        // Subtle auto-rotation when not dragging
        brain.rotation.y += 0.0002;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    const container = document.getElementById('brainContainer');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrain);
} else {
    initBrain();
}
