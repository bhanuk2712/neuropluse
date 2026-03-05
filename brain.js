// Enhanced 3D Brain Visualization with Sketchfab Model
let scene, camera, renderer, brain, controls;
let brainMeshes = [];
let stressLevel = 0;
let targetStress = 0;
let sketchfabClient;

function initBrain() {
    const container = document.getElementById('brainContainer');
    
    // Initialize Sketchfab Viewer
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'autoplay; fullscreen; xr-spatial-tracking';
    iframe.xr-spatial-tracking = true;
    iframe.execution-while-out-of-viewport = true;
    iframe.execution-while-not-rendered = true;
    iframe.web-share = true;
    iframe.src = 'https://sketchfab.com/models/7a27c17fd6c0488bb31ab093236a47fb/embed?autostart=1&ui_theme=dark&dnt=1';
    
    container.appendChild(iframe);
    
    // Initialize Sketchfab API
    const client = new Sketchfab(iframe);
    
    client.init({
        success: function onSuccess(api) {
            sketchfabClient = api;
            api.start();
            api.addEventListener('viewerready', function() {
                console.log('[SKETCHFAB] Viewer is ready');
                
                // Configure viewer settings
                api.setCameraLookAt([0, 0, 3], [0, 0, 0], 1);
                api.setEnableCameraConstraints(false, {});
                
                // Start animation loop for stress visualization
                animateStress();
            });
        },
        error: function onError() {
            console.log('[ERROR] Sketchfab API initialization failed');
            // Fallback to Three.js basic brain
            initFallbackBrain(container);
        }
    });
}

function initFallbackBrain(container) {
    // Fallback Three.js scene if Sketchfab fails
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
    
    // Mouse Controls
    addMouseControls();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x4488ff, 0.4);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    
    // Create stylized brain geometry
    createStylizedBrain();
    
    // Start animation
    animate();
}

function createStylizedBrain() {
    brain = new THREE.Group();
    
    // Main brain structure (two hemispheres)
    const hemisphereGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI);
    
    // Left hemisphere
    const leftMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        shininess: 30,
        transparent: true,
        opacity: 0.95
    });
    const leftHemisphere = new THREE.Mesh(hemisphereGeometry, leftMaterial);
    leftHemisphere.rotation.y = Math.PI / 2;
    leftHemisphere.position.x = -0.05;
    brain.add(leftHemisphere);
    brainMeshes.push(leftHemisphere);
    
    // Right hemisphere
    const rightMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        shininess: 30,
        transparent: true,
        opacity: 0.95
    });
    const rightHemisphere = new THREE.Mesh(hemisphereGeometry, rightMaterial);
    rightHemisphere.rotation.y = -Math.PI / 2;
    rightHemisphere.position.x = 0.05;
    brain.add(rightHemisphere);
    brainMeshes.push(rightHemisphere);
    
    // Cerebellum (back lower part)
    const cerebellumGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const cerebellumMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8fb3,
        shininess: 30,
        transparent: true,
        opacity: 0.95
    });
    const cerebellum = new THREE.Mesh(cerebellumGeometry, cerebellumMaterial);
    cerebellum.position.set(0, -0.6, -0.6);
    cerebellum.scale.set(1, 0.8, 1);
    brain.add(cerebellum);
    brainMeshes.push(cerebellum);
    
    // Brain stem
    const stemGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 16);
    const stemMaterial = new THREE.MeshPhongMaterial({
        color: 0xffa5c3,
        shininess: 30,
        transparent: true,
        opacity: 0.95
    });
    const brainStem = new THREE.Mesh(stemGeometry, stemMaterial);
    brainStem.position.set(0, -1, -0.3);
    brain.add(brainStem);
    brainMeshes.push(brainStem);
    
    // Add surface details (sulci/gyri effect)
    for (let i = 0; i < 40; i++) {
        const detailGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const detailMaterial = new THREE.MeshPhongMaterial({
            color: 0xff5a8d,
            transparent: true,
            opacity: 0.7
        });
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);
        
        // Random position on brain surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.05;
        
        detail.position.x = radius * Math.sin(phi) * Math.cos(theta);
        detail.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
        detail.position.z = radius * Math.cos(phi);
        
        brain.add(detail);
        brainMeshes.push(detail);
    }
    
    brain.rotation.x = 0.2;
    scene.add(brain);
}

function addMouseControls() {
    const container = renderer.domElement;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
    });
    
    container.addEventListener('mousemove', (e) => {
        if (isDragging && brain) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            brain.rotation.y += deltaMove.x * 0.01;
            brain.rotation.x += deltaMove.y * 0.01;
        }
        
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    
    container.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    });
}

function updateStressVisualization(stress) {
    targetStress = stress / 100; // Normalize to 0-1
    
    if (sketchfabClient) {
        // Update Sketchfab model materials
        sketchfabClient.getMaterialList(function(err, materials) {
            if (!err && materials) {
                materials.forEach(function(material) {
                    const color = getStressColor(stress);
                    sketchfabClient.setMaterial(material, {
                        channels: {
                            EmitColor: {
                                enable: true,
                                factor: targetStress,
                                color: color
                            }
                        }
                    });
                });
            }
        });
    } else if (brainMeshes.length > 0) {
        // Update fallback Three.js materials
        stressLevel += (targetStress - stressLevel) * 0.05;
        
        brainMeshes.forEach((mesh) => {
            if (mesh.material) {
                const baseColor = new THREE.Color(0xff6b9d);
                const stressColor = new THREE.Color(getStressColor(stress));
                mesh.material.color.lerpColors(baseColor, stressColor, stressLevel);
                mesh.material.emissive = stressColor;
                mesh.material.emissiveIntensity = stressLevel * 0.5;
            }
        });
    }
}

function getStressColor(stress) {
    // Color gradient: Green (low) -> Yellow (medium) -> Red (high)
    if (stress < 33) {
        return [0.2, 1.0, 0.3]; // Green
    } else if (stress < 66) {
        return [1.0, 0.8, 0.0]; // Yellow
    } else {
        return [1.0, 0.2, 0.2]; // Red
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (brain) {
        brain.rotation.y += 0.001;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function animateStress() {
    // This runs for Sketchfab viewer
    setInterval(() => {
        if (sketchfabClient && targetStress !== stressLevel) {
            stressLevel += (targetStress - stressLevel) * 0.05;
        }
    }, 50);
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('brainContainer');
    if (camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrain);
} else {
    initBrain();
}
