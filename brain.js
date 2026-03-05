// Enhanced 3D Brain Visualization with Realistic Model and Heatmap
let scene, camera, renderer, brain, controls;
let brainMeshes = [];
let stressLevel = 0;
let targetStress = 0;

function initBrain() {
    const container = document.getElementById('brainContainer');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1, 4);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Mouse Controls - OrbitControls from Three.js
    // Note: We'll use a simple manual control since OrbitControls requires separate import
    addMouseControls();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00b4ff, 1.2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);
    
    // Create realistic brain geometry
    createRealisticBrain();
    
    // Animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createRealisticBrain() {
    const brainGroup = new THREE.Group();
    
    // Main brain structure - more detailed cortex shape
    const brainGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Apply noise/deformation for realistic brain surface
    const positions = brainGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);
        
        // Add wrinkles and folds
        const noise = Math.sin(vertex.x * 5) * Math.cos(vertex.y * 5) * Math.sin(vertex.z * 5);
        vertex.multiplyScalar(1 + noise * 0.08);
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    brainGeometry.computeVertexNormals();
    
    // Main cortex material with vertex colors for heatmap
    const cortexMaterial = new THREE.MeshPhongMaterial({
        color: 0x9FA8DA,
        emissive: 0x4A5F8F,
        specular: 0x111111,
        shininess: 25,
        vertexColors: false,
        flatShading: false
    });
    
    const cortex = new THREE.Mesh(brainGeometry, cortexMaterial);
    brainMeshes.push(cortex);
    brainGroup.add(cortex);
    
    // Cerebellum (lower back part)
    const cerebellumGeom = new THREE.SphereGeometry(0.4, 32, 32);
    const cerebellumMat = cortexMaterial.clone();
    const cerebellum = new THREE.Mesh(cerebellumGeom, cerebellumMat);
    cerebellum.position.set(0, -0.6, -0.7);
    cerebellum.scale.set(1.2, 0.8, 1);
    brainMeshes.push(cerebellum);
    brainGroup.add(cerebellum);
    
    // Brain stem
    const stemGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.6, 16);
    const stemMat = cortexMaterial.clone();
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.set(0, -1, -0.2);
    brainMeshes.push(stem);
    brainGroup.add(stem);
    
    // Sulci (grooves) - darker lines
    const sulcusGeom = new THREE.TorusGeometry(0.9, 0.02, 8, 32);
    const sulcusMat = new THREE.MeshBasicMaterial({ color: 0x4A5F8F });
    
    for (let i = 0; i < 8; i++) {
        const sulcus = new THREE.Mesh(sulcusGeom, sulcusMat);
        sulcus.rotation.x = Math.PI / 2;
        sulcus.rotation.z = (Math.PI / 4) * i;
        sulcus.position.y = (Math.random() - 0.5) * 0.3;
        brainGroup.add(sulcus);
    }
    
    scene.add(brainGroup);
    brain = brainGroup;
}

function addMouseControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };
    let rotationSpeed = { x: 0.002, y: 0.002 };
    
    const container = renderer.domElement;
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    container.addEventListener('mousemove', (e) => {
        if (isDragging && brain) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;
            
            brain.rotation.y = rotation.y;
            brain.rotation.x = rotation.x;
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
    
    container.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(2, Math.min(8, camera.position.z));
    });
    
    // Auto-rotate when not dragging
    setInterval(() => {
        if (!isDragging && brain) {
            brain.rotation.y += rotationSpeed.y;
        }
    }, 16);
}

function updateBrainGlow(stress) {
    targetStress = stress;
    
    // Smooth transition
    stressLevel += (targetStress - stressLevel) * 0.05;
    
    brainMeshes.forEach(mesh => {
        if (stressLevel < 0.3) {
            // Low stress - cool blue/purple
            mesh.material.emissive.setHex(0x1a2f5f);
            mesh.material.emissiveIntensity = 0.3 + stressLevel * 0.2;
        } else if (stressLevel < 0.6) {
            // Medium stress - yellow/orange
            const t = (stressLevel - 0.3) / 0.3;
            const r = Math.floor(26 + t * (255 - 26));
            const g = Math.floor(47 + t * (165 - 47));
            const b = Math.floor(95 + t * (0 - 95));
            mesh.material.emissive.setRGB(r/255, g/255, b/255);
            mesh.material.emissiveIntensity = 0.5 + t * 0.3;
        } else {
            // High stress - red
            const t = (stressLevel - 0.6) / 0.4;
            mesh.material.emissive.setHex(0xff0000);
            mesh.material.emissiveIntensity = 0.8 + t * 0.4;
            
            // Pulsing effect for high stress
            const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
            mesh.material.emissiveIntensity *= pulse;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update brain glow based on current stress
    if (brainMeshes.length > 0) {
        updateBrainGlow(stressLevel);
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('brainContainer');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrain);
} else {
    initBrain();
}
