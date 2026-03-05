// Three.js 3D Brain Visualization with Dynamic Heat Map Stress Detection
let scene, camera, renderer, brain;
let brainMeshes = [];
let stressLevel = 0;
let targetStress = 0;
let animationId;

function initBrain() {
    const container = document.getElementById('brainContainer');
    if (!container) return;

    // Scene setup with gradient background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.Fog(0x000510, 8, 15);

    // Camera positioned for good brain view
    camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0.5, 2.5);

    // Renderer with better quality
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x0088ff, 0.6, 50);
    pointLight1.position.set(-8, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0088, 0.4, 50);
    pointLight2.position.set(8, -5, 5);
    scene.add(pointLight2);

    // Create the detailed brain
    createDetailedBrain();

    // Add mouse controls
    addMouseControls();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createDetailedBrain() {
    brain = new THREE.Group();

    // Left hemisphere with higher resolution
    const hemisphereGeometry = new THREE.IcosahedronGeometry(1, 7);
    
    const leftMaterial = new THREE.MeshStandardMaterial({
        color: 0x4466ff,
        emissive: 0x1144aa,
        metalness: 0.3,
        roughness: 0.4
    });
    const leftHemisphere = new THREE.Mesh(hemisphereGeometry, leftMaterial);
    leftHemisphere.position.x = -0.12;
    leftHemisphere.castShadow = true;
    leftHemisphere.receiveShadow = true;
    brain.add(leftHemisphere);
    brainMeshes.push(leftHemisphere);

    // Right hemisphere
    const rightMaterial = new THREE.MeshStandardMaterial({
        color: 0x4466ff,
        emissive: 0x1144aa,
        metalness: 0.3,
        roughness: 0.4
    });
    const rightHemisphere = new THREE.Mesh(hemisphereGeometry, rightMaterial);
    rightHemisphere.position.x = 0.12;
    rightHemisphere.castShadow = true;
    rightHemisphere.receiveShadow = true;
    brain.add(rightHemisphere);
    brainMeshes.push(rightHemisphere);

    // Cerebellum - back lower region
    const cerebellumGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const cerebellumMaterial = new THREE.MeshStandardMaterial({
        color: 0x5577dd,
        emissive: 0x1155bb,
        metalness: 0.3,
        roughness: 0.4
    });
    const cerebellum = new THREE.Mesh(cerebellumGeometry, cerebellumMaterial);
    cerebellum.position.set(0, -0.7, -0.8);
    cerebellum.scale.set(1, 0.7, 1);
    cerebellum.castShadow = true;
    cerebellum.receiveShadow = true;
    brain.add(cerebellum);
    brainMeshes.push(cerebellum);

    // Brain stem
    const stemGeometry = new THREE.CylinderGeometry(0.18, 0.25, 0.8, 16);
    const stemMaterial = new THREE.MeshStandardMaterial({
        color: 0x6688ff,
        emissive: 0x1166cc,
        metalness: 0.3,
        roughness: 0.4
    });
    const brainStem = new THREE.Mesh(stemGeometry, stemMaterial);
    brainStem.position.set(0, -1.1, -0.2);
    brainStem.castShadow = true;
    brainStem.receiveShadow = true;
    brain.add(brainStem);
    brainMeshes.push(brainStem);

    // Surface detail nodes for sulci/gyri appearance
    const detailCount = 80;
    for (let i = 0; i < detailCount; i++) {
        const detailGeometry = new THREE.SphereGeometry(0.07, 8, 8);
        const detailMaterial = new THREE.MeshStandardMaterial({
            color: 0x3355dd,
            emissive: 0x0033aa,
            metalness: 0.2,
            roughness: 0.5
        });
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);

        // Random position on brain surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.1;

        detail.position.x = radius * Math.sin(phi) * Math.cos(theta);
        detail.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
        detail.position.z = radius * Math.cos(phi);

        detail.castShadow = true;
        detail.receiveShadow = true;
        brain.add(detail);
        brainMeshes.push(detail);
    }

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
    targetStress = stress / 100;
    stressLevel += (targetStress - stressLevel) * 0.08;

    brainMeshes.forEach((mesh, index) => {
        if (mesh.material) {
            let stressColor = new THREE.Color();
            let emitColor = new THREE.Color();
            
            // Vibrant color gradient based on stress: Blue -> Cyan -> Green -> Yellow -> Orange -> Red
            if (stressLevel < 0.2) {
                // Blue
                stressColor.setHSL(0.65, 1.0, 0.4 + stressLevel * 0.2);
                emitColor.setHSL(0.65, 1.0, 0.3 + stressLevel * 0.3);
            } else if (stressLevel < 0.4) {
                // Cyan  
                stressColor.setHSL(0.5 - (stressLevel - 0.2) * 1, 1.0, 0.5);
                emitColor.setHSL(0.5 - (stressLevel - 0.2) * 1, 1.0, 0.5);
            } else if (stressLevel < 0.6) {
                // Green
                stressColor.setHSL(0.3 - (stressLevel - 0.4) * 1.5, 1.0, 0.5);
                emitColor.setHSL(0.3 - (stressLevel - 0.4) * 1.5, 1.0, 0.5);
            } else if (stressLevel < 0.8) {
                // Yellow
                stressColor.setHSL(0.15 - (stressLevel - 0.6) * 0.75, 1.0, 0.55);
                emitColor.setHSL(0.15 - (stressLevel - 0.6) * 0.75, 1.0, 0.55);
            } else {
                // Orange to Red
                stressColor.setHSL(0 - (stressLevel - 0.8) * 0.5, 1.0, 0.6);
                emitColor.setHSL(0 - (stressLevel - 0.8) * 0.5, 1.0, 0.6);
            }

            mesh.material.color.copy(stressColor);
            mesh.material.emissive.copy(emitColor);
            mesh.material.emissiveIntensity = 0.4 + stressLevel * 0.6;
        }
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (brain) {
        // Subtle continuous rotation
        brain.rotation.y += 0.0003;
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrain);
} else {
    initBrain();
}
